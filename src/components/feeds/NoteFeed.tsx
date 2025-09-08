// src/components/feeds/NoteFeed.tsx
import { useCallback, useEffect, useMemo, useState } from "react";
import { feedApiPath } from "@/lib/routes";

type Item = { title: string; link: string; pubDate: string | null; excerpt: string };

export default function NoteFeed({ limit = 6, user }: { limit?: number; user?: string }) {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  const normalizedUser = useMemo(() => (user ? user.replace(/^@/, "") : undefined), [user]);
  const requestUrl = useMemo(
    () => feedApiPath("note", limit, normalizedUser ? { user: normalizedUser } : undefined),
    [limit, normalizedUser]
  );

  const fetchNotes = useCallback(async (signal?: AbortSignal | null) => {
    try {
      const init: RequestInit = { cache: "no-store", ...(signal ? { signal } : {}) };
      const res = await fetch(requestUrl, init);
      const arr: any[] = await res.json().catch(() => []);
      const normalized: Item[] = (Array.isArray(arr) ? arr : [])
        .map((it) => ({
          title: String(it.title || ""),
          link: String(it.link || ""),
          pubDate: typeof it.isoDate === "string" ? it.isoDate : null,
          excerpt: String(it.description || ""),
        }))
        .filter((x) => x.title && x.link)
        .slice(0, limit);
      setItems(normalized);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [limit, requestUrl]);

  useEffect(() => {
    setLoading(true);
    const ac = new AbortController();
    fetchNotes(ac.signal);
    return () => ac.abort();
  }, [fetchNotes]);

  if (loading) return <div className="p-4 text-gray-600">note記事を読み込み中…</div>;
  if (!items.length) return <div className="p-4 text-gray-600">表示できる記事がありません。</div>;

  return (
    <div className="rounded-xl2 bg-white shadow-soft border border-brand-200">
      <div className="px-5 py-4 border-b border-brand-200 bg-brand-100/60 rounded-t-xl2">
        <h3 className="font-semibold text-brand-900">note（最新）</h3>
        <p className="text-xs text-gray-600 mt-1">RSSから自動取得（30分キャッシュ）</p>
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
