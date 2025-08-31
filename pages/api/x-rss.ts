// pages/api/x-rss.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import Parser from 'rss-parser';

type TweetItem = { title: string; link: string; pubDate: string | null };

const parser = new Parser({
  headers: { 'User-Agent': 'qc-ie-labo/1.0 (+https://example.com)' },
});

const ORIGIN = process.env.NITTER_ORIGIN || 'https://nitter.net';

export default async function handler(req: NextApiRequest, res: NextApiResponse<TweetItem[]>) {
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

    const url = `${ORIGIN}/${encodeURIComponent(user)}/rss`;
    const feed = await parser.parseURL(url);

    const items: TweetItem[] = (feed.items || [])
      .slice(0, limit)
      .map((it: any) => ({
        title: String(it.title || '').replace(/\s+/g, ' ').trim(),
        link: String(it.link || ''),
        pubDate: it.isoDate ? new Date(it.isoDate).toISOString() : (it.pubDate ? new Date(it.pubDate).toISOString() : null),
      }))
      .filter((x) => x.title && x.link);

    res.setHeader('Cache-Control', 's-maxage=1800, stale-while-revalidate=3600');
    return res.status(200).json(items);
  } catch (e) {
    // フォールバックも失敗したら空配列（画面側はメッセージ表示）
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json([]);
  }
}
