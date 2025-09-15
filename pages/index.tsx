// pages/index.tsx
import Head from "next/head";
import type { GetStaticProps, InferGetStaticPropsType } from "next";

import NewsFeed from "@/components/feeds/NewsFeed";
import NoteFeed from "@/components/feeds/NoteFeed";
import XTimeline from "@/components/feeds/XTimeline";
import InstagramFeed from "@/components/feeds/InstagramFeed";

import { fetchFeedByUrl, type NormalizedFeedItem } from "@/lib/feeds";

// -- 各UIが使いやすい形に変換 --
type NewsItem = { title: string; link: string; source: string; pubDate: string | null };
type NoteItem = { title: string; link: string; pubDate: string | null; excerpt: string };
type XItem    = { title: string; link: string; pubDate: string | null };

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

export const getStaticProps: GetStaticProps<{
  newsItems: NewsItem[];
  noteItems: NoteItem[];
  xItems: XItem[];
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
  const noteItems = uniqByLink(toNote(noteRaw)).slice(0, 6);
  const xItems    = uniqByLink(toX(xRaw)).slice(0, 5);

  return {
    props: { newsItems, noteItems, xItems },
    revalidate: 1800, // 30分ISR
  };
};

export default function HomePage({
  newsItems,
  noteItems,
  xItems,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const xEmbedMode = toXMode(process.env.NEXT_PUBLIC_X_EMBED_MODE);

  return (
    <>
      <Head>
        <title>QC × IE LABO</title>
        <meta name="description" content="品質管理・経営工学の学習と実務に役立つガイドと最新情報" />
      </Head>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <section className="mb-8">
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">QC × IE LABO</h1>
          <p className="mt-2 text-gray-600">
            現場で使える品質管理・経営工学のガイドと最新情報を一箇所に。
          </p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* 既存のガイド一覧やカード群をそのまま残してください */}
          </div>

          <aside className="space-y-6">
            {/* ISR 渡し */}
            <NewsFeed limit={6} items={newsItems} />
            <NoteFeed limit={6} user="nieqc_0713" items={noteItems} />

            {/* X：ISRの軽量リスト + ウィジェット（modeはユニオン化した値を渡す） */}
            <XTimeline
              username="@n_ieqclab"
              limit={5}
              mode={xEmbedMode}
              items={xItems}
              minHeight={600}
            />

            {/* Instagram：画像URLなど専用項目が必要なため items は渡さずクライアント側取得 */}
            <InstagramFeed limit={3} />
          </aside>
        </div>
      </main>
    </>
  );
}
