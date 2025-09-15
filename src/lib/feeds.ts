// src/lib/feeds.ts
import Parser from "rss-parser";

export type FeedKey = "news" | "blog" | "note" | "instagram" | "x";

export type NormalizedFeedItem = {
  title: string;
  link: string;
  source: string;
  pubDate: string | null; // ISO8601 or null
  excerpt?: string;
};

const env = {
  NEWS_RSS_URL: process.env.NEWS_RSS_URL || "",
  BLOG_RSS_URL: process.env.BLOG_RSS_URL || "",
  NOTE_RSS_URL: process.env.NOTE_RSS_URL || "",
  INSTAGRAM_RSS_URL: process.env.INSTAGRAM_RSS_URL || "",
  X_RSS_URL: process.env.X_RSS_URL || "",
};

function pickUrl(key: FeedKey): string {
  switch (key) {
    case "news":
      return env.NEWS_RSS_URL;
    case "blog":
      return env.BLOG_RSS_URL;
    case "note":
      return env.NOTE_RSS_URL;
    case "instagram":
      return env.INSTAGRAM_RSS_URL;
    case "x":
      return env.X_RSS_URL;
  }
}

function toISO(v: unknown): string | null {
  if (typeof v !== "string" || !v) return null;
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

function hostOf(url: string) {
  try {
    const h = new URL(url).hostname;
    return h.startsWith("www.") ? h.slice(4) : h;
  } catch {
    return "";
  }
}

/** RSSを読み込んで最小情報に正規化（壊れにくさ優先） */
export async function fetchFeedByUrl(url: string, limit = 10): Promise<NormalizedFeedItem[]> {
  if (!url) return [];
  const parser = new Parser();
  const feed = await parser.parseURL(url).catch(() => ({ title: "", items: [] as any[] }));

  const src = feed.title ?? "";
  const mapped: Array<NormalizedFeedItem | null> = (feed.items ?? []).map(
    (raw: any): NormalizedFeedItem | null => {
      const title = String(raw?.title || "").trim();
      const link =
        (typeof raw?.link === "string" && raw.link) ||
        (typeof raw?.guid === "string" && raw.guid) ||
        "";
      if (!title || !link) return null;

      const iso = toISO(raw?.isoDate ?? raw?.pubDate ?? (raw as any)?.date);
      const excerpt: string | undefined =
        typeof raw?.contentSnippet === "string"
          ? raw.contentSnippet
          : typeof raw?.summary === "string"
          ? raw.summary
          : typeof raw?.description === "string"
          ? raw.description
          : undefined;

      return {
        title,
        link,
        source: src || hostOf(link),
        pubDate: iso,
        excerpt,
      };
    }
  );

  const items: NormalizedFeedItem[] = mapped
    // ★ 明示型を付けた型ガードで implicit any を回避
    .filter((x: NormalizedFeedItem | null): x is NormalizedFeedItem => x !== null)
    .sort(
      (a, b) =>
        new Date(b.pubDate || 0).getTime() - new Date(a.pubDate || 0).getTime()
    )
    .slice(0, limit);

  return items;
}

/** 環境変数に紐づくキー指定版 */
export async function fetchFeed(key: FeedKey, limit = 10): Promise<NormalizedFeedItem[]> {
  const url = pickUrl(key);
  if (!url) return [];
  return fetchFeedByUrl(url, limit);
}
