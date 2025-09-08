// lib/feeds.ts
import Parser from "rss-parser";

export type FeedKey = "news" | "blog" | "note" | "instagram" | "x";

export const FEED_ENV: Record<FeedKey, string> = {
  news: "NEWS_RSS_URL",
  blog: "BLOG_RSS_URL",
  note: "NOTE_RSS_URL",
  instagram: "INSTAGRAM_RSS_URL",
  x: "X_RSS_URL",
};

export type FeedItem = {
  title: string;
  link: string;
  source?: string;
  pubDate?: string;      // ISO文字列
  description?: string;
  author?: string;
};

const parser = new Parser({ timeout: 10_000 });

const toISO = (v?: string) => {
  if (!v) return undefined;
  const t = Date.parse(v);
  if (!Number.isFinite(t)) return undefined;
  return new Date(t).toISOString();
};

const hostOf = (url?: string) => {
  if (!url) return "";
  try {
    const h = new URL(url).hostname;
    return h.startsWith("www.") ? h.slice(4) : h;
  } catch {
    return "";
  }
};

export function getFeedUrl(key: FeedKey): string {
  return process.env[FEED_ENV[key]] ?? "";
}

/** URL直指定でRSS→正規化。失敗時は空配列で返す（壊れない） */
export async function readFeedFromUrl(url: string, limit = 6): Promise<FeedItem[]> {
  try {
    const feed = await parser.parseURL(url);
    const src = feed.title ?? "";
    return (feed.items ?? []).slice(0, limit).map((it) => {
      const link = it.link ?? (it as any).guid ?? "";
      const iso = toISO((it as any).isoDate ?? it.pubDate ?? (it as any).date);
      return {
        title: it.title ?? "",
        link,
        source: src || hostOf(link),
        pubDate: iso,
        description: (it as any).contentSnippet ?? (it as any).content ?? undefined,
        author: (it as any).creator ?? it.author ?? undefined,
      };
    });
  } catch {
    return [];
  }
}

/** 種別指定でRSS→正規化（URL未設定なら空配列） */
export async function fetchFeed(key: FeedKey, limit = 6): Promise<FeedItem[]> {
  const url = getFeedUrl(key);
  if (!url) return [];
  return readFeedFromUrl(url, limit);
}
