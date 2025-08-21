// pages/api/instagram.ts
import type { NextApiRequest, NextApiResponse } from 'next';

type IgChild = { media_type: string; media_url?: string; thumbnail_url?: string };
type IgItem = {
  id: string;
  caption?: string;
  media_type: string;
  media_url?: string;
  thumbnail_url?: string;
  permalink: string;
  timestamp?: string;
  children?: { data: IgChild[] };
};
type ApiResponse =
  | { data: IgItem[]; error?: undefined }
  | { error: string };

const TOKEN = process.env.IG_ACCESS_TOKEN;

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
  try {
    const limit = Number(req.query.limit ?? 3);
    if (!TOKEN) return res.status(500).json({ error: 'IG_ACCESS_TOKEN が未設定です。' });

    const url = new URL('https://graph.instagram.com/me/media');
    url.searchParams.set(
      'fields',
      'id,caption,media_type,permalink,timestamp,media_url,thumbnail_url,children{media_type,media_url,thumbnail_url}'
    );
    url.searchParams.set('access_token', TOKEN);
    url.searchParams.set('limit', String(limit));

    const igRes = await fetch(url.toString(), { next: { revalidate: 60 * 30 } });
    const text = await igRes.text();
    if (!igRes.ok) return res.status(igRes.status).json({ error: text || 'Instagram API エラー' });

    const parsed = JSON.parse(text) as { data?: IgItem[]; error?: any };
    const filled = (parsed.data ?? []).map((p) => {
      // アルバム/リール等で media_url が無い場合、子メディアから代表画像を補完
      if (!p.media_url) {
        const cand = p.children?.data?.find((c) => c.media_url || c.thumbnail_url);
        if (cand?.media_url) p.media_url = cand.media_url;
        if (!p.media_url && cand?.thumbnail_url) p.media_url = cand.thumbnail_url;
      }
      return p;
    });

    return res.status(200).json({ data: filled });
  } catch (e: any) {
    return res.status(500).json({ error: e?.message || 'Server error' });
  }
}
