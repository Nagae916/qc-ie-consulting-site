// /api/news.js
// GoogleニュースRSSを rss-parser で読む（30分キャッシュ）
import Parser from 'rss-parser';
const parser = new Parser();

export default async function handler(req, res) {
  try {
    const { q = '経営工学 OR 品質管理', hl = 'ja', gl = 'JP', ceid = 'JP:ja', limit = '8' } = req.query;

    const feedUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(
      String(q)
    )}&hl=${hl}&gl=${gl}&ceid=${ceid}`;

    const feed = await parser.parseURL(feedUrl);

    const items = (feed.items || []).slice(0, Number(limit)).map((it) => ({
      title: it.title || '',
      link: it.link,
      pubDate: it.pubDate || it.isoDate || '',
      source: it.creator || it.author || '',
      summary: it.contentSnippet || '',
    }));

    res.setHeader('Cache-Control', 'public, max-age=1800, s-maxage=1800');
    return res.status(200).json({ items });
  } catch (e) {
    return res.status(500).json({ error: e.message || 'Server error' });
  }
}
