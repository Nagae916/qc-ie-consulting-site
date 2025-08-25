import { useEffect, useState } from "react";

type NewsItem = {
  title: string;
  link: string;
  source: string;
  pubDate: string | null;
};

export default function NewsFeed({ limit = 8 }: { limit?: number }) {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/news?limit=${limit}`)
      .then((r) => r.json())
      .then((d) => setItems(d))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [limit]);

  return (
    <div className="rounded-xl2 bg-white shadow-soft border border-brand-200">
      <div className="px-5 py-4 border-b border-brand-200 bg-brand-100/60 rounded-t-xl2">
        <h3 className="font-semibold text-brand-900">ニュース（経営工学／品質管理）</h3>
        <p className="text-xs text-gray-600 mt-1">
          GoogleニュースRSSから自動収集（30分キャッシュ）
        </p>
      </div>

      {loading ? (
        <div className="p-6 text-gray-600">読み込み中...</div>
      ) : items.length === 0 ? (
        <div className="p-6 text-gray-600">現在表示できるニュースはありません。</div>
      ) : (
        <ul className="divide-y divide-brand-200">
          {items.map((it) => (
            <li key={it.link} className="p-4 hover:bg-brand-50/60 transition">
              <a href={it.link} target="_blank" rel="noopener noreferrer" className="block">
                <p className="font-medium text-brand-900">{it.title}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {it.source}
                  {it.pubDate ? ` ・ ${new Date(it.pubDate).toLocaleString("ja-JP")}` : ""}
                </p>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
