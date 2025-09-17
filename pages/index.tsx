// pages/index.tsx
import Head from "next/head";
import Link from "next/link";
import type { GetStaticProps, InferGetStaticPropsType } from "next";

import NewsFeed from "@/components/feeds/NewsFeed";
import NoteFeed from "@/components/feeds/NoteFeed";
import XTimeline from "@/components/feeds/XTimeline";
import InstagramFeed from "@/components/feeds/InstagramFeed";

import { fetchFeedByUrl, type NormalizedFeedItem } from "@/lib/feeds";
// Contentlayer: 型名が変わっても耐えるため総当りで取得
import * as CL from "contentlayer/generated";

/* ================================
   型
================================== */
type NewsItem  = { title: string; link: string; source: string; pubDate: string | null };
type NoteItem  = { title: string; link: string; pubDate: string | null; excerpt: string };
type XItem     = { title: string; link: string; pubDate: string | null };
type GuideItem = { href: string; title: string; exam?: string; description?: string };

/* ================================
   ユーティリティ
================================== */
// 重複除去（link 基準）
const uniqByLink = <T extends { link: string }>(arr: T[]): T[] => {
  const seen = new Set<string>();
  return arr.filter((x) => (x.link && !seen.has(x.link) ? (seen.add(x.link), true) : false));
};

// 正規化
const toNews = (a: NormalizedFeedItem[]): NewsItem[] =>
  a.map((it) => ({ title: it.title, link: it.link, source: it.source, pubDate: it.pubDate ?? null }));
const toNote = (a: NormalizedFeedItem[]): NoteItem[] =>
  a.map((it) => ({ title: it.title, link: it.link, pubDate: it.pubDate ?? null, excerpt: it.excerpt ?? "" }));
const toX = (a: NormalizedFeedItem[]): XItem[] =>
  a.map((it) => ({ title: it.title, link: it.link, pubDate: it.pubDate ?? null }));

// env をユニオン型へ安全に絞り込む
function toXMode(v?: string): "auto" | "widget" | "fallback" {
  return v === "widget" || v === "fallback" || v === "auto" ? v : "auto";
}

// Contentlayer の「全部の allXXX 配列」を総当りで集める
const collectAllDocs = (): any[] => {
  const arrays = Object.values(CL).filter(
    (v: unknown) => Array.isArray(v) && v.length > 0 && typeof (v as any)[0] === "object" && (v as any)[0]?._raw
  ) as any[][];
  return arrays.flat();
};

// 日付→number（降順ソート用）
const ts = (v: unknown): number => {
  if (typeof v === "string") {
    const n = Date.parse(v);
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
};

/* ================================
   ISR
================================== */
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

  // --- ガイド取得（型やスキーマ変更に強い総当りロジック） ---
  const allDocs = collectAllDocs();
  const guides: GuideItem[] = allDocs
    // guides/ 配下のみ（型名に依存しない）
    .filter((d: any) => d?._raw?.flattenedPath?.startsWith?.("guides/"))
    // draft を除外（未設定は published 扱い）
    .filter((d: any) => (d?.status ?? "published") !== "draft")
    // 更新順：frontmatter.updatedAt > computed.updatedAtAuto > date
    .sort((a: any, b: any) =>
      ts(b?.updatedAt ?? b?.updatedAtAuto ?? b?.date) - ts(a?.updatedAt ?? a?.updatedAtAuto ?? a?.date)
    )
    .slice(0, 9) // 上段3列×3行 = 9件
    .map((g: any) => ({
      href:
        g?.url ??
        (g?.exam
          ? `/guides/${g.exam}/${g.slug}`
          : `/guides/${g?.slug ?? ""}`),
      title: g?.title ?? "(no title)",
      exam: g?.exam,
      description: g?.description,
    }))
    .filter((g) => !!g.href && g.href !== "/guides/");

  return {
    props: { newsItems, noteItems, xItems, guides },
    revalidate: 1800, // 30分ISR
  };
};

/* ================================
   ページ
================================== */
export default function HomePage({
  newsItems,
  noteItems,
  xItems,
  guides,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  // 以前のアクセント・トーン（過去の調整色を反映）
  const ACCENT = "#A98D74";                // 見出し・マーカー用
  const RING   = "ring-1 ring-[#A98D74]/30";
  const xEmbedMode = toXMode(process.env.NEXT_PUBLIC_X_EMBED_MODE);

  return (
    <>
      <Head>
        <title>QC × IE LABO</title>
        <meta name="description" content="品質管理・経営工学の学習と実務に役立つガイドと最新情報" />
      </Head>

      <main className="mx-auto max-w-6xl px-4 py-8">
        {/* ヘッダー */}
        <section className="mb-6">
          <h1 className="text-2xl md:text-3xl font-extrabold" style={{ color: ACCENT }}>
            QC × IE LABO
          </h1>
          <p className="mt-2 text-gray-600">
            現場で使える品質管理・経営工学のガイドと最新情報を一箇所に。
          </p>
        </section>

        {/* ========== 上段：ガイド（3カラム） ========== */}
        {guides.length > 0 && (
          <section aria-labelledby="section-guides" className="mb-10">
            <div className="flex items-end justify-between mb-3">
              <h2 id="section-guides" className="text-xl font-bold" style={{ color: ACCENT }}>
                ガイド（新着）
              </h2>
              <Link
                href="/guides/qc"
                className="text-sm underline decoration-[#A98D74]/50 hover:decoration-[#A98D74]"
              >
                もっと見る
              </Link>
            </div>

            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {guides.map((g) => (
                <li key={g.href}>
                  <Link
                    href={g.href}
                    className={`block rounded-2xl border border-gray-200 ${RING} bg-white p-4 hover:shadow-sm transition`}
                    style={{ borderTop: `4px solid ${ACCENT}` }}
                  >
                    <div className="text-xs tracking-wide uppercase text-gray-500">
                      {g.exam ? g.exam : "guide"}
                    </div>
                    <div className="mt-1 font-semibold text-gray-900">{g.title}</div>
                    {g.description && (
                      <p className="mt-1 text-sm text-gray-600 line-clamp-2">{g.description}</p>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* ========== 下段：SNS（2カラム×2段想定） ========== */}
        <section aria-labelledby="section-social" className="space-y-6">
          <h2 id="section-social" className="sr-only">ソーシャル</h2>

          {/* 1段目：News / Note */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={`rounded-2xl border border-gray-200 ${RING} bg-white p-4`}>
              <NewsFeed limit={6} items={newsItems} />
            </div>
            <div className={`rounded-2xl border border-gray-200 ${RING} bg-white p-4`}>
              <NoteFeed limit={6} user="nieqc_0713" items={noteItems} />
            </div>
          </div>

          {/* 2段目：X / Instagram */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={`rounded-2xl border border-gray-200 ${RING} bg-white p-4`}>
              <XTimeline
                username="@n_ieqclab"
                limit={5}
                mode={xEmbedMode}
                items={xItems}
                minHeight={560}
                // 枠色微調整
                style={{ borderColor: `${ACCENT}33` }}
              />
            </div>
            <div className={`rounded-2xl border border-gray-200 ${RING} bg-white p-4`}>
              <InstagramFeed limit={4} />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
