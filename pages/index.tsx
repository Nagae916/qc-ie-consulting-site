// pages/index.tsx
import Head from "next/head";
import Link from "next/link";
import type { GetStaticProps, InferGetStaticPropsType } from "next";

import NewsFeed from "@/components/feeds/NewsFeed";
import NoteFeed from "@/components/feeds/NoteFeed";
import XTimeline from "@/components/feeds/XTimeline";
import InstagramFeed from "@/components/feeds/InstagramFeed";

import { fetchFeedByUrl, type NormalizedFeedItem } from "@/lib/feeds";
import { allGuides, type Guide } from "contentlayer/generated";

/* ===== ユーティリティ ===== */
type NewsItem = { title: string; link: string; source: string; pubDate: string | null };
type NoteItem = { title: string; link: string; pubDate: string | null; excerpt: string };
type XItem = { title: string; link: string; pubDate: string | null };

const uniqBy = <T, K extends string | number>(arr: T[], keyFn: (x: T) => K) => {
  const seen = new Set<K>();
  return arr.filter((x) => {
    const k = keyFn(x);
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
};

const toNews = (a: NormalizedFeedItem[]): NewsItem[] =>
  a.map((it) => ({ title: it.title, link: it.link, source: it.source, pubDate: it.pubDate ?? null }));

const toNote = (a: NormalizedFeedItem[]): NoteItem[] =>
  a.map((it) => ({ title: it.title, link: it.link, pubDate: it.pubDate ?? null, excerpt: it.excerpt ?? "" }));

const toX = (a: NormalizedFeedItem[]): XItem[] =>
  a.map((it) => ({ title: it.title, link: it.link, pubDate: it.pubDate ?? null }));

function toXMode(v?: string): "auto" | "widget" | "fallback" {
  return v === "widget" || v === "fallback" || v === "auto" ? v : "auto";
}

/* ===== ガイド関連 ===== */
type ExamKey = "qc" | "stat" | "engineer";
const EXAM_LABEL: Record<ExamKey, string> = { qc: "品質管理", stat: "統計", engineer: "技術士" };

const toExamKey = (v: unknown): ExamKey | null => {
  const s = String(v ?? "").toLowerCase().trim();
  if (s === "qc") return "qc";
  if (s === "stat" || s === "stats" || s === "statistics") return "stat";
  if (s === "engineer" || s === "pe" || s === "eng") return "engineer";
  return null;
};

// URLを安全に構成
const guideHref = (g: Guide) => {
  if (typeof (g as any).url === "string" && (g as any).url.startsWith("/guides/")) return (g as any).url as string;
  const exam = toExamKey((g as any).exam) ?? "qc";
  const slug = String((g as any).slug ?? g._raw?.flattenedPath?.split("/").pop() ?? "").trim();
  return `/guides/${exam}/${slug}`;
};

// 並べ替えキー：updatedAtAuto > updatedAt > date
const timeKey = (g: Guide): number =>
  Date.parse(String((g as any).updatedAtAuto ?? (g as any).updatedAt ?? (g as any).date ?? "")) || 0;

/* ===== SSG ===== */
export const getStaticProps: GetStaticProps<{
  newsItems: NewsItem[];
  noteItems: NoteItem[];
  xItems: XItem[];
  latestGuides: { href: string; title: string; exam: ExamKey }[];
}> = async () => {
  const NEWS_RSS_URL = process.env.NEWS_RSS_URL || "";
  const NOTE_RSS_URL = process.env.NOTE_RSS_URL || "";
  const X_RSS_URL = process.env.X_RSS_URL || "";

  const [newsRaw, noteRaw, xRaw] = await Promise.all([
    NEWS_RSS_URL ? fetchFeedByUrl(NEWS_RSS_URL, 6) : Promise.resolve<NormalizedFeedItem[]>([]),
    NOTE_RSS_URL ? fetchFeedByUrl(NOTE_RSS_URL, 6) : Promise.resolve<NormalizedFeedItem[]>([]),
    X_RSS_URL ? fetchFeedByUrl(X_RSS_URL, 6) : Promise.resolve<NormalizedFeedItem[]>([]),
  ]);

  // すべて「最新3件」に統一
  const newsItems = uniqBy(toNews(newsRaw), (x) => x.link).slice(0, 3);
  const noteItems = uniqBy(toNote(noteRaw), (x) => x.link).slice(0, 3);
  const xItems = uniqBy(toX(xRaw), (x) => x.link).slice(0, 3);

  // 下書き除外 → 更新日降順で最新2件
  const latestGuides = uniqBy(
    [...allGuides]
      .filter((g) => (g as any).status !== "draft")
      .sort((a, b) => timeKey(b) - timeKey(a))
      .map((g) => ({
        href: guideHref(g),
        title: (g as any).title as string,
        exam: (toExamKey((g as any).exam) ?? "qc") as ExamKey,
      })),
    (x) => x.href
  ).slice(0, 2);

  return {
    props: { newsItems, noteItems, xItems, latestGuides },
    revalidate: 1800, // 30分
  };
};

/* ===== Page ===== */
export default function HomePage({
  newsItems,
  noteItems,
  xItems,
  latestGuides,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const xEmbedMode = toXMode(process.env.NEXT_PUBLIC_X_EMBED_MODE);

  // トップ・カテゴリ（3列）
  const categories: { key: ExamKey; href: string; accent: string; ring: string }[] = [
    { key: "qc", href: "/guides/qc", accent: "bg-amber-300/70", ring: "ring-amber-300/40" },
    { key: "stat", href: "/guides/stat", accent: "bg-sky-300/70", ring: "ring-sky-300/40" },
    { key: "engineer", href: "/guides/engineer", accent: "bg-emerald-300/70", ring: "ring-emerald-300/40" },
  ];

  return (
    <>
      <Head>
        <title>QC × IE LABO</title>
        <meta name="description" content="品質管理・統計・技術士のガイドと最新情報を整理して提供" />
      </Head>

      <main className="mx-auto max-w-6xl px-4 py-8">
        {/* 見出し */}
        <section className="mb-6">
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">QC × IE LABO</h1>
          <p className="mt-2 text-gray-600">品質管理・統計・技術士のガイドと最新情報を一箇所に。</p>
        </section>

        {/* 1) ガイドカテゴリ（3列） */}
        <section aria-labelledby="sec-categories" className="mb-8">
          <h2 id="sec-categories" className="sr-only">
            ガイドカテゴリ
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {categories.map((c) => (
              <li key={c.key} className={`rounded-2xl border border-gray-200 bg-white shadow-sm ring-2 ${c.ring}`}>
                <div className={`h-1 w-full rounded-t-2xl ${c.accent}`} />
                <Link href={c.href} className="block p-5 hover:opacity-90">
                  <div className="text-sm text-gray-500">カテゴリ</div>
                  <div className="mt-1 text-xl font-bold">{EXAM_LABEL[c.key]}</div>
                  <div className="mt-2 text-sm text-gray-600">クリックして一覧を見る</div>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* 2) 最新ガイド2件 */}
        {latestGuides.length > 0 && (
          <section aria-labelledby="sec-latest" className="mb-10">
            <h2 id="sec-latest" className="text-xl font-bold mb-3">
              新着ガイド
            </h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {latestGuides.map((g) => (
                <li key={g.href} className="rounded-2xl border border-gray-200 bg-white shadow-sm">
                  <div
                    className={`h-1 w-full rounded-t-2xl ${
                      g.exam === "qc" ? "bg-amber-300/70" : g.exam === "stat" ? "bg-sky-300/70" : "bg-emerald-300/70"
                    }`}
                  />
                  <Link href={g.href} className="block p-5 hover:underline">
                    <div className="text-sm text-gray-500">#{EXAM_LABEL[g.exam]}</div>
                    <div className="mt-1 font-semibold text-gray-900">{g.title}</div>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* 3) SNS等：2カラム×複数段（NEWS/NOTE/X/Instagram） */}
        <section aria-labelledby="sec-social" className="mb-4">
          <h2 id="sec-social" className="sr-only">
            フィード
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 1段目 */}
            <div className="rounded-2xl border border-gray-200 bg-white p-4 ring-2 ring-sky-300/20">
              <NewsFeed limit={3} items={newsItems} />
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-4 ring-2 ring-amber-300/20">
              <NoteFeed limit={3} user="nieqc_0713" items={noteItems} />
            </div>

            {/* 2段目 */}
            <div className="rounded-2xl border border-gray-200 bg-white p-4 ring-2 ring-emerald-300/20">
              <XTimeline username="@n_ieqclab" limit={3} mode={xEmbedMode} items={xItems} minHeight={560} />
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-4 ring-2 ring-slate-300/30">
              <InstagramFeed limit={3} />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
