// src/components/NoteFeed.tsx
import { useEffect, useState } from "react";

type Item = { title: string; link: string; pubDate: string | null; excerpt: string; };

export default function NoteFeed({ limit = 6 }: { limit?: number }) {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/note?limit=${limit}`)
      .then((r) => r.json())
      .then((d) => setItems(d))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [limit]);

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
                {it.pubDate ? new Date(it.pubDate).toLocaleString("ja-JP") : ""}
              </p>
              <p className="text-sm text-gray-700 mt-1">{it.excerpt}</p>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
