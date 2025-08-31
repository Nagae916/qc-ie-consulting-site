// pages/api/x-rss.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import Parser from 'rss-parser';

type TweetItem = { title: string; link: string; pubDate: string | null };

const parser = new Parser({
  headers: { 'User-Agent': 'qc-ie-labo/1.0 (+https://example.com)' },
});

// 環境変数にカンマ区切りで上書き可能
// 例) NITTER_ORIGINS="https://nitter.net,https://nitter.privacydev.net"
const ORIGINS = (process.env.NITTER_ORIGINS || '')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

const DEFAULT_ORIGINS = [
  'https://nitter.net',
  'https://nitter.privacydev.net',
  'https://nitter.poast.org',
  'https://nitter.lacontrevoie.fr',
];

const ORIGIN_LIST = [...ORIGINS, ...DEFAULT_ORIGINS];

async function fetchFrom(origin: string, user: string, limit: number): Promise<TweetItem[] | null> {
  const url = `${origin}/${encodeURIComponent(user)}/rss`;
  const feed = await parser.parseURL(url);
  const items: TweetItem[] = (feed.items || [])
    .slice(0, limit)
    .map((it: any) => ({
      title: String(it.title || '').replace(/\s+/g, ' ').trim(),
      link: String(it.link || ''),
      pubDate: it.isoDate
        ? new Date(it.isoDate).toISOString()
        : it.pubDate
        ? new Date(it.pubDate).toISOString()
        : null,
    }))
    .filter((x: TweetItem) => x.title && x.link);
  return items;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TweetItem[]>
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json([]);
  }

  try {
    const userRaw = Array.isArray(req.query.user) ? req.query.user[0] : req.query.user;
    const limitRaw = Array.isArray(req.query.limit) ? req.query.limit[0] : req.query.limit;

    const user = String(userRaw ?? '').replace(/^@/, '').trim();
    const limit = Math.max(1, Math.min(50, Number(limitRaw) || 5));
    if (!user) return res.status(200).json([]);

    let items: TweetItem[] = [];
    for (const origin of ORIGIN_LIST) {
      try {
        const resItems = await fetchFrom(origin, user, limit);
        if (resItems && resItems.length) {
          items = resItems;
          break;
        }
      } catch {
        // 次のミラーへ
      }
    }

    // 30分キャッシュ（SWR 1時間）
    if (items.length) {
      res.setHeader('Cache-Control', 's-maxage=1800, stale-while-revalidate=3600');
    } else {
      res.setHeader('Cache-Control', 'no-store');
    }
    return res.status(200).json(items);
  } catch {
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json([]);
  }
}
