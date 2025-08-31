// src/components/feeds/NoteFeed.tsx
import { useEffect, useState } from "react";

type Item = { title: string; link: string; pubDate: string | null; excerpt: string };

export default function NoteFeed({ limit = 6, user }: { limit?: number; user?: string }) {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotes = async () => {
    try {
      const qs = new URLSearchParams({ limit: String(limit) });
      if (user) qs.set("user", user.replace(/^@/, ""));
      const res = await fetch(`/api/note?${qs.toString()}&_=${Date.now()}`, { cache: "no-store" });
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
        .sort((a, b) => (new Date(b.pubDate || 0).getTime() - new Date(a.pubDate || 0).getTime()))
        .slice(0, limit);

      setItems(normalized);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetchNotes();

    const iv = window.setInterval(() => mounted && fetchNotes(), 5 * 60 * 1000); // 5分
    const onVis = () => document.visibilityState === "visible" && fetchNotes();
    document.addEventListener("visibilitychange", onVis);

    return () => {
      mounted = false;
      clearInterval(iv);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [limit, user]);

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
              <p className="text-xs text-gray-500 mt-1">{it.pubDate ? new Date(it.pubDate).toLocaleString("ja-JP") : ""}</p>
              <p className="text-sm text-gray-700 mt-1">{it.excerpt}</p>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
