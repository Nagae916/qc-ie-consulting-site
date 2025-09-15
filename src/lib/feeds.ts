// src/lib/feeds.ts
import Parser from "rss-parser";

/** 取り扱うフィード種別（/api/feeds/[key] などで利用） */
export type FeedKey = "news" | "blog" | "note" | "instagram" | "x";

/** どのUIでも扱える“最小かつ壊れにくい”正規化スキーマ */
export type NormalizedFeedItem = {
  title: string;
  link: string;
  source: string;              // フィードタイトル or ドメイン
  pubDate: string | null;      // ISO8601 or null
  /** 互換用（古いコードで参照していた場合に備え残します） */
  isoDate?: string | null;     // = pubDate（同値を入れておく）
  /** 本文抜粋（contentSnippet を優先） */
  description?: string;        // 抜粋／本文の一部
  /** 互換用（従来の命名を残すが、内容は description と同値） */
  excerpt?: string;
  /** あればサムネイル等の画像URL */
  image?: string | null;
};

// .env をひとまとめに
const env = {
  NEWS_RSS_URL: process.env.NEWS_RSS_URL || "",
  BLOG_RSS_URL: process.env.BLOG_RSS_URL || "",
  NOTE_RSS_URL: process.env.NOTE_RSS_URL || "",
  INSTAGRAM_RSS_URL: process.env.INSTAGRAM_RSS_URL || "",
  X_RSS_URL: process.env.X_RSS_URL || "",
};

function pickUrlByKey(key: FeedKey): string {
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

function hostOf(url: string): string {
  try {
    const h = new URL(url).hostname;
    return h.startsWith("www.") ? h.slice(4) : h;
  } catch {
    return "";
  }
}

function firstImgFromHtml(html?: string): string | null {
  if (!html) return null;
  const m = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return m?.[1] ?? null;
}

function str(v: unknown): string {
  return typeof v === "string" ? v : "";
}

/**
 * RSS を読み込んで最小情報に正規化。
 * - 引数は FeedKey でも “生のURL文字列” でもOK（呼び元差異を吸収）
 * - 壊れにくさ／可読性を優先（型は最小限・例外は握りつぶして空配列）
 */
export async function fetchFeed(
  input: FeedKey | string,
  limit = 10
): Promise<NormalizedFeedItem[]> {
  const url = ((): string => {
    if (typeof input === "string") {
      // URLかどうかざっくり判定（http/https 始まりならそのまま）
      if (/^https?:\/\//i.test(input)) return input;
      // 文字列だが URL でなければ FeedKey とみなして拾う
      return pickUrlByKey(input as FeedKey);
    }
    return pickUrlByKey(input);
  })();

  if (!url) return [];

  const parser = new Parser();
  const feed = await parser
    .parseURL(url)
    .catch(() => ({ title: "", items: [] as any[] }));

  const feedTitle = str((feed as any)?.title);

  const items: NormalizedFeedItem[] = (Array.isArray((feed as any)?.items)
    ? (feed as any).items
    : []
  )
    .map((raw: any): NormalizedFeedItem | null => {
      const title = str(raw?.title).trim();
      const link =
        (typeof raw?.link === "string" && raw.link) ||
        (typeof raw?.guid === "string" && raw.guid) ||
        "";
      if (!title || !link) return null;

      const iso =
        toISO(raw?.isoDate) ?? toISO(raw?.pubDate) ?? toISO((raw as any)?.date);

      // 抜粋・本文（description 優先、なければ contentSnippet / content）
      const desc =
        str(raw?.contentSnippet) ||
        str(raw?.content) ||
        str(raw?.description) ||
        "";

      // 画像の当たりを広めに見る（enclosure / media / HTML内img）
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
        isoDate: iso, // 互換プロパティ（同値）
        description: desc,
        excerpt: desc, // 互換プロパティ
        image,
      };
    })
    .filter((x): x is NormalizedFeedItem => !!x)
    .sort(
      (a, b) =>
        new Date(b.pubDate || 0).getTime() - new Date(a.pubDate || 0).getTime()
    )
    .slice(0, limit);

  return items;
}
