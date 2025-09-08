// pages/api/feeds/[key].ts
import type { NextApiRequest, NextApiResponse } from "next";
import { fetchFeed, type FeedKey } from "@/lib/feeds";

const ALLOWED: FeedKey[] = ["news", "blog", "note", "instagram", "x"];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const key = String(req.query.key ?? "") as FeedKey;
  const limit = Math.min(20, Math.max(1, parseInt(String(req.query.limit ?? "6"), 10) || 6));

  res.setHeader("Cache-Control", "s-maxage=1800, stale-while-revalidate=300"); // 30分+SWR

  if (!ALLOWED.includes(key)) {
    res.status(400).json({ error: "invalid key" });
    return;
  }

  const items = await fetchFeed(key, limit);
  res.status(200).json(items);
}
