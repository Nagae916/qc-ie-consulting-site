// pages/api/news.ts
import type { NextApiRequest, NextApiResponse } from "next";
import Parser from "rss-parser";

type NewsItem = {
  title: string;
  link: string;
  isoDate?: string;
  source?: string;
  contentSnippet?: string;
};

type Data = { data: NewsItem[] } | { error: string };

const parser = new Parser();
const DEFAULT_QUERY = "品質管理 OR 経営工学";

function buildGoogleNewsRssUrl(query: string) {
  const q = encodeURIComponent(query);
  // 日本語（日本）で GoogleニュースRSS を取得
  return `https://news.google.com/rss/search?q=${q}&hl=ja&gl=JP&ceid=JP:ja`;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const limitRaw = Array.isArray(req.query.limit) ? req.query.limit[0] : req.query.limit;
    const qRaw = Array.isArray(req.query.q) ? req.query.q[0] : req.query.q;

    const limit = Math.min(Math.max(Number(limitRaw ?? 8), 1), 30); // 1～30 に制限
    const q = (qRaw && qRaw.trim().length > 0 ? qRaw : DEFAULT_QUERY) as string;

    const feedUrl = buildGoogleNewsRssUrl(q);
    const feed = await parser.parseURL(feedUrl);

    const items: NewsItem[] = (feed.items || []).slice(0, limit).map((it: any) => ({
      title: it.title || "",
      link: it.link || "",
      isoDate: it.isoDate,
      // 可能なら発信元（source or creatorっぽいもの）も拾う
      source:
        (typeof it.creator === "string" && it.creator) ||
        (it.source && it.source.title) ||
        undefined,
      contentSnippet: it.contentSnippet
    }));

    // 30分CDNキャッシュ
    res.setHeader("Cache-Control", "public, s-maxage=1800, stale-while-revalidate=60");
    return res.status(200).json({ data: items });
  } catch (e: any) {
    return res.status(500).json({ error: e?.message || "NEWS_FETCH_FAILED" });
  }
}
