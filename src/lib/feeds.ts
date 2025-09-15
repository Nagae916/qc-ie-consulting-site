// src/lib/feeds.ts
import Parser from "rss-parser";

/** /api/feeds/[key] などで使うフィード種別 */
export type FeedKey = "news" | "blog" | "note" | "instagram" | "x";

/** どのUIでも扱える“最小で壊れにくい”正規化スキーマ */
export type NormalizedFeedItem = {
  title: string;
  link: string;
  source: string;           // フィードタイトル or ドメイン
  pubDate: string | null;   // ISO8601 or null
  /** 互換用（同値を入れておく） */
  isoDate?: string | null;  // = pubDate
  /** 抜粋（contentSnippet / content / description の順で採用） */
  description?: string;
  /** 互換用（旧コード向けエイリアス） */
  excerpt?: string;
  /** あればサムネイル等の画像URL（enclosure / media / HTML内img を探索） */
  image?: string | null;
};

const env = {
  NEWS_RSS_URL: process.env.NEWS_RSS_URL || "",
  BLOG_RSS_URL: process.env.BLOG_RSS_URL || "",
  NOTE_RSS_URL: process.env.NOTE_RSS_URL || "",
  INSTAGRAM_RSS_URL: process.env.INSTAGRAM_RSS_URL || "",
  X_RSS_URL: process.env.X_RSS_URL || "",
};

export function pickUrl(key: FeedKey): string {
  switch (key) {
    case "news": return env.NEWS_RSS_URL;
    case "blog": return env.BLOG_RSS_URL;
    case "note": return env.NOTE_RSS_URL;
    case "instagram": return env.INSTAGRAM_RSS_URL;
    case "x": return env.X_RSS_URL;
  }
}

function toISO(v: unknown): string | null {
  if (typeof v !== "string" || !v) return null;
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

function hostOf(url: string): string {
  try {
    const h = new URL(url).hostname;
    return h.startsWith("www.") ? h.slice(4) : h;
  } catch {
    return "";
  }
}

function str(v: unknown): string {
  return typeof v === "string" ? v : "";
}

function firstImgFromHtml(html?: string): string | null {
  if (!html) return null;
  const m = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return m?.[1] ?? null;
}

/** 生URLを受け取って RSS を正規化（内部共通実装） */
async function parseAndNormalize(url: string, limit = 10): Promise<NormalizedFeedItem[]> {
  if (!url) return [];

  const parser = new Parser();
  const feed = await parser.parseURL(url).catch(() => ({ title: "", items: [] as any[] }));
  const feedTitle = str((feed as any).title);

  const items: NormalizedFeedItem[] = (Array.isArray((feed as any).items) ? (feed as any).items : [])
    .map((raw: any): NormalizedFeedItem | null => {
      const title = str(raw?.title).trim();
      const link =
        (typeof raw?.link === "string" && raw.link) ||
        (typeof raw?.guid === "string" && raw.guid) ||
        "";
      if (!title || !link) return null;

      const iso = toISO(raw?.isoDate) ?? toISO(raw?.pubDate) ?? toISO((raw as any)?.date);
      const desc =
        str(raw?.contentSnippet) ||
        str(raw?.content) ||
        str(raw?.description) ||
        "";

      const image =
        (raw?.enclosure?.url as string | undefined) ||
        (Array.isArray(raw?.enclosures) && raw.enclosures[0]?.url) ||
        (raw?.["media:content"]?.url as string | undefined) ||
        firstImgFromHtml(str(raw?.content) || str(raw?.description)) ||
        null;

      return {
        title,
        link,
        source: feedTitle || hostOf(link),
        pubDate: iso,
        isoDate: iso,
        description: desc,
        excerpt: desc,
        image,
      };
    })
    .filter((x): x is NormalizedFeedItem => !!x)
    .sort((a, b) => new Date(b.pubDate || 0).getTime() - new Date(a.pubDate || 0).getTime())
    .slice(0, limit);

  return items;
}

/**
 * 汎用取得関数：
 * - FeedKey でも “生のURL文字列” でも受け取れる
 */
export async function fetchFeed(input: FeedKey | string, limit = 10): Promise<NormalizedFeedItem[]> {
  const url =
    typeof input === "string"
      ? (/^https?:\/\//i.test(input) ? input : pickUrl(input as FeedKey))
      : pickUrl(input);
  return parseAndNormalize(url, limit);
}

/** URL直指定版（index.tsx が参照する旧名との互換用） */
export async function fetchFeedByUrl(url: string, limit = 10): Promise<NormalizedFeedItem[]> {
  return parseAndNormalize(url, limit);
}
