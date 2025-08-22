// /api/note.js
import Parser from 'rss-parser';

const parser = new Parser();

// 既定はあなたの note アカウント
const DEFAULT_NOTE_RSS = 'https://note.com/nieqc_0713/rss';

export default async function handler(req, res) {
  try {
    const limit = Number(req.query.limit || 6);
    const user = typeof req.query.user === 'string' ? req.query.user : '';
    const rssUrl = user ? `https://note.com/${encodeURIComponent(user)}/rss` : DEFAULT_NOTE_RSS;

    const feed = await parser.parseURL(rssUrl);

    const items = (feed.items || [])
      .slice(0, limit)
      .map((it) => ({
        title: it.title || '',
        link: it.link || '',
        isoDate: it.isoDate,
        contentSnippet: it.contentSnippet
      }));

    // 30分CDNキャッシュ
    res.setHeader('Cache-Control', 'public, s-maxage=1800, stale-while-revalidate=60');
    res.status(200).json({ data: items });
  } catch (e) {
    res.status(500).json({ error: e?.message || 'NOTE_FETCH_FAILED' });
  }
}
