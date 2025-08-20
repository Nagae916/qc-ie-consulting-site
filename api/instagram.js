// api/instagram.js
export default async function handler(req, res) {
  try {
    const IG_USER_ID = process.env.IG_USER_ID;
    const IG_ACCESS_TOKEN = process.env.IG_ACCESS_TOKEN;
    if (!IG_USER_ID || !IG_ACCESS_TOKEN) {
      return res.status(500).json({ error: 'Missing IG env vars' });
    }

    // 子メディアも取得（複数枚投稿や動画のサムネイル対応）
    const fields = [
      'id',
      'media_type',
      'media_url',
      'thumbnail_url',
      'permalink',
      'caption',
      'timestamp',
      'children{media_type,media_url,thumbnail_url}',
    ].join(',');

    const url = `https://graph.facebook.com/v19.0/${IG_USER_ID}/media?fields=${encodeURIComponent(
      fields
    )}&limit=3&access_token=${IG_ACCESS_TOKEN}`;

    const r = await fetch(url, { cache: 'no-store' });
    const json = await r.json();
    if (!r.ok) {
      return res.status(r.status).json({ error: 'IG error', detail: json });
    }

    // どの投稿タイプでも表示用の imgSrc を決めて返す
    const normalized = (json.data ?? []).map((p) => {
      let img =
        p.media_type === 'IMAGE'
          ? p.media_url
          : p.media_type === 'VIDEO'
          ? p.thumbnail_url || p.media_url
          : p.media_type === 'CAROUSEL_ALBUM'
          ? (p.children?.data?.[0]?.media_url ||
             p.children?.data?.[0]?.thumbnail_url)
          : null;

      return {
        id: p.id,
        permalink: p.permalink,
        caption: p.caption,
        timestamp: p.timestamp,
        imgSrc: img,
      };
    });

    // 5分キャッシュ
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=86400');
    return res.status(200).json(normalized);
  } catch (e) {
    return res.status(500).json({ error: 'Server error', detail: e?.message });
  }
}
