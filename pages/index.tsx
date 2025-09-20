// pages/index.tsx
import Head from "next/head";
import Link from "next/link";
import type { GetStaticProps, InferGetStaticPropsType } from "next";

import NewsFeed from "@/components/feeds/NewsFeed";
import NoteFeed from "@/components/feeds/NoteFeed";
import XTimeline from "@/components/feeds/XTimeline";
import InstagramFeed from "@/components/feeds/InstagramFeed";

import { fetchFeedByUrl, type NormalizedFeedItem } from "@/lib/feeds";
// Contentlayer: 型の変化に強い総当り読み取り（allGuides が無い環境でも動作）
import * as CL from "contentlayer/generated";

/* ========== 表示テーマ（以前の落ち着いた配色） ========== */
const ACCENT = "#A98D74"; // 見出し等のアクセント
const CARD_BORDER = "border border-gray-200";
const CARD_RING = "ring-1 ring-black/5";

/* ========== 型変換ユーティリティ ========== */
type NewsItem = { title: string; link: string; source: string; pubDate: string | null };
type NoteItem = { title: string; link: string; pubDate: string | null; excerpt: string };
type XItem = { title: string; link: string; pubDate: string | null };

const uniqBy = <T, K extends string | number>(arr: T[], key: (v: T) => K) => {
  const seen = new Set<K>();
  return arr.filter((it) => {
    const k = key(it);
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
};

const toNews = (a: NormalizedFeedItem[]): NewsItem[] =>
  a.map((it) => ({
    title: it.title,
    link: it.link,
    source: it.source,
    pubDate: it.pubDate ?? null,
  }));

const toNote = (a: NormalizedFeedItem[]): NoteItem[] =>
  a.map((it) => ({
    title: it.title,
    link: it.link,
    pubDate: it.pubDate ?? null,
    excerpt: it.excerpt ?? "",
  }));

const toX = (a: NormalizedFeedItem[]): XItem[] =>
  a.map((it) => ({
    title: it.title,
    link: it.link,
    pubDate: it.pubDate ?? null,
  }));

function toXMode(v?: string): "auto" | "widget" | "fallback" {
  return v === "widget" || v === "fallback" || v === "auto" ? v : "auto";
}

/* ========== Contentlayer ユーティリティ ========== */
// 日付ソート用（undefined/パース失敗は 0）
const ts = (v: unknown): number => {
  if (typeof v === "string") {
    const n = Date.parse(v);
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
};

// Contentlayer から「全ての allXXX 配列」を集めて平坦化（_raw を持つ配列のみ）
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

// ガイド URL の決定（frontmatter url > exam/slug > slug 直下）
const guideHref = (g: any): string => {
  if (typeof g?.url === "string" && g.url.startsWith("/guides/")) return g.url;
  const slug = String(g?.slug ?? g?._raw?.flattenedPath?.split("/")?.pop() ?? "").trim();
  const examRaw = String(g?.exam ?? g?._raw?.flattenedPath?.split("/")?.[1] ?? "").toLowerCase();
  const exam = examRaw === "qc" ? "qc" : examRaw === "stat" || examRaw === "stats" ? "stat" : examRaw === "engineer" || examRaw === "eng" || examRaw === "pe" ? "engineer" : "qc";
  return `/guides/${exam}/${slug}`;
};

/* ========== SSG ========== */
export const getStaticProps: GetStaticProps<{
  newsItems: NewsItem[];
  noteItems: NoteItem[];
  xItems: XItem[];
  latestGuides: { href: string; title: string; exam?: string; description?: string }[];
}> = async () => {
  const NEWS_RSS_URL = process.env.NEWS_RSS_URL || "";
  const NOTE_RSS_URL = process.env.NOTE_RSS_URL || "";
  const X_RSS_URL = process.env.X_RSS_URL || "";

  const [newsRaw, noteRaw, xRaw] = await Promise.all([
    NEWS_RSS_URL ? fetchFeedByUrl(NEWS_RSS_URL, 6) : Promise.resolve<NormalizedFeedItem[]>([]),
    NOTE_RSS_URL ? fetchFeedByUrl(NOTE_RSS_URL, 6) : Promise.resolve<NormalizedFeedItem[]>([]),
    X_RSS_URL ? fetchFeedByUrl(X_RSS_URL, 5) : Promise.resolve<NormalizedFeedItem[]>([]),
  ]);

  const newsItems = uniqBy(toNews(newsRaw), (it) => it.link).slice(0, 3); // ★ NEWSは3件
  const noteItems = uniqBy(toNote(noteRaw), (it) => it.link).slice(0, 3); // ★ NOTEも3件
  const xItems = uniqBy(toX(xRaw), (it) => it.link).slice(0, 3); // Xも3件

  // 最新ガイド2件（draft除外、guides/ 配下のみ、updatedAtAuto > date 優先、href重複排除）
  const allDocs = collectAllDocs();
  const latestGuides = uniqBy(
    allDocs
      .filter((d: any) => d?._raw?.flattenedPath?.startsWith?.("guides/"))
      .filter((d: any) => (d?.status ?? "published") !== "draft")
      .sort((a: any, b: any) => ts(b?.updatedAtAuto ?? b?.updated ?? b?.date) - ts(a?.updatedAtAuto ?? a?.updated ?? a?.date))
      .map((g: any) => ({
        href: guideHref(g),
        title: g?.title ?? "(no title)",
        exam: g?.exam,
        description: g?.description,
      })),
    (g) => g.href
  ).slice(0, 2);

  return {
    props: { newsItems, noteItems, xItems, latestGuides },
    revalidate: 1800, // 30分ISR
  };
};

/* ========== Page ========== */
export default function HomePage({
  newsItems,
  noteItems,
  xItems,
  latestGuides,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const xEmbedMode = toXMode(process.env.NEXT_PUBLIC_X_EMBED_MODE);

  return (
    <>
      <Head>
        <title>QC × IE LABO</title>
        <meta name="description" content="品質管理・統計・技術士の学習ガイドと最新情報" />
      </Head>

      <main className="mx-auto max-w-6xl px-4 py-8">
        {/* ===== ヒーロー ===== */}
        <section className="mb-8">
          <h1 className="text-2xl md:text-3xl font-extrabold" style={{ color: ACCENT }}>
            QC × IE LABO
          </h1>
          <p className="mt-2 text-gray-600">
            品質管理・統計・技術士に役立つガイドと最新情報を一箇所に。
          </p>
        </section>

        {/* ===== カテゴリー（3枚） ===== */}
        <section aria-labelledby="section-cats" className="mb-8">
          <h2 id="section-cats" className="sr-only">
            カテゴリー
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { href: "/guides/qc", label: "品質管理", sub: "QC / TQM / 実務" },
              { href: "/guides/stat", label: "統計", sub: "回帰 / 検定 / 管理図" },
              { href: "/guides/engineer", label: "技術士", sub: "計画 / IE / 実務" },
            ].map((c) => (
              <Link
                key={c.href}
                href={c.href}
                className={`rounded-2xl bg-white ${CARD_BORDER} ${CARD_RING} p-5 hover:shadow`}
              >
                <div className="text-lg font-bold" style={{ color: ACCENT }}>
                  {c.label}
                </div>
                <div className="text-sm text-gray-600 mt-1">{c.sub}</div>
              </Link>
            ))}
          </div>
        </section>

        {/* ===== 最新ガイド 2件（動的） ===== */}
        <section aria-labelledby="section-guides" className="mb-10">
          <h2 id="section-guides" className="text-xl font-bold mb-3" style={{ color: ACCENT }}>
            新着ガイド
          </h2>
          {latestGuides.length > 0 ? (
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {latestGuides.map((g) => (
                <li
                  key={g.href}
                  className={`rounded-2xl bg-white ${CARD_BORDER} ${CARD_RING} p-4 hover:shadow-sm`}
                >
                  <Link href={g.href} className="block">
                    <div className="text-sm text-gray-500">{g.exam ? `#${g.exam}` : ""}</div>
                    <div className="mt-1 font-semibold">{g.title}</div>
                    {g.description && (
                      <p className="mt-1 text-sm text-gray-600 line-clamp-2">{g.description}</p>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">公開中のガイドはまだありません。</p>
          )}
        </section>

        {/* ===== 情報 & SNS（2カラムで並べる） ===== */}
        <section aria-labelledby="section-feeds">
          <h2 id="section-feeds" className="sr-only">
            フィード
          </h2>

          {/* 1段目：News / Note */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className={`rounded-2xl bg-white ${CARD_BORDER} ${CARD_RING} p-4`}>
              <NewsFeed limit={3} items={newsItems} />
            </div>
            <div className={`rounded-2xl bg-white ${CARD_BORDER} ${CARD_RING} p-4`}>
              <NoteFeed limit={3} user="nieqc_0713" items={noteItems} />
            </div>
          </div>

          {/* 2段目：X / Instagram */}
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className={`rounded-2xl bg-white ${CARD_BORDER} ${CARD_RING} p-4`}>
              <XTimeline username="@n_ieqclab" limit={3} mode={xEmbedMode} items={xItems} minHeight={480} />
            </div>
            <div className={`rounded-2xl bg-white ${CARD_BORDER} ${CARD_RING} p-4`}>
              <InstagramFeed limit={3} />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
