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
type Ok = { data: IgItem[] };
type Err = { error: string };
type Res = Ok | Err;

/** Basic Display の長期トークン（以前の名前のまま） */
const TOKEN = process.env.IG_ACCESS_TOKEN; // 旧名に合わせました
/** 使わなくても OK（/me/media を使うため必須ではない）。置いてあっても害なし */
const IG_USER_ID = process.env.IG_USER_ID;

export default async function handler(req: NextApiRequest, res: NextApiResponse<Res>) {
  const limit = Number(req.query.limit ?? 3);

  try {
    if (!TOKEN) {
      return res.status(500).json({ error: 'IG_ACCESS_TOKEN が未設定です（Vercel の環境変数を確認）' });
    }

    // Basic Display: /me/media を使用
    const url = new URL('https://graph.instagram.com/me/media');
    // children まで含めて、album/reel の代表画像を拾えるようにする
    url.searchParams.set(
      'fields',
      'id,caption,media_type,permalink,timestamp,media_url,thumbnail_url,children{media_type,media_url,thumbnail_url}'
    );
    url.searchParams.set('access_token', TOKEN);
    url.searchParams.set('limit', String(limit));

    // タイムアウト付き fetch（無限待ちで落ちるのを防止）
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), 10_000);

    const igRes = await fetch(url.toString(), {
      // Vercel のサーバレスでぶら下がらないようにする
      signal: controller.signal,
      // 30 分キャッシュ（API 側はキャッシュ、フロント側は no-store で可）
      next: { revalidate: 60 * 30 },
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; QC-IE-Consulting-Bot/1.0)',
        Accept: 'application/json',
      },
    }).catch((e) => {
      throw new Error(`Instagram への接続に失敗: ${e?.message ?? e}`);
    });
    clearTimeout(t);

    const text = await igRes.text(); // まずは必ず text として受ける
    const ctype = igRes.headers.get('content-type') || '';

    if (!igRes.ok) {
      // Instagram 側のエラー本文を見られるように返す
      const snippet = text.slice(0, 300);
      return res.status(igRes.status).json({
        error: `Instagram API error ${igRes.status} ${igRes.statusText}: ${snippet}`,
      });
    }

    if (!ctype.includes('application/json')) {
      // JSON 以外（HTML 等）が返ってきた場合のガード
      const snippet = text.slice(0, 300);
      return res.status(500).json({
        error: `Instagram が JSON を返しませんでした: ${snippet}`,
      });
    }

    let parsed: { data?: IgItem[]; error?: any };
    try {
      parsed = JSON.parse(text);
    } catch (e: any) {
      return res.status(500).json({
        error: `Instagram JSON 解析に失敗: ${e?.message ?? e}`,
      });
    }

    if (!parsed.data || !Array.isArray(parsed.data)) {
      return res.status(500).json({
        error: `Instagram レスポンスに data がありません: ${text.slice(0, 300)}`,
      });
    }

    // media_url がない（アルバム/リール等）場合に代表画像を補完
    const filled = parsed.data.map((p) => {
      if (!p.media_url) {
        const cand =
          p.children?.data?.find((c) => c.media_url || c.thumbnail_url) ??
          p.children?.data?.[0];

        if (cand?.media_url) p.media_url = cand.media_url;
        if (!p.media_url && cand?.thumbnail_url) p.media_url = cand.thumbnail_url;
      }
      // それでも無ければ thumbnail_url を使う（reel など）
      if (!p.media_url && p.thumbnail_url) {
        p.media_url = p.thumbnail_url;
      }
      return p;
    });

    return res.status(200).json({ data: filled });
  } catch (e: any) {
    // 例外は必ずここで潰す（FUNCTION_INVOCATION_FAILED を防ぐ）
    return res.status(500).json({ error: e?.message ?? 'Server error' });
  }
}
