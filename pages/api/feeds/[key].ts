// pages/api/feeds/[key].ts
import type { NextApiRequest, NextApiResponse } from "next";
// エイリアスに依存せず、相対で“確実に”解決
import { fetchFeed, type FeedKey } from "../../../src/lib/feeds";

const ALLOWED: FeedKey[] = ["news", "blog", "note", "instagram", "x"];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const key = String(req.query.key || "").toLowerCase() as FeedKey;
    if (!ALLOWED.includes(key)) {
      res.status(404).json({ error: "unknown feed key" });
      return;
    }
    const limit = Number(req.query.limit ?? 10);
    const items = await fetchFeed(key, Number.isFinite(limit) ? limit : 10);
    res.setHeader("Cache-Control", "public, s-maxage=1800, stale-while-revalidate=3600"); // 30分
    res.status(200).json(items);
  } catch (e: any) {
    res.status(200).json([]); // 失敗時も空配列で壊れない運用
  }
}
