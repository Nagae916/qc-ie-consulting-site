// lib/feeds.ts
// シンプル・運用優先のRSS正規化ユーティリティ（型依存を最小化）
import Parser from "rss-parser";

export type NormalizedFeedItem = {
  title: string;
  link: string;
  source: string;
  isoDate: string | null;
  description?: string;
  image?: string | null;
};

// ライブラリ型に強く依存しない最小の項目セット
type RssItem = {
  title?: string;
  link?: string;
  guid?: string;
  pubDate?: string;
  isoDate?: string;
  date?: string;
  contentSnippet?: string;
  content?: string;
  enclosure?: { url?: string };
  image?: string;
  thumbnail?: string;
  ["media:thumbnail"]?: { $?: { url?: string } };
  ["content:encoded"]?: string;
  // その他は any 許容（将来のRSS差異に強くする）
  [key: string]: any;
};

const parser = new Parser();

const toISO = (v?: string): string | null => {
  if (!v) return null;
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
};

const stripHtml = (html?: string): string => {
  if (!html) return "";
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .trim();
};

const imageFromHtml = (html?: string): string | null => {
  if (!html) return null;
  const m = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return m?.[1] ?? null;
};

/** 任意のRSS URLをパースして、UIで使いやすい配列へ正規化 */
export async function fetchFeed(url: string, limit = 10): Promise<NormalizedFeedItem[]> {
  try {
    const feed = await parser.parseURL(url);
    const source = feed.title ?? "";

    const items = (feed.items ?? [])
      .map((raw): NormalizedFeedItem | null => {
        const it = raw as RssItem;

        const title = it.title ?? "";
        const link = it.link ?? it.guid ?? "";
        if (!title || !link) return null;

        const isoDate = toISO(it.isoDate ?? it.pubDate ?? it.date);

        const html = it["content:encoded"] ?? it.content ?? "";
        const image =
          it.enclosure?.url ||
          it.image ||
          it.thumbnail ||
          it["media:thumbnail"]?.$?.url ||
          imageFromHtml(html) ||
          null;

        const description = it.contentSnippet ?? stripHtml(html);

        return { title, link, source, isoDate, description, image };
      })
      .filter((x): x is NormalizedFeedItem => !!x)
      .slice(0, limit);

    return items;
  } catch {
    // 壊れたRSSや一時エラーでも全体を落とさない
    return [];
  }
}
