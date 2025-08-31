// pages/api/x-rss.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import Parser from 'rss-parser';

type TweetItem = { title: string; link: string; pubDate: string | null };

const parser = new Parser({
  headers: { 'User-Agent': 'qc-ie-labo/1.0 (+https://example.com)' },
});

// .env.local で上書き可能（カンマ区切り）
const ENV_NITTER = (process.env.NITTER_ORIGINS || '')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

const NITTER_DEFAULTS = [
  'https://nitter.net',
  'https://nitter.privacydev.net',
  'https://nitter.poast.org',
  'https://nitter.lacontrevoie.fr',
];

const NITTER_ORIGINS = [...ENV_NITTER, ...NITTER_DEFAULTS];

// TwitRSS / RSSHub は固定（必要なら環境変数化も可）
const TWITRSS = 'https://twitrss.me/twitter_user_to_rss';
const RSSHUB  = 'https://rsshub.app/twitter/user';

async function parseRss(url: string): Promise<any[]> {
  const feed = await parser.parseURL(url);
  return feed.items || [];
}

function mapItems(arr: any[]): TweetItem[] {
  return arr
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
}

async function tryNitter(user: string, limit: number): Promise<TweetItem[] | null> {
  for (const origin of NITTER_ORIGINS) {
    try {
      const url = `${origin}/${encodeURIComponent(user)}/rss`;
      const items = mapItems(await parseRss(url));
      if (items.length) return items.slice(0, limit);
    } catch {
      // 次のミラーへ
    }
  }
  return null;
}

async function tryTwitRss(user: string, limit: number): Promise<TweetItem[] | null> {
  try {
    const url = `${TWITRSS}/?user=${encodeURIComponent(user)}`;
    const items = mapItems(await parseRss(url));
    return items.slice(0, limit);
  } catch {
    return null;
  }
}

async function tryRssHub(user: string, limit: number): Promise<TweetItem[] | null> {
  try {
    const url = `${RSSHUB}/${encodeURIComponent(user)}`;
    const items = mapItems(await parseRss(url));
    return items.slice(0, limit);
  } catch {
    return null;
  }
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
    const limit = Math.max(1, Math.min(50, Number(limitRaw) || 3)); // 既定3件

    if (!user) return res.status(200).json([]);

    let items: TweetItem[] | null = null;

    // 1) Nitter ミラー群
    items = await tryNitter(user, limit);

    // 2) TwitRSS
    if (!items || items.length === 0) items = await tryTwitRss(user, limit);

    // 3) RSSHub
    if (!items || items.length === 0) items = await tryRssHub(user, limit);

    if (items && items.length) {
      res.setHeader('Cache-Control', 's-maxage=1800, stale-while-revalidate=3600');
      return res.status(200).json(items);
    }

    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json([]);
  } catch {
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json([]);
  }
}
