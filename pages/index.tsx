// pages/index.tsx
import Head from "next/head";
import Link from "next/link";
import type { GetStaticProps, InferGetStaticPropsType } from "next";

import NewsFeed from "@/components/feeds/NewsFeed";
import NoteFeed from "@/components/feeds/NoteFeed";
import XTimeline from "@/components/feeds/XTimeline";
import InstagramFeed from "@/components/feeds/InstagramFeed";

import { fetchFeedByUrl, type NormalizedFeedItem } from "@/lib/feeds";
// Contentlayer: 具体の allXXX が無い環境でも動くように「総当り」で取得
import * as CL from "contentlayer/generated";

// -- 各UIが使いやすい形に変換 --
type NewsItem  = { title: string; link: string; source: string; pubDate: string | null };
type NoteItem  = { title: string; link: string; pubDate: string | null; excerpt: string };
type XItem     = { title: string; link: string; pubDate: string | null };
type GuideItem = { href: string; title: string; exam?: string };

// 重複除去（link 基準）
const uniqByLink = <T extends { link: string }>(arr: T[]): T[] => {
  const seen = new Set<string>();
  return arr.filter((x) => (x.link && !seen.has(x.link) ? (seen.add(x.link), true) : false));
};

// 正規化 → News
const toNews = (a: NormalizedFeedItem[]): NewsItem[] =>
  a.map((it) => ({
    title: it.title,
    link: it.link,
    source: it.source,
    pubDate: it.pubDate ?? null,
  }));

// 正規化 → Note
const toNote = (a: NormalizedFeedItem[]): NoteItem[] =>
  a.map((it) => ({
    title: it.title,
    link: it.link,
    pubDate: it.pubDate ?? null,
    excerpt: it.excerpt ?? "",
  }));

// 正規化 → X（軽量）
const toX = (a: NormalizedFeedItem[]): XItem[] =>
  a.map((it) => ({
    title: it.title,
    link: it.link,
    pubDate: it.pubDate ?? null,
  }));

// env をユニオン型へ安全に絞り込む
function toXMode(v?: string): "auto" | "widget" | "fallback" {
  return v === "widget" || v === "fallback" || v === "auto" ? v : "auto";
}

// Contentlayer の日付ソート用ユーティリティ
const ts = (v: unknown): number => {
  if (typeof v === "string") {
    const n = Date.parse(v);
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
};

// Contentlayer から「全部の allXXX 配列」を総当りで集める
const collectAllDocs = (): any[] => {
  const arrays = Object.values(CL).filter(
    (v: unknown) =>
      Array.isArray(v) &&
      v.length > 0 &&
      typeof (v as any)[0] === "object" &&
      (v as any)[0]?._raw
  ) as any[][];
  return arrays.flat();
};

export const getStaticProps: GetStaticProps<{
  newsItems: NewsItem[];
  noteItems: NoteItem[];
  xItems: XItem[];
  guides: GuideItem[];
}> = async () => {
  const NEWS_RSS_URL = process.env.NEWS_RSS_URL || "";
  const NOTE_RSS_URL = process.env.NOTE_RSS_URL || "";
  const X_RSS_URL    = process.env.X_RSS_URL || "";

  const [newsRaw, noteRaw, xRaw] = await Promise.all([
    NEWS_RSS_URL ? fetchFeedByUrl(NEWS_RSS_URL, 6) : Promise.resolve<NormalizedFeedItem[]>([]),
    NOTE_RSS_URL ? fetchFeedByUrl(NOTE_RSS_URL, 6) : Promise.resolve<NormalizedFeedItem[]>([]),
    X_RSS_URL    ? fetchFeedByUrl(X_RSS_URL, 5)    : Promise.resolve<NormalizedFeedItem[]>([]),
  ]);

  const newsItems = uniqByLink(toNews(newsRaw)).slice(0, 6);
  const
