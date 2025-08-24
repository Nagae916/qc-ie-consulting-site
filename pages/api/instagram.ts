// pages/api/instagram.ts
import type { NextApiRequest, NextApiResponse } from "next";

type IgItem = {
  id: string;
  caption?: string;
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  media_url: string;
  permalink: string;
  thumbnail_url?: string;
  timestamp: string;
};
type IgGraphError = { error?: { message: string; type?: string; code?: number; fbtrace_id?: string } };
type IgResponse = { data?: IgItem[] } & IgGraphError;

const IG_FIELDS = "id,caption,media_type,media_url,permalink,thumbnail_url,timestamp";

// .envの軽いバリデーション（桁/空白）
function getEnvOrErrors() {
  const userId = (process.env.IG_USER_ID || "").trim();
  const token = (process.env.IG_ACCESS_TOKEN || "").trim();
  const errors: string[] = [];
  if (!userId) errors.push("環境変数 IG_USER_ID が未設定です。");
  if (!token) errors.push("環境変数 IG_ACCESS_TOKEN が未設定です。");
  if (userId && !/^\d{5,}$/.test(userId)) errors.push("IG_USER_ID は数値ID（例: 1784…）を設定してください。");
  if (token && token.length < 50) errors.push("IG_ACCESS_TOKEN が短すぎます（長期トークンを設定してください）。");
  return { userId, token, errors };
}

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  const { userId, token, errors } = getEnvOrErrors();
  if (errors.length) {
    res.status(500).json({ error: errors.join(" ") });
    return;
  }

  try {
    const url = new URL(`https://graph.instagram.com/${userId}/media`);
    url.searchParams.set("fields", IG_FIELDS);
    url.searchParams.set("access_token", token);
    url.searchParams.set("limit", "3");

    const r = await fetch(url.toString(), { cache: "no-store" });
    const raw = await r.text();

    if (!r.ok) {
      // Graph API エラーの本文をきれいに返す
      let msg = raw;
      try {
        const ej = JSON.parse(raw) as IgGraphError;
        if (ej?.error?.message) msg = ej.error.message;
      } catch {}
      throw new Error(`Instagram API error: ${r.status} ${msg}`);
    }

    const json = JSON.parse(raw) as IgResponse;
    const items = (json.data ?? []).slice(0, 3).map((m) => ({
      id: m.id,
      caption: m.caption ?? "",
      media_type: m.media_type!,
      media_url: m.media_url!,
      thumbnail_url: m.thumbnail_url ?? m.media_url!,
      permalink: m.permalink!,
      timestamp: m.timestamp!,
    }));

    // 10分キャッシュ（Vercel CDN）
    res.setHeader("Cache-Control", "s-maxage=600, stale-while-revalidate=600");
    res.status(200).json({ items });
  } catch (e: any) {
    res.status(502).json({ error: e?.message ?? "unknown error" });
  }
}
