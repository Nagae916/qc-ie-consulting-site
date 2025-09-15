// src/components/feeds/InstagramFeed.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import { feedApiPath } from '../../lib/routes';

type Item = {
  id: string;
  caption: string;
  media_url: string | null;   // 画像URL（無い場合は null）
  permalink: string;          // 投稿ページURL
  timestamp: string | null;   // ISO
};

function stripHtml(html?: string): string {
  if (!html) return '';
  return html.replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]+>/g, '').trim();
}

// description 等から最初の画像URLを抽出（RSSHubのInstagramに対応）
function firstImageFromHtml(html?: string): string | null {
  if (!html) return null;
  const m = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return m?.[1] ?? null;
}

type Props = {
  /** 直近何件を表示するか（既定 3） */
  limit?: number;
  /** ISR/SSR から渡す場合はこれを指定（指定があればクライアントでの取得は行わない） */
  items?: Item[];
  className?: string;
};

export default function InstagramFeed({ limit = 3, items, className }: Props) {
  const [list, setList] = useState<Item[]>(items?.slice(0, limit) ?? []);
  const [loading, setLoading] = useState(!items);
  const [err, setErr] = useState<string | null>(null);

  // 集約APIを使用（.env の INSTAGRAM_RSS_URL を参照）
  const requestUrl = useMemo(() => feedApiPath('instagram', limit), [limit]);

  useEffect(() => {
    // SSR/ISR から items が渡っていれば取得しない
    if (items && items.length) return;

    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setErr(null);

        // CDNキャッシュを活かす（no-storeやtimestampは付けない）
        const res = await fetch(requestUrl);
        const data = await res.json().catch(() => []);
        const arr: any[] = Array.isArray(data) ? data : [];

        const mapped: Item[] = arr
          .map((it, idx) => {
            const link: string = String(it?.link || '');
            const title = String(it?.title || '');
            const desc = String(it?.description || it?.contentSnippet || '');
            const img: string | null =
              (it?.image as string | undefined) ??
              (it?.media_url as string | undefined) ??
              (it?.thumbnail as string | undefined) ??
              (it?.enclosure?.url as string | undefined) ??
              firstImageFromHtml(desc) ??
              null;

            const ts =
              typeof it?.pubDate === 'string'
                ? new Date(it.pubDate).toISOString()
                : typeof it?.isoDate === 'string'
                ? new Date(it.isoDate).toISOString()
                : null;

            return {
              id: link || `ig-${idx}`,
              caption: stripHtml(title || desc) || '（キャプションなし）',
              media_url: img,
              permalink: link || '#',
              timestamp: ts,
            };
          })
          .filter((x) => !!x.permalink)
          .sort((a, b) => new Date(b.timestamp || 0).getTime() - new Date(a.timestamp || 0).getTime())
          .slice(0, limit);

        if (mounted) setList(mapped);
      } catch (e: any) {
        if (mounted) setErr(e?.message ?? '取得に失敗しました');
      } finally {
        if (mounted) setLoading(false);
      }
    })();

  }, [items, requestUrl, limit]);

  if (loading) return <p>読み込み中…</p>;
  if (err)
    return (
      <div
        style={{
          border: '1px solid #fca5a5',
          background: '#fee2e2',
          color: '#7f1d1d',
          padding: 12,
          borderRadius: 8,
        }}
      >
        Instagramの取得に失敗しました。
        <br />
        <span style={{ fontSize: 12 }}>{err}</span>
      </div>
    );
  if (!list.length) return <p>表示できる投稿がありません。</p>;

  return (
    <ul
      className={className}
      style={{
        display: 'grid',
        gap: 16,
        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
      }}
    >
      {list.map((it) => (
        <li key={it.id} style={{ border: '1px solid #e5e7eb', borderRadius: 12, overflow: 'hidden' }}>
          <a href={it.permalink} target="_blank" rel="noopener noreferrer">
            <div style={{ position: 'relative', width: '100%', aspectRatio: '1 / 1', background: '#f3f4f6' }}>
              {it.media_url ? (
                // 外部ドメイン許可が不要になるよう <img> を使用
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={it.media_url}
                  alt={it.caption || 'Instagram post'}
                  loading="lazy"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              ) : (
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    display: 'grid',
                    placeItems: 'center',
                    color: '#6b7280',
                    fontSize: 12,
                    padding: 12,
                    textAlign: 'center',
                  }}
                >
                  画像のプレビューを取得できませんでした
                </div>
              )}
            </div>
            <div style={{ padding: 12, fontSize: 14, lineHeight: 1.4 }}>
              {it.caption ? it.caption.slice(0, 100) : '（キャプションなし）'}
            </div>
            <div style={{ padding: '0 12px 12px', fontSize: 12, color: '#6b7280' }}>
              {it.timestamp ? new Date(it.timestamp).toLocaleString('ja-JP', { hour12: false }) : ''}
            </div>
          </a>
        </li>
      ))}
    </ul>
  );
}
