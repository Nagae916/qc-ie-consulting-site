// /api/instagram.js
// IG_ACCESS_TOKEN / IG_USER_ID を使って Graph API から直近投稿を返す
export default async function handler(req, res) {
  try {
    const { limit = '3' } = req.query;

    const token = process.env.IG_ACCESS_TOKEN;
    const userId = process.env.IG_USER_ID;

    if (!token || !userId) {
      return res.status(500).json({
        error: 'Missing env: IG_ACCESS_TOKEN or IG_USER_ID',
      });
    }

    // 画像 URL を取得するために media_url / thumbnail_url も要求
    const fields = [
      'id',
      'caption',
      'permalink',
      'media_type',
      'media_url',
      'thumbnail_url',
      'timestamp',
    ].join(',');

    const url = `https://graph.instagram.com/${userId}/media?fields=${encodeURIComponent(fields)}&limit=${encodeURIComponent(
      String(limit)
    )}&access_token=${encodeURIComponent(token)}`;

    const resp = await fetch(url);
    const json = await resp.json();

    if (!resp.ok) {
      return res.status(resp.status).json({
        error: json?.error?.message || 'Upstream error',
        upstream: json,
      });
    }

    // サムネ用 URL を正規化
    const data = (json.data || []).map((m) => ({
      id: m.id,
      caption: m.caption || '',
      permalink: m.permalink,
      media_type: m.media_type,
      image:
        m.media_type === 'VIDEO'
          ? m.thumbnail_url || null
          : m.media_url || null,
      timestamp: m.timestamp,
    }));

    res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=300');
    return res.status(200).json({ data });
  } catch (e) {
    return res.status(500).json({ error: e.message || 'Server error' });
  }
}
