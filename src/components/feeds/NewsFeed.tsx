// src/components/feeds/NewsFeed.tsx
import { useEffect, useState } from 'react';

type NewsItem = {
  title: string;
  link: string;
  source: string;
  pubDate: string | null;
};
type RawNews = any;

function toArray<T = unknown>(v: unknown): T[] {
  if (Array.isArray(v)) return v as T[];
  if (v && typeof v === 'object' && Array.isArray((v as any).items)) {
    return (v as any).items as T[];
  }
  return [];
}

// 正規表現を使わずに www. を除去（パーサ誤検出対策）
function hostOf(url: string) {
  try {
    const h = new URL(url).hostname;
    return h.startsWith('www.') ? h.slice(4) : h;
  } catch {
    return '';
  }
}

function sanitize(raw: RawNews): NewsItem | null {
  const title = typeof raw?.title === 'string' ? raw.title : '';
  const link =
    (typeof raw?.link === 'string' && raw.link) ||
    (typeof raw?.guid === 'string' && raw.guid) ||
    '';
  const source =
    (typeof raw?.source === 'string' && raw.source) ||
    (typeof raw?.source === 'object' && typeof raw?.source?.title === 'string' && raw.source.title) ||
    '';
  let pubDate: string | null = null;

  const pd = raw?.pubDate ?? raw?.isoDate ?? raw?.date ?? null;
  if (typeof pd === 'string') {
    const d = new Date(pd);
    if (!Number.isNaN(d.getTime())) pubDate = d.toISOString();
  }
  if (!title || !link) return null;
  return { title, link, source, pubDate };
}

export default function NewsFeed({
  limit = 5,
  variant = 'card',
}: {
  limit?: number;
  variant?: 'card' | 'list';
}) {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const r = await fetch(`/api/news?limit=${limit}&_=${Date.now()}`, { cache: 'no-store' });
        if (!r.ok) {
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

  const Header = (
    <div className="px-5 py-4 border-b border-brand-200 bg-brand-100/60 rounded-t-xl2">
      <h3 className="font-semibold text-brand-900">ニュース（経営工学／品質管理）</h3>
      <p className="text-xs text-gray-600 mt-1">GoogleニュースRSSから自動収集（30分キャッシュ）</p>
    </div>
  );

  if (loading) {
    return (
      <div className="rounded-xl2 bg-white shadow-soft border border-brand-200">
        {Header}
        <div className="p-6 text-gray-600">読み込み中...</div>
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="rounded-xl2 bg-white shadow-soft border border-brand-200">
        {Header}
        <div className="p-6 text-gray-600">現在表示できるニュースはありません。</div>
      </div>
    );
  }

  if (variant === 'list') {
    return (
      <div className="rounded-xl2 bg-white shadow-soft border border-brand-200">
        {Header}
        <ul className="divide-y divide-brand-200">
          {items.map((it, idx) => (
            <li key={it.link || `${it.title}-${idx}`} className="p-4 hover:bg-brand-50/60 transition">
              <a href={it.link} target="_blank" rel="noopener noreferrer" className="block">
                <p className="font-medium text-brand-900">{it.title}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {(it.source || hostOf(it.link)) || ''}
                  {it.pubDate ? ` ・ ${new Date(it.pubDate).toLocaleString('ja-JP', { hour12: false })}` : ''}
                </p>
              </a>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  // カード表示
  return (
    <div className="rounded-xl2 bg-white shadow-soft border border-brand-200">
      {Header}
      <div className="p-4 grid grid-cols-1 gap-3">
        {items.map((it, idx) => (
          <a
            key={it.link || `${it.title}-${idx}`}
            href={it.link}
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-xl border border-black/10 bg-white p-4 shadow-sm hover:shadow-md transition"
          >
            <p className="font-medium text-gray-900 line-clamp-2">{it.title}</p>
            <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
              <span>{(it.source || hostOf(it.link)) || ''}</span>
              <span>{it.pubDate ? new Date(it.pubDate).toLocaleString('ja-JP', { hour12: false }) : ''}</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
