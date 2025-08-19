// api/instagram.js
export default async function handler(req, res) {
  try {
    const userId = process.env.IG_USER_ID;
    const token  = process.env.IG_ACCESS_TOKEN;
    if (!userId || !token) {
      return res.status(500).json({ error: 'Missing IG_USER_ID or IG_ACCESS_TOKEN' });
    }

    const fields = 'id,media_type,media_url,thumbnail_url,permalink,caption,timestamp';
    const url = new URL(`https://graph.facebook.com/v19.0/${userId}/media`);
    url.searchParams.set('fields', fields);
    url.searchParams.set('limit', '3');
    url.searchParams.set('access_token', token);

    const r = await fetch(url.toString(), { cache: 'no-store' });
    const text = await r.text();
    if (!r.ok) {
      return res.status(r.status).json({ error: 'IG error', detail: text });
    }
    const json = JSON.parse(text);

    // CDNキャッシュ 5分（失敗時は都度取りに行く）
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=86400');
    return res.status(200).json(json.data ?? []);
  } catch (e) {
    return res.status(500).json({ error: 'Server error', detail: e?.message });
  }
}
