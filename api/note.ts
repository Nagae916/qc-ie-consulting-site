// api/note.ts
import type { VercelRequest, VercelResponse } from "@vercel/node";
import Parser from "rss-parser";

const NOTE_RSS = "https://note.com/nieqc_0713/rss"; // ← あなたのnote RSS

const parser = new Parser();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const limit = Number(req.query.limit ?? 6);
  try {
    const feed = await parser.parseURL(NOTE_RSS);
    const items = (feed.items || []).map((it) => ({
      title: it.title ?? "",
      link: it.link ?? "",
      pubDate: it.pubDate ? new Date(it.pubDate).toISOString() : null,
      excerpt: (it.contentSnippet || "").replace(/\s+/g, " ").slice(0, 120),
    }));
    items.sort((a, b) => (b.pubDate ?? "").localeCompare(a.pubDate ?? ""));
    res.setHeader("Cache-Control", "s-maxage=1800, stale-while-revalidate"); // 30分キャッシュ
    res.status(200).json(items.slice(0, limit));
  } catch (e) {
    res.status(500).json({ error: "failed to load note rss" });
  }
}
