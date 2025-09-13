// src/components/feeds/InstagramFeed.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import { feedApiPath } from '@/lib/routes';

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

export default function InstagramFeed({ limit = 3 }: { limit?: number }) {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // 集約APIを使用（.env の INSTAGRAM_RSS_URL を参照）
  const requestUrl = useMemo(() => feedApiPath('instagram', limit), [limit]);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        setLoading(true);
        setErr(null);

        // CDNキャッシュを活かす（no-storeやtimestampは付けない）
        const res = await fetch(requestUrl);
        const data = await res.json().catch(() => []);
        const arr: any[] = Array.isArray(data) ? data : [];

        const mapped: Item[] = arr
          .map((it, idx) => {
            const link: string = String((it as any).link || '');
            const title = String((it as any).title || '');
            const desc = String((it as any).description || (it as any).contentSnippet || '');
            const img =
              (it as any).image ||
              (it as any).media_url ||
              (it as any).thumbnail ||
              (it as any).enclosure?.url ||
              firstImageFromHtml(desc) ||
              null;

            const ts =
              typeof (it as any).pubDate === 'string'
                ? new Date((it as any).pubDate).toISOString()
                : typeof (it as any).isoDate === 'string'
                ? new Date((it as any).isoDate).toISOString()
                : null;

            return {
              id: link || `ig-${idx}`,
              caption: stripHtml(title || desc) || '（キャプションなし）',
              media_url: img,
              permalink: link || '#',
              timestamp: ts,
            };
          })
          .filter((x) => !!x.permalink);

        // 「直近 limit 件」を保証：時刻降順に並べて slice
        const limited = mapped
          .sort((a, b) => new Date(b.timestamp || 0).getTime() - new Date(a.timestamp || 0).getTime())
          .slice(0, limit);

        if (mounted) setItems(limited);
      } catch (e: any) {
        if (mounted) setErr(e?.message ?? '取得に失敗しました');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();

    // 画面復帰時＆5分ごとに再取得（軽量：CDNキャッシュあり）
    const onVis = () => {
      if (document.visibilityState === 'visible') load();
    };
    document.addEventListener('visibilitychange', onVis);
    const iv = window.setInterval(load, 5 * 60 * 1000);

    return () => {
      mounted = false;
      clearInterval(iv);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [requestUrl, limit]);

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
  if (!items.length) return <p>表示できる投稿がありません。</p>;

  return (
    <ul
      style={{
        display: 'grid',
        gap: 16,
        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
      }}
    >
      {items.map((it) => (
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
