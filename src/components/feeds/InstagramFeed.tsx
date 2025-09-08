// src/components/feeds/InstagramFeed.tsx
"use client";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { feedApiPath } from "@/lib/routes";

type Item = {
  id: string;
  caption: string;
  media_url: string | null;     // 画像URL（無い場合は null）
  permalink: string;            // 投稿ページ
  timestamp: string | null;     // ISO
};

function stripHtml(html?: string): string {
  if (!html) return "";
  return html.replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]+>/g, "").trim();
}

/** description 等から最初の画像URLを抽出（RSSHubのInstagramに対応） */
function firstImageFromHtml(html?: string): string | null {
  if (!html) return null;
  const m = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return m?.[1] ?? null;
}

export default function InstagramFeed({ limit = 3 }: { limit?: number }) {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // 集約APIを使用（.env の INSTAGRAM_RSS_URL を参照）
  const requestUrl = useMemo(() => feedApiPath("instagram", limit), [limit]);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        setLoading(true);
        setErr(null);

        // CDNキャッシュを活かす（no-storeやtimestampは付けない）
        const res = await fetch(requestUrl);
        const data: any[] = await res.json().catch(() => []);
        const arr = Array.isArray(data) ? data : [];

        const mapped: Item[] = arr
          .map((it, idx) => {
            const link: string = String(it.link || "");
            const title = String(it.title || "");
            const desc = String(it.description || it.contentSnippet || "");
            const img =
              (it.image as string | undefined) ||
              (it.media_url as string | undefined) ||
              (it.thumbnail as string | undefined) ||
              (it.enclosure?.url as string | undefined) ||
              firstImageFromHtml(desc);

            const ts =
              typeof it.pubDate === "string"
                ? new Date(it.pubDate).toISOString()
                : typeof it.isoDate === "string"
                ? new Date(it.isoDate).toISOString()
                : null;

            return {
              id: link || `ig-${idx}`,
              caption: stripHtml(title || desc) || "（キャプションなし）",
              media_url: img ?? null,
              permalink: link || "#",
              timestamp: ts,
            };
          })
          .filter((x) => !!x.permalink);

        // ▼ 「直近3件」を保証：時刻降順に並べてから slice
        const sorted = mapped.sort(
          (a, b) =>
            new Date(b.timestamp || 0).getTime() - new Date(a.timestamp || 0).getTime()
        );
        const limited = sorted.slice(0, limit);

        if (mounted) setItems(limited);
      } catch (e: any) {
        if (mounted) setErr(e?.message ?? "取得に失敗しました");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();

    // 画面復帰時＆5分ごとに再取得（軽量：CDNキャッシュあり）
    const onVis = () => {
      if (document.visibilityState === "visible") load();
    };
    document.addEventListener("visibilitychange", onVis);
    const iv = window.setInterval(load, 5 * 60 * 1000);

    return () => {
      mounted = false;
      clearInterval(iv);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [requestUrl, limit]);

  if (loading) return <p>読み込み中…</p>;
  if (err)
    return (
      <div
        style={{
          border: "1px solid #fca5a5",
          background: "#fee2e2",
          color: "#7f1d1d",
          padding: 12,
          borderRadius: 8,
        }}
      >
        Instagramの取得に失敗しました。
        <br />
        <span style={{ fontSize: 12 }}>{err}</span>
      </div>
    );
  if (!items.length) return <p>表示できる投稿がありません。</p>;

  return (
    <ul
      style={{
        display: "grid",
        gap: 16,
        gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
      }}
    >
      {items.map((it) => (
        <li
          key={it.id}
          style={{ border: "1px solid #e5e7eb", borderRadius: 12, overflow: "hidden" }}
        >
          <Link href={it.permalink} target="_blank">
            <div style={{ position: "relative", width: "100%", aspectRatio: "1 / 1" }}>
              {it.media_url ? (
                <Image
                  src={it.media_url}
                  alt={it.caption || "Instagram post"}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  style={{ objectFit: "cover" }}
                  priority
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "grid",
                    placeItems: "center",
                    background: "#f3f4f6",
                    color: "#6b7280",
                    fontSize: 12,
                    padding: 12,
                    textAlign: "center",
                  }}
                >
                  画像のプレビューを取得できませんでした
                </div>
              )}
            </div>
            <div style={{ padding: 12, fontSize: 14, lineHeight: 1.4 }}>
              {it.caption ? it.caption.slice(0, 100) : "（キャプションなし）"}
            </div>
            <div style={{ padding: "0 12px 12px", fontSize: 12, color: "#6b7280" }}>
              {it.timestamp
                ? new Date(it.timestamp).toLocaleString("ja-JP", { hour12: false })
                : ""}
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
