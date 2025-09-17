// pages/index.tsx
import Head from "next/head";
import Link from "next/link";
import type { GetStaticProps, InferGetStaticPropsType } from "next";

import NewsFeed from "@/components/feeds/NewsFeed";
import NoteFeed from "@/components/feeds/NoteFeed";
import XTimeline from "@/components/feeds/XTimeline";
import InstagramFeed from "@/components/feeds/InstagramFeed";

import { fetchFeedByUrl, type NormalizedFeedItem } from "@/lib/feeds";
import * as CL from "contentlayer/generated";

/* ============ 型 ============ */
type NewsItem  = { title: string; link: string; source: string; pubDate: string | null };
type NoteItem  = { title: string; link: string; pubDate: string | null; excerpt: string };
type XItem     = { title: string; link: string; pubDate: string | null };
type GuideItem = { href: string; title: string; exam?: "qc" | "stat" | "engineer"; description?: string; updatedAt?: string; date?: string };

type Exam = "qc" | "stat" | "engineer";

/* ============ 定数 ============ */
const ACCENT = "#A98D74";
const RING   = "ring-1 ring-[#A98D74]/30";
const EXAM_LABEL: Record<Exam, string> = {
  qc: "品質管理",
  stat: "統計",
  engineer: "技術士",
};

/* ============ ユーティリティ ============ */
const uniqBy = <T, K extends string | number>(arr: T[], keyFn: (v: T) => K): T[] => {
  const seen = new Set<K>();
  const out: T[] = [];
  for (const it of arr) {
    const k = keyFn(it);
    if (!seen.has(k)) { seen.add(k); out.push(it); }
  }
  return out;
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

const collectAllDocs = (): any[] => {
  const arrays = Object.values(CL).filter(
    (v: unknown) => Array.isArray(v) && v.length > 0 && typeof (v as any)[0] === "object" && (v as any)[0]?._raw
  ) as any[][];
  return arrays.flat();
};

const ts = (v: unknown): number => {
  if (typeof v === "string") {
    const n = Date.parse(v);
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
};

/* ============ ISR ============ */
export const getStaticProps: GetStaticProps<{
  latestGuides: GuideItem[];              // 最新 2 件（重複排除）
  newsItems: NewsItem[];                  // 3 件
  noteItems: NoteItem[];                  // 3 件
  xItems: XItem[];                        // 3 件（軽量）
}> = async () => {
  const NEWS_RSS_URL = process.env.NEWS_RSS_URL || "";
  const NOTE_RSS_URL = process.env.NOTE_RSS_URL || "";
  const X_RSS_URL    = process.env.X_RSS_URL || "";

  // フィードは多めに取って重複排除後 3 件に丸める
  const [newsRaw, noteRaw, xRaw] = await Promise.all([
    NEWS_RSS_URL ? fetchFeedByUrl(NEWS_RSS_URL, 6) : Promise.resolve<NormalizedFeedItem[]>([]),
    NOTE_RSS_URL ? fetchFeedByUrl(NOTE_RSS_URL, 6) : Promise.resolve<NormalizedFeedItem[]>([]),
    X_RSS_URL    ? fetchFeedByUrl(X_RSS_URL, 6)    : Promise.resolve<NormalizedFeedItem[]>([]),
  ]);

  const newsItems = uniqBy(toNews(newsRaw), (x) => x.link).slice(0, 3);
  const noteItems = uniqBy(toNote(noteRaw), (x) => x.link).slice(0, 3);
  const xItems    = uniqBy(toX(xRaw),     (x) => x.link).slice(0, 3);

  // 最新ガイド 2 件（重複排除＆ guides/ 配下のみ & draft除外）
  const allDocs = collectAllDocs();
  const allGuides: GuideItem[] = allDocs
    .filter((d: any) => d?._raw?.flattenedPath?.startsWith?.("guides/"))
    .filter((d: any) => (d?.status ?? "published") !== "draft")
    .map((g: any) => ({
      href: g?.url ?? (g?.exam ? `/guides/${g.exam}/${g.slug}` : `/guides/${g?.slug ?? ""}`),
      title: g?.title ?? "(no title)",
      exam: g?.exam,
      description: g?.description,
      updatedAt: g?.updatedAt ?? g?.updatedAtAuto,
      date: g?.date,
    }))
    .filter((g) => !!g.href && g.href !== "/guides/");

  const deDuped = uniqBy(allGuides, (g) => g.href);
  const latestGuides = deDuped
    .sort((a, b) => (ts(b.updatedAt ?? b.date) - ts(a.updatedAt ?? a.date)))
    .slice(0, 2);

  return {
    props: { latestGuides, newsItems, noteItems, xItems },
    revalidate: 1800, // 30分
  };
};

/* ============ ページ ============ */
export default function HomePage({
  latestGuides,
  newsItems,
  noteItems,
  xItems,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const xEmbedMode = toXMode(process.env.NEXT_PUBLIC_X_EMBED_MODE);

  const CategoryCard = ({ exam }: { exam: Exam }) => (
    <Link
      href={`/guides/${exam}`}
      className={`block rounded-2xl border border-gray-200 ${RING} bg-white p-5 hover:shadow-sm transition`}
      style={{ borderTop: `4px solid ${ACCENT}` }}
    >
      <div className="text-xs tracking-wide uppercase text-gray-500">Category</div>
      <div className="mt-1 font-semibold text-gray-900 text-lg">{EXAM_LABEL[exam]}</div>
      <div className="mt-1 text-sm text-gray-600">クリックすると {EXAM_LABEL[exam]} のガイド一覧へ</div>
    </Link>
  );

  return (
    <>
      <Head>
        <title>QC × IE LABO</title>
        <meta name="description" content="品質管理・統計・技術士の学習と実務に役立つガイドと最新情報" />
      </Head>

      <main className="mx-auto max-w-6xl px-4 py-8">
        {/* 見出し */}
        <section className="mb-6">
          <h1 className="text-2xl md:text-3xl font-extrabold" style={{ color: ACCENT }}>
            QC × IE LABO
          </h1>
          <p className="mt-2 text-gray-600">
            現場で使えるガイドと最新情報をカテゴリ別に。
          </p>
        </section>

        {/* ❷ カテゴリ（三枚） */}
        <section className="mb-8" aria-labelledby="section-cats">
          <h2 id="section-cats" className="text-xl font-bold mb-3" style={{ color: ACCENT }}>
            ガイド・カテゴリー
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <CategoryCard exam="qc" />
            <CategoryCard exam="stat" />
            <CategoryCard exam="engineer" />
          </div>
        </section>

        {/* ❸ カテゴリの下に「最新ガイド 2 件」 */}
        <section className="mb-10" aria-labelledby="section-latest">
          <h2 id="section-latest" className="text-xl font-bold mb-3" style={{ color: ACCENT }}>
            最新ガイド
          </h2>
          {latestGuides.length === 0 ? (
            <div className={`rounded-xl border border-gray-200 ${RING} bg-white p-4 text-gray-500`}>
              ガイドがまだありません。
            </div>
          ) : (
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {latestGuides.map((g) => (
                <li key={g.href}>
                  <Link
                    href={g.href}
                    className={`block rounded-2xl border border-gray-200 ${RING} bg-white p-4 hover:shadow-sm transition`}
                    style={{ borderTop: `4px solid ${ACCENT}` }}
                  >
                    <div className="text-xs tracking-wide uppercase text-gray-500">
                      {g.exam ? EXAM_LABEL[g.exam] : "guide"}
                    </div>
                    <div className="mt-1 font-semibold text-gray-900">{g.title}</div>
                    {g.description && <p className="mt-1 text-sm text-gray-600 line-clamp-2">{g.description}</p>}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* ❺ SNS：最新 3 件ずつ */}
        <section aria-labelledby="section-social" className="space-y-6">
          <h2 id="section-social" className="sr-only">ソーシャル</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={`rounded-2xl border border-gray-200 ${RING} bg-white p-4`}>
              <NewsFeed limit={3} items={newsItems} />
            </div>
            <div className={`rounded-2xl border border-gray-200 ${RING} bg-white p-4`}>
              <NoteFeed limit={3} user="nieqc_0713" items={noteItems} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={`rounded-2xl border border-gray-200 ${RING} bg-white p-4`}>
              <XTimeline username="@n_ieqclab" limit={3} mode={xEmbedMode} items={xItems} minHeight={480} />
            </div>
            <div className={`rounded-2xl border border-gray-200 ${RING} bg-white p-4`}>
              <InstagramFeed limit={3} />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
