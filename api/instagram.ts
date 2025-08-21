// /pages/api/instagram.ts
import type { NextApiRequest, NextApiResponse } from 'next';

type MediaItem = {
  id: string;
  media_type: 'IMAGE' | 'CAROUSEL_ALBUM' | 'VIDEO' | string;
  media_url?: string;        // 画像/動画の直URL（IMAGE/VIDEO）
  thumbnail_url?: string;    // VIDEO のサムネ
  permalink: string;
  caption?: string;
};

type ApiOk = { data: { id: string; permalink: string; caption?: string; media_url?: string; thumbnail_url?: string }[] };
type ApiErr = { error: string };

const IG_TOKEN = process.env.IG_ACCESS_TOKEN;
const IG_USER_ID = process.env.IG_USER_ID;

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiOk | ApiErr>) {
  try {
    if (!IG_TOKEN || !IG_USER_ID) {
      return res.status(500).json({ error: 'Missing IG_ACCESS_TOKEN or IG_USER_ID env' });
    }

    const limit = Number(req.query.limit ?? 3);
    const fields = [
      'id',
      'caption',
      'media_type',
      'media_url',      // 画像/動画URL
      'thumbnail_url',  // 動画サムネ
      'permalink',
    ].join(',');

    // Basic Display API
    const url = `https://graph.instagram.com/${IG_USER_ID}/media?fields=${encodeURIComponent(fields)}&limit=${limit}&access_token=${IG_TOKEN}`;

    const r = await fetch(url, { cache: 'no-store' });
    const text = await r.text();

    // InstagramはエラーでもHTMLやテキストを返すことがあるので安全にパース
    let json: any;
    try {
      json = JSON.parse(text);
    } catch {
      return res.status(502).json({ error: `Instagram returned non-JSON: ${text.slice(0, 200)}` });
    }

    if (!r.ok) {
      const msg = json?.error?.message || `HTTP ${r.status}`;
      return res.status(r.status).json({ error: msg });
    }

    const items: MediaItem[] = Array.isArray(json.data) ? json.data : [];

    // 画像URLを決定（VIDEO は thumbnail_url を優先）
    const mapped = items.map((m) => ({
      id: m.id,
      caption: m.caption,
      permalink: m.permalink,
      media_url: m.media_type === 'VIDEO' ? undefined : m.media_url,
      thumbnail_url: m.media_type === 'VIDEO' ? (m.thumbnail_url || m.media_url) : undefined,
    }));

    return res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=300').status(200).json({ data: mapped });
  } catch (e: any) {
    return res.status(500).json({ error: e?.message || 'Server error' });
  }
}
