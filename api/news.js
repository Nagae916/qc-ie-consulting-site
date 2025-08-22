// api/news.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import Parser from 'rss-parser';

type NewsItem = {
  title: string;
  link: string;
  isoDate?: string;
  source?: string;
  contentSnippet?: string;
};

type Resp = { data?: NewsItem[]; error?: string };

const parser = new Parser();

function buildGoogleNewsRssUrl(query: string) {
  const q = encodeURIComponent(query);
  return `https://news.google.com/rss/search?q=${q}&hl=ja&gl=JP&ceid=JP:ja`;
}

// 例: 「品質管理 OR 経営工学」を対象にニュース収集
const DEFAULT_QUERY = '品質管理 OR 経営工学';

export default async function handler(req: NextApiRequest, res: NextApiResponse<Resp>) {
  try {
    const limit = Number(req.query.limit || 8);
    const q = typeof req.query.q === 'string' ? req.query.q : DEFAULT_QUERY;
    const feedUrl = buildGoogleNewsRssUrl(q);

    const feed = await parser.parseURL(feedUrl);

    const items: NewsItem[] = (feed.items || []).slice(0, limit).map((it) => ({
      title: it.title ?? '',
      link: it.link ?? '',
      isoDate: it.isoDate,
      source: typeof it.creator === 'string' ? it.creator : (it as any)?.source?.title,
      contentSnippet: it.contentSnippet
    }));

    res.setHeader('Cache-Control', 'public, s-maxage=1800, stale-while-revalidate=60'); // 30分キャッシュ
    res.status(200).json({ data: items });
  } catch (e: any) {
    res.status(500).json({ error: e?.message || 'NEWS_FETCH_FAILED' });
  }
}
