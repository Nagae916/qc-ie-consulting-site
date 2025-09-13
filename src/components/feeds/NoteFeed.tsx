// src/components/feeds/NoteFeed.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import { feedApiPath } from '../../lib/routes';

type Item = {
  title: string;
  link: string;
  pubDate: string | null; // ISO8601 文字列 or null
  excerpt: string;
};

export default function NoteFeed({
  limit = 6,
  user,
  items,
}: {
  limit?: number;
  user?: string;       // 例: "nieqc_0713" または "@nieqc_0713"
  items?: Item[];      // SSR/ISR で渡す（推奨）
}) {
  // SSR 渡しがあればそれを初期表示。無ければ取得する。
  const [data, setData] = useState<Item[]>(items ?? []);
  const [loading, setLoading] = useState(!items || items.length === 0);

  const normalizedUser = useMemo(
    () => (user ? user.replace(/^@/, '') : undefined),
    [user]
  );

  const requestUrl = useMemo(
    () => feedApiPath('note', limit, normalizedUser ? { user: normalizedUser } : undefined),
    [limit, normalizedUser]
  );

  useEffect(() => {
    // すでに SSR items がある場合は何もしない
    if (items && items.length > 0) {
      setData(items);
      setLoading(false);
      return;
    }

    const ac = new AbortController();
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetch(requestUrl, { cache: 'no-store', signal: ac.signal });
        const arr: any[] = (await res.json().catch(() => [])) ?? [];
        const normalized: Item[] = (Array.isArray(arr) ? arr : [])
          .map((it) => ({
            title: String(it?.title || ''),
            link: String(it?.link || ''),
            pubDate: typeof it?.isoDate === 'string' ? it.isoDate : null,
            excerpt: String(it?.description || it?.contentSnippet || ''),
          }))
          .filter((x) => x.title && x.link)
          .slice(0, limit);
        setData(normalized);
      } catch {
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    load();
    return () => ac.abort();
  }, [items, requestUrl, limit]);

  if (loading) return <div className="p-4 text-gray-600">note記事を読み込み中…</div>;
  if (!data.length) return <div className="p-4 text-gray-600">表示できる記事がありません。</div>;

  return (
    <div className="rounded-xl2 bg-white shadow-soft border border-brand-200">
      <div className="px-5 py-4 border-b border-brand-200 bg-brand-100/60 rounded-t-xl2">
        <h3 className="font-semibold text-brand-900">note（最新）</h3>
        <p className="text-xs text-gray-600 mt-1">RSSから自動取得（30分キャッシュ）</p>
      </div>
      <ul className="divide-y divide-brand-200">
        {data.map((it) => (
          <li key={it.link} className="p-4 hover:bg-brand-50/60 transition">
            <a href={it.link} target="_blank" rel="noopener noreferrer" className="block">
              <p className="font-medium text-brand-900">{it.title}</p>
              <p className="text-xs text-gray-500 mt-1">
                {it.pubDate ? new Date(it.pubDate).toLocaleString('ja-JP', { hour12: false }) : ''}
              </p>
              <p className="text-sm text-gray-700 mt-1">{it.excerpt}</p>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
