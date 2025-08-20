// api/note.ts
import type { VercelRequest, VercelResponse } from "@vercel/node";
import Parser from "rss-parser";

const NOTE_RSS = process.env.NOTE_RSS_URL || "https://note.com/nieqc_0713/rss"; // ←必要ならENV化

const parser = new Parser();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const limit = Number(req.query.limit ?? 6);
  try {
    const feed = await parser.parseURL(NOTE_RSS);
    const items = (feed.items || []).map(it => ({
      title: it.title ?? "",
      link: it.link ?? "",
      pubDate: it.pubDate ? new Date(it.pubDate).toISOString() : null,
      // サムネが取れない場合もあるので説明文は短く整形
      excerpt: (it.contentSnippet || "").slice(0, 120),
    }));
    items.sort((a,b)=> (b.pubDate ?? "").localeCompare(a.pubDate ?? ""));
    res.setHeader("Cache-Control", "s-maxage=1800, stale-while-revalidate");
    res.status(200).json(items.slice(0, limit));
  } catch (e) {
    res.status(500).json({ error: "failed to load note rss" });
  }
}
