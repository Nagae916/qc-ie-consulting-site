// /api/news.js
import Parser from 'rss-parser';

const parser = new Parser();

function buildGoogleNewsRssUrl(query) {
  const q = encodeURIComponent(query);
  // 日本語（日本）で GoogleニュースRSS を取得
  return `https://news.google.com/rss/search?q=${q}&hl=ja&gl=JP&ceid=JP:ja`;
}

// 既定のクエリ：品質管理 or 経営工学
const DEFAULT_QUERY = '品質管理 OR 経営工学';

export default async function handler(req, res) {
  try {
    const limit = Number(req.query.limit || 8);
    const q = typeof req.query.q === 'string' ? req.query.q : DEFAULT_QUERY;

    const feedUrl = buildGoogleNewsRssUrl(q);
    const feed = await parser.parseURL(feedUrl);

    const items = (feed.items || [])
      .slice(0, limit)
      .map((it) => ({
        title: it.title || '',
        link: it.link || '',
        isoDate: it.isoDate,
        // 可能なら発信元（source or creatorっぽいもの）も拾う
        source:
          (typeof it.creator === 'string' && it.creator) ||
          (it.source && it.source.title) ||
          undefined,
        contentSnippet: it.contentSnippet
      }));

    // 30分CDNキャッシュ
    res.setHeader('Cache-Control', 'public, s-maxage=1800, stale-while-revalidate=60');
    res.status(200).json({ data: items });
  } catch (e) {
    res.status(500).json({ error: e?.message || 'NEWS_FETCH_FAILED' });
  }
}
