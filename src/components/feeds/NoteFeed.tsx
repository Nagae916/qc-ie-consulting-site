// src/components/feeds/NoteFeed.tsx
import { useCallback, useEffect, useMemo, useState } from "react";

type Item = { title: string; link: string; pubDate: string | null; excerpt: string };

export default function NoteFeed({ limit = 6, user }: { limit?: number; user?: string }) {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  // フェッチURLは依存が変わるたびに再計算
  const requestUrl = useMemo(() => {
    const qs = new URLSearchParams({ limit: String(limit) });
    if (user) qs.set("user", user.replace(/^@/, ""));
    qs.set("_", String(Date.now()));
    return `/api/note?${qs.toString()}`;
  }, [limit, user]);

  const fetchNotes = useCallback(
    async (signal?: AbortSignal | null) => {
      try {
        // ← ここが重要：signal があるときだけプロパティに含める
        const init: RequestInit = { cache: "no-store", ...(signal ? { signal } : {}) };
        const res = await fetch(requestUrl, init);
        const json = await res.json().catch(() => ({ data: [] as any[] }));
        const arr: any[] = Array.isArray(json) ? json : Array.isArray(json?.data) ? json.data : [];

        const normalized: Item[] = arr
          .map((it) => ({
            title: String(it.title || ""),
            link: String(it.link || ""),
            pubDate: typeof it.isoDate === "string" ? new Date(it.isoDate).toISOString() : null,
            excerpt: String(it.contentSnippet || ""),
          }))
          .filter((x) => x.title && x.link)
          .sort(
            (a, b) =>
              new Date(b.pubDate || 0).getTime() - new Date(a.pubDate || 0).getTime()
          )
          .slice(0, limit);

        setItems(normalized);
      } catch {
        setItems([]);
      } finally {
        setLoading(false);
      }
    },
    [requestUrl, limit]
  );

  useEffect(() => {
    setLoading(true);
    const ac = new AbortController();
    fetchNotes(ac.signal);

    const onVis = () => {
      if (document.visibilityState === "visible") fetchNotes(null);
    };
    document.addEventListener("visibilitychange", onVis);

    const iv = window.setInterval(() => fetchNotes(null), 5 * 60 * 1000); // 5分

    return () => {
      ac.abort();
      clearInterval(iv);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [fetchNotes]);

  if (loading) return <div className="p-4 text-gray-600">note記事を読み込み中…</div>;
  if (!items.length) return <div className="p-4 text-gray-600">表示できる記事がありません。</div>;

  return (
    <div className="rounded-xl2 bg-white shadow-soft border border-brand-200">
      <div className="px-5 py-4 border-b border-brand-200 bg-brand-100/60 rounded-t-xl2">
        <h3 className="font-semibold text-brand-900">note（最新）</h3>
        <p className="text-xs text-gray-600 mt-1">RSSから自動取得（クライアント側でも定期更新）</p>
      </div>
      <ul className="divide-y divide-brand-200">
        {items.map((it) => (
          <li key={it.link} className="p-4 hover:bg-brand-50/60 transition">
            <a href={it.link} target="_blank" rel="noopener noreferrer" className="block">
              <p className="font-medium text-brand-900">{it.title}</p>
              <p className="text-xs text-gray-500 mt-1">
                {it.pubDate ? new Date(it.pubDate).toLocaleString("ja-JP", { hour12: false }) : ""}
              </p>
              <p className="text-sm text-gray-700 mt-1">{it.excerpt}</p>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
