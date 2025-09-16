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
  // CL 内の export のうち、配列で、かつ _raw を持つ要素を含むものだけを採用
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
  const noteItems = uniqByLink(toNote(noteRaw)).slice(0, 6);
  const xItems    = uniqByLink(toX(xRaw)).slice(0, 5);

  // --- ガイド取得（型名や schema 変更に強いロジック） ---
  const allDocs = collectAllDocs();
  const guides: GuideItem[] = allDocs
    // guides/ 配下のみ（型名に依存しない）
    .filter((d: any) => d?._raw?.flattenedPath?.startsWith?.("guides/"))
    // draft を除外（未設定は published 扱い）
    .filter((d: any) => (d?.status ?? "published") !== "draft")
    // 更新順（updated > date の順で存在する方）
    .sort((a: any, b: any) => ts(b?.updated ?? b?.date) - ts(a?.updated ?? a?.date))
    .slice(0, 6)
    .map((g: any) => ({
      href:
        g?.url ??
        (g?.exam
          ? `/guides/${g.exam}/${g.slug}`
          : `/guides/${g?.slug ?? ""}`),
      title: g?.title ?? "(no title)",
      exam: g?.exam,
    }))
    .filter((g) => !!g.href && g.href !== "/guides/");

  return {
    props: { newsItems, noteItems, xItems, guides },
    revalidate: 1800, // 30分ISR
  };
};

export default function HomePage({
  newsItems,
  noteItems,
  xItems,
  guides,
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
            {/* ▼ ガイド（新着） */}
            {guides.length > 0 && (
              <section aria-labelledby="section-guides">
                <h2 id="section-guides" className="text-xl font-bold mb-3">
                  ガイド（新着）
                </h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {guides.map((g) => (
                    <li key={g.href} className="rounded-2xl border border-gray-200 p-4 hover:shadow-sm">
                      <Link href={g.href} className="block">
                        <div className="text-sm text-gray-500">{g.exam ? `#${g.exam}` : ""}</div>
                        <div className="mt-1 font-semibold">{g.title}</div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}
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
