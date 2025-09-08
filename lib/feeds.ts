// lib/feeds.ts
import Parser from "rss-parser";

export type NormalizedFeedItem = {
  title: string;
  link: string;
  source: string;
  isoDate: string | null;
  description?: string;
  image?: string | null;
};

type RssItem = Parser.Item & {
  isoDate?: string;
  date?: string;
  contentSnippet?: string;
  enclosure?: { url?: string };
  // RSSHub/Nitter 等のバリアント対策
  image?: string;
  thumbnail?: string;
  ["media:thumbnail"]?: { $?: { url?: string } };
  ["content:encoded"]?: string;
};

const parser = new Parser();

const toISO = (v?: string): string | null => {
  if (!v) return null;
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
};

const stripHtml = (html?: string): string => {
  if (!html) return "";
  return html.replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]+>/g, "").trim();
};

const imageFromHtml = (html?: string): string | null => {
  if (!html) return null;
  const m = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return m?.[1] ?? null;
};

/** 任意の RSS URL を正規化して返す（/api/feeds/* から利用） */
export async function fetchFeed(url: string, limit = 10): Promise<NormalizedFeedItem[]> {
  const feed = await parser.parseURL(url);
  const source = feed.title ?? "";
  const items = (feed.items ?? [])
    .slice(0, limit)
    // ★ ここで明示的に型注釈（implicit any を排除）
    .map((it: RssItem): NormalizedFeedItem => {
      const link = it.link ?? (it as any).guid ?? "";
      const iso = toISO(it.isoDate ?? it.pubDate ?? it.date);
      const title = it.title ?? "";

      const html = (it as any)["content:encoded"] ?? (it as any).content ?? "";
      const image =
        it.enclosure?.url ||
        it.image ||
        it.thumbnail ||
        (it["media:thumbnail"]?.$?.url ?? null) ||
        imageFromHtml(html);

      const description = it.contentSnippet ?? stripHtml(html);

      return { title, link, source, isoDate: iso, description, image };
    })
    .filter((x) => x.title && x.link);

  return items;
}
