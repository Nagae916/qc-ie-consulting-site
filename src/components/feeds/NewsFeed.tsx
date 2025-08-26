// src/components/feeds/NewsFeed.tsx
import { useEffect, useState } from "react";

type NewsItem = {
  title: string;
  link: string;
  source: string;
  pubDate: string | null;
};

type RawNews = any;

// 配列/非配列どちらでも受けて配列にする
function toArray<T = unknown>(v: unknown): T[] {
  if (Array.isArray(v)) return v as T[];
  if (v && typeof v === "object" && Array.isArray((v as any).items)) {
    return (v as any).items as T[];
  }
  return [];
}

// 1件を安全に整形（欠損時は null）
function sanitize(raw: RawNews): NewsItem | null {
  const title = typeof raw?.title === "string" ? raw.title : "";
  const link = typeof raw?.link === "string" ? raw.link : "";
  const source = typeof raw?.source === "string" ? raw.source : "";

  let pubDate: string | null = null;
  const pd = raw?.pubDate ?? raw?.date ?? null;
  if (typeof pd === "string") {
    const d = new Date(pd);
    if (!Number.isNaN(d.getTime())) pubDate = d.toISOString();
  }

  if (!title || !link) return null; // 最低限の要件を満たさないものは捨てる
  return { title, link, source: source || "", pubDate };
}

export default function NewsFeed({ limit = 8 }: { limit?: number }) {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const r = await fetch(`/api/news?limit=${limit}`, { cache: "no-store" });
        if (!r.ok) {
          // 404/502 などは空配列で耐える
          if (mounted) setItems([]);
          return;
        }
        const data = await r.json().catch(() => []);
        const list = toArray<RawNews>(data)
          .map(sanitize)
          .filter((x): x is NewsItem => !!x)
          .slice(0, limit);

        if (mounted) setItems(list);
      } catch {
        if (mounted) setItems([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [limit]);

  return (
    <div className="rounded-xl2 bg-white shadow-soft border border-brand-200">
      <div className="px-5 py-4 border-b border-brand-200 bg-brand-100/60 rounded-t-xl2">
        <h3 className="font-semibold text-brand-900">ニュース（経営工学／品質管理）</h3>
        <p className="text-xs text-gray-600 mt-1">GoogleニュースRSSから自動収集（30分キャッシュ）</p>
      </div>

      {loading ? (
        <div className="p-6 text-gray-600">読み込み中...</div>
      ) : items.length === 0 ? (
        <div className="p-6 text-gray-600">現在表示できるニュースはありません。</div>
      ) : (
        <ul className="divide-y divide-brand-200">
          {items.map((it, idx) => (
            <li key={it.link || `${it.title}-${idx}`} className="p-4 hover:bg-brand-50/60 transition">
              <a href={it.link} target="_blank" rel="noopener noreferrer" className="block">
                <p className="font-medium text-brand-900">{it.title}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {it.source}
                  {it.pubDate
                    ? ` ・ ${new Date(it.pubDate).toLocaleString("ja-JP", { hour12: false })}`
                    : ""}
                </p>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
