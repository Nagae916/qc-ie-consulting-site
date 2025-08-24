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
type IgResponse = { data: IgItem[] };

const IG_FIELDS = "id,caption,media_type,media_url,permalink,thumbnail_url,timestamp";

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  const userId = process.env.IG_USER_ID;
  const token = process.env.IG_ACCESS_TOKEN;
  if (!userId || !token) return res.status(500).json({ error: "Missing IG_USER_ID or IG_ACCESS_TOKEN" });

  try {
    const url = new URL(`https://graph.instagram.com/${userId}/media`);
    url.searchParams.set("fields", IG_FIELDS);
    url.searchParams.set("access_token", token);
    url.searchParams.set("limit", "3");

    const r = await fetch(url.toString(), { cache: "no-store" });
    if (!r.ok) throw new Error(`IG fetch failed: ${r.status} ${await r.text()}`);

    const json = (await r.json()) as IgResponse;
    const items = (json.data ?? []).slice(0, 3).map((m) => ({
      id: m.id,
      caption: m.caption ?? "",
      media_type: m.media_type,
      media_url: m.media_url,
      thumbnail_url: m.thumbnail_url ?? m.media_url,
      permalink: m.permalink,
      timestamp: m.timestamp
    }));

    res.setHeader("Cache-Control", "s-maxage=600, stale-while-revalidate=600"); // 10分キャッシュ
    res.status(200).json({ items });
  } catch (e: any) {
    res.status(500).json({ error: e?.message ?? "unknown error" });
  }
}
