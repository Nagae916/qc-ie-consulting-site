// src/components/feeds/NewsFeed.tsx
'use client';

import { useEffect, useState } from 'react';
// エイリアスに依存しない相対参照（環境差で壊れない）
import { feedApiPath } from '../../lib/routes';

type NewsItem = {
  title: string;
  link: string;
  source: string;
  pubDate: string | null; // ISO8601 or null
};

function hostOf(url: string) {
  try {
    const h = new URL(url).hostname;
    return h.startsWith('www.') ? h.slice(4) : h;
  } catch {
    return '';
  }
}

export default function NewsFeed({
  limit = 5,
  // レイアウトはカード固定。未使用警告を避けるため _variant で受ける
  variant: _variant = 'card',
  items,
}: {
  limit?: number;
  variant?: 'card' | 'list';
  /** SSR/ISR で渡される初期アイテム（推奨運用） */
  items?: NewsItem[];
}) {
  // items が来ていればそれを表示。無ければ一度だけ取得。
  const [data, setData] = useState<NewsItem[]>(items ?? []);
  const [loading, setLoading] = useState(!items || items.length === 0);

  useEffect(() => {
    if (items && items.length > 0) {
      setData(items);
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    const load = async () => {
      try {
        setLoading(true);
        const r = await fetch(feedApiPath('news', limit), {
          cache: 'no-store',
          signal: controller.signal,
        });
        const raw: any[] = (await r.json().catch(() => [])) ?? [];
        const list: NewsItem[] = raw
          .map((it) => ({
            title: String(it?.title || ''),
            link: String(it?.link || ''),
            source: String(it?.source || ''),
            pubDate: typeof it?.pubDate === 'string' ? it.pubDate : null, // /api/feeds/news のスキーマに準拠
          }))
          .filter((x) => x.title && x.link)
          .slice(0, limit);
        setData(list);
      } catch {
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    load();
    return () => controller.abort();
  }, [items, limit]);

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
        ) : data.length === 0 ? (
          <div className="text-gray-600">現在表示できるニュースはありません。</div>
        ) : (
          data.map((it, idx) => (
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
                  {it.pubDate ? new Date(it.pubDate).toLocaleString('ja-JP', { hour12: false }) : ''}
                </span>
              </div>
            </a>
          ))
        )}
      </div>
    </div>
  );
}
