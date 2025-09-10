// src/components/feeds/NewsFeed.tsx
import { useCallback, useEffect, useMemo, useState } from "react";
// エイリアスに依存しない相対参照（環境差で壊れない）
import { feedApiPath } from "../../lib/routes";

type NewsItem = {
  title: string;
  link: string;
  source: string;
  pubDate: string | null; // ISO8601 or null
};

function hostOf(url: string) {
  try {
    const h = new URL(url).hostname;
    return h.startsWith("www.") ? h.slice(4) : h;
  } catch {
    return "";
  }
}

export default function NewsFeed({
  limit = 5,
  // 未使用警告を出さないために _variant として受ける（UIはカード固定）
  variant: _variant = "card",
}: {
  limit?: number;
  variant?: "card" | "list";
}) {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  const requestUrl = useMemo(() => feedApiPath("news", limit), [limit]);

  const fetchNews = useCallback(
    async (signal?: AbortSignal | null) => {
      try {
        const init: RequestInit = { cache: "no-store", ...(signal ? { signal } : {}) };
        const r = await fetch(requestUrl, init);
        const data: any[] = await r.json().catch(() => []);

        // /api/feeds/news の正規化スキーマに合わせる（pubDate を使用）
        const list: NewsItem[] = (Array.isArray(data) ? data : [])
          .map((it) => ({
            title: String(it?.title || ""),
            link: String(it?.link || ""),
            source: String(it?.source || ""),
            pubDate: typeof it?.pubDate === "string" ? it.pubDate : null,
          }))
          .filter((x) => x.title && x.link)
          .slice(0, limit);

        setItems(list);
      } catch {
        setItems([]);
      } finally {
        setLoading(false);
      }
    },
    [limit, requestUrl]
  );

  useEffect(() => {
    setLoading(true);
    const ac = new AbortController();
    fetchNews(ac.signal);
    return () => ac.abort();
  }, [fetchNews]);

  const Header = (
    <div className="px-5 py-4 border-b border-brand-200 bg-brand-100/60 rounded-t-xl2">
      <h3 className="font-semibold text-brand-900">ニュース（経営工学／品質管理）</h3>
      <p className="text-xs text-gray-600 mt-1">GoogleニュースRSSから自動収集（30分キャッシュ）</p>
    </div>
  );

  return (
    <div className="rounded-xl2 bg-white shadow-soft border border-brand-200">
      {Header}
      <div className="p-4 grid grid-cols-1 gap-3">
        {loading ? (
          <div className="text-gray-600">読み込み中...</div>
        ) : items.length === 0 ? (
          <div className="text-gray-600">現在表示できるニュースはありません。</div>
        ) : (
          items.map((it, idx) => (
            <a
              key={it.link || `${it.title}-${idx}`}
              href={it.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-xl border border-black/10 bg-white p-4 shadow-sm hover:shadow-md transition"
            >
              <p className="font-medium text-gray-900 line-clamp-2">{it.title}</p>
              <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                <span>{it.source || hostOf(it.link)}</span>
                <span>
                  {it.pubDate
                    ? new Date(it.pubDate).toLocaleString("ja-JP", { hour12: false })
                    : ""}
                </span>
              </div>
            </a>
          ))
        )}
      </div>
    </div>
  );
}
