// pages/api/note.ts
import type { NextApiRequest, NextApiResponse } from "next";
import Parser from "rss-parser";

type NoteItem = {
  title: string;
  link: string;
  isoDate?: string;
  contentSnippet?: string;
};
type Data = { data: NoteItem[] } | { error: string };

const parser = new Parser();
// 既定はあなたの note アカウント
const DEFAULT_NOTE_RSS = "https://note.com/nieqc_0713/rss";

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const limitRaw = Array.isArray(req.query.limit) ? req.query.limit[0] : req.query.limit;
    const userRaw = Array.isArray(req.query.user) ? req.query.user[0] : req.query.user;

    const limit = Math.min(Math.max(Number(limitRaw ?? 6), 1), 30); // 1〜30に制限
    const rssUrl =
      userRaw && String(userRaw).trim().length > 0
        ? `https://note.com/${encodeURIComponent(String(userRaw))}/rss`
        : DEFAULT_NOTE_RSS;

    const feed = await parser.parseURL(rssUrl);

    const items: NoteItem[] = (feed.items || []).slice(0, limit).map((it: any) => ({
      title: it.title || "",
      link: it.link || "",
      isoDate: it.isoDate,
      contentSnippet: it.contentSnippet,
    }));

    // 30分 CDN キャッシュ
    res.setHeader("Cache-Control", "public, s-maxage=1800, stale-while-revalidate=60");
    return res.status(200).json({ data: items });
  } catch (e: any) {
    return res.status(500).json({ error: e?.message || "NOTE_FETCH_FAILED" });
  }
}
