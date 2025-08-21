// /api/note.js
// Note の RSS（例: https://note.com/nieqc_0713/rss）を rss-parser で読む（30分キャッシュ）
import Parser from 'rss-parser';
const parser = new Parser();

const NOTE_RSS = process.env.NOTE_RSS_URL || 'https://note.com/nieqc_0713/rss';

export default async function handler(req, res) {
  try {
    const { limit = '6' } = req.query;

    const feed = await parser.parseURL(NOTE_RSS);

    const items = (feed.items || []).slice(0, Number(limit)).map((it) => ({
      title: it.title || '',
      link: it.link,
      pubDate: it.pubDate || it.isoDate || '',
      summary: it.contentSnippet || '',
    }));

    res.setHeader('Cache-Control', 'public, max-age=1800, s-maxage=1800');
    return res.status(200).json({ items });
  } catch (e) {
    return res.status(500).json({ error: e.message || 'Server error' });
  }
}
