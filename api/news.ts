import type { VercelRequest, VercelResponse } from "@vercel/node";
import Parser from "rss-parser";

// 経営工学・品質管理に寄せたGoogleニュースRSS（自由に差し替え可）
const FEEDS = [
  "https://news.google.com/rss/search?q=%E7%B5%8C%E5%96%B6%E5%B7%A5%E5%AD%A6+OR+%E5%93%81%E8%B3%AA%E7%AE%A1%E7%90%86&hl=ja&gl=JP&ceid=JP:ja",
  "https://news.google.com/rss/search?q=SPC+OR+DOE+OR+IE+%E5%B7%A5%E7%A8%8B&hl=ja&gl=JP&ceid=JP:ja",
];

const parser = new Parser();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const limit = Number(req.query.limit ?? 8);

  try {
    const all = await Promise.all(
      FEEDS.map(async (url) => {
        const feed = await parser.parseURL(url);
        return feed.items.map((it) => ({
          title: it.title ?? "",
          link: it.link ?? "",
          source: feed.title ?? "",
          pubDate: it.pubDate ? new Date(it.pubDate).toISOString() : null,
        }));
      })
    );

    const flat = all.flat();
    // 日付降順＋重複URL除去
    const unique = Array.from(
      new Map(flat.map((x) => [x.link, x])).values()
    ).sort((a, b) => (b.pubDate ?? "").localeCompare(a.pubDate ?? ""));

    res.setHeader("Cache-Control", "s-maxage=1800, stale-while-revalidate"); // 30分
    res.status(200).json(unique.slice(0, limit));
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "failed to load rss" });
  }
}
