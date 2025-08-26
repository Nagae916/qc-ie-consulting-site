// pages/api/news.ts
import type { NextApiRequest, NextApiResponse } from "next";
import Parser from "rss-parser";

type NewsItem = {
  title: string;
  link: string;
  source: string;
  pubDate: string | null;
};

const parser = new Parser({
  headers: { "User-Agent": "qc-ie-labo/1.0 (+https://example.com)" },
});

// 例: NEWS_QUERIES=QC検定,統計検定,技術士 経営工学部門,経営工学 OR IE OR 工場管理
const DEFAULT_QUERIES = [
  "QC検定",
  "統計検定",
  "技術士 経営工学部門",
  "経営工学 OR 工場管理",
];

function getQueries(): string[] {
  const raw = process.env.NEWS_QUERIES;
  if (!raw) return DEFAULT_QUERIES;
  return raw.split(",").map((s) => s.trim()).filter(Boolean);
}

function buildGoogleNewsUrl(q: string) {
  const base = "https://news.google.com/rss/search";
  const params = new URLSearchParams({ q, hl: "ja", gl: "JP", ceid: "JP:ja" });
  return `${base}?${params.toString()}`;
}

function toIsoOrNull(v?: string): string | null {
  if (!v) return null;
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

function sanitize(item: any): NewsItem | null {
  const title = typeof item?.title === "string" ? item.title : "";
  const link =
    (typeof item?.link === "string" && item.link) ||
    (typeof item?.guid === "string" && item.guid) ||
    "";
  const source =
    (typeof item?.source === "object" && typeof item?.source?.title === "string" && item.source.title) ||
    (typeof item?.source === "string" && item.source) ||
    (typeof item?.creator === "string" && item.creator) ||
    (typeof item?.["dc:creator"] === "string" && item["dc:creator"]) ||
    "";
  const pubDate = toIsoOrNull(item?.isoDate || item?.pubDate);

  if (!title || !link) return null;
  return { title, link, source, pubDate };
}

function dedupe(items: NewsItem[]): NewsItem[] {
  const seen = new Set<string>();
  const out: NewsItem[] = [];
  for (const it of items) {
    const key = it.link || `t:${it.title}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(it);
  }
  return out;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<NewsItem[]>) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json([]);
  }

  const limitRaw = Array.isArray(req.query.limit) ? req.query.limit[0] : req.query.limit;
  const limit = Math.max(1, Math.min(50, Number(limitRaw) || 20));

  try {
    // 30分CDNキャッシュ / SWR 1時間
    res.setHeader("Cache-Control", "s-maxage=1800, stale-while-revalidate=3600");

    const queries = getQueries();

    // 各クエリのRSSを並列取得
    const results = await Promise.allSettled(
      queries.map(async (q) => {
        const url = buildGoogleNewsUrl(q);
        const feed = await parser.parseURL(url);
        return feed.items ?? [];
      })
    );

    // 成功分だけ集める
    const rawItems: any[] = [];
    for (const r of results) {
      if (r.status === "fulfilled") rawItems.push(...r.value);
      else {
        // eslint-disable-next-line no-console
        console.error("[/api/news] feed error:", r.reason);
      }
    }

    // 整形 → 重複排除 → 日付降順 → 上限
    const items = dedupe(
      rawItems.map(sanitize).filter((x): x is NewsItem => !!x)
    )
      .sort((a, b) => (new Date(b.pubDate || 0).getTime() - new Date(a.pubDate || 0).getTime()))
      .slice(0, limit);

    return res.status(200).json(items);
  } catch (e) {
    // 失敗時も空配列で返す（フロントは空表示で耐える）
    // eslint-disable-next-line no-console
    console.error("[/api/news] fatal error:", e);
    res.setHeader("Cache-Control", "no-store");
    return res.status(200).json([]);
  }
}
