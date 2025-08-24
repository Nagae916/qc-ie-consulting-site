"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

type Item = {
  id: string;
  caption: string;
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  media_url: string;
  thumbnail_url: string;
  permalink: string;
  timestamp: string;
};

export default function InstagramFeed() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setErr(null);
        const res = await fetch("/api/instagram", { cache: "no-store" });
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
        const json = await res.json();
        setItems(json.items ?? []);
      } catch (e: any) {
        setErr(e?.message ?? "fetch failed");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <p>読み込み中…</p>;
  if (err) return <p style={{ color: "crimson" }}>取得に失敗しました: {err}</p>;

  return (
    <ul style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))" }}>
      {items.map((it) => (
        <li key={it.id} style={{ border: "1px solid #e5e7eb", borderRadius: 12, overflow: "hidden" }}>
          <Link href={it.permalink} target="_blank">
            <div style={{ position: "relative", width: "100%", aspectRatio: "1 / 1" }}>
              <Image
                src={it.thumbnail_url}
                alt={it.caption || "Instagram post"}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                style={{ objectFit: "cover" }}
                priority
              />
            </div>
            <div style={{ padding: 12, fontSize: 14, lineHeight: 1.4 }}>
              {it.caption ? it.caption.slice(0, 100) : "（キャプションなし）"}
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
