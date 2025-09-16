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

// 型
type NewsItem  = { title: string; link: string; source: string; pubDate: string | null };
type NoteItem  = { title: string; link: string; pubDate: string | null; excerpt: string };
type XItem     = { title: string; link: string; pubDate: string | null };
type GuideItem = { href: string; title: string; exam?: string };

// ユーティリティ
function toXMode(v?: string): "auto" | "widget" | "fallback" {
  return v === "widget" || v === "fallback" || v === "auto" ? v : "auto";
}
function ts(v: unknown): number {
  if (typeof v === "string") {
    const n = Date.parse(v);
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
}
function uniqByLink<T extends { link: string }>(arr: T[]): T[] {
  const m = new Map<string, T>();
  for (const it of arr) {
    if (it.link && !m.has(it.link)) m.set(it.link, it);
  }
  return Array.from(m.values());
}

// Contentlayer の「allXXX 配列」を総当りで収集（パーサ相性を避けるために素朴に書く）
function collectAllDocs(): any[] {
  const out: any[] = [];
  for (const v of Object.values(CL) as unknown[]) {
    if (Array.isArray(v) && v.length > 0 && typeof v[0] === "object" && (v[0] as any)._raw) {
      for (const item of v as any[]) out.push(item);
    }
  }
  return out;
}

// 正規化
const toNews = (a: NormalizedFeedItem[]): NewsItem[] =>
  a.map((it) => ({ title: it.title, link: it.link, source: it.source, pubDate: it.pubDate ?? null }));

const toNote = (a: NormalizedFeedItem[]): NoteItem[] =>
  a.map((it) => ({ title: it.title, link: it.link, pubDate: it.pubDate ?? null, excerpt: it.excerpt ?? "" }));

const toX = (a: NormalizedFeedItem[]): XItem[] =>
  a.map((it) => ({ title: it.title, link: it.link, pubDate: it.pubDate ?? null }));

export const getStaticProps: GetStaticProps<{
  newsItems: NewsItem[];
  noteItems: NoteItem[];
  xItems: XItem[];
  guides: GuideItem[];
}> = async () => {
  const NEWS_RSS_URL = process.env.NEWS_RSS_URL || "";
  const NOTE_RSS_URL = process.env.NOTE_RSS_URL || "";
  const X_RSS_URL = process.env.X_RSS_URL || "";

  const [newsRaw, noteRaw, xRaw] = await Promise.all([
    NEWS_RSS_URL ? fetchFeedByUrl(NEWS_RSS_URL, 6) : Promise.resolve<NormalizedFeedItem[]>([]),
    NOTE_RSS_URL ? fetchFeedByUrl(NOTE_RSS_URL, 6) : Promise.resolve<NormalizedFeedItem[]>([]),
    X_RSS_URL ? fetchFeedByUrl(X_RSS_URL, 5) : Promise.resolve<NormalizedFeedItem[]>([]),
  ]);

  const newsItems = uniqByLink(toNews(newsRaw)).slice(0, 6);
  const noteItems = uniqByLink(toNote(noteRaw)).slice(0, 6);
  const xItems = uniqByLink(toX(xRaw)).slice(0, 5);

  // ガイド
  const docs = collectAllDocs();
  const guides: GuideItem[] = docs
    .filter((d: any) => {
      const fp = d && d._raw && d._raw.flattenedPath;
      return typeof fp === "string" && fp.indexOf("guides/") === 0;
    })
    .filter((d: any) => (d && d.status ? d.status : "published") !== "draft")
    .sort((a: any, b: any) => {
      const tb = ts(b && (b.updatedAtAuto || b.updatedAt || b.date));
      const ta = ts(a && (a.updatedAtAuto || a.updatedAt || a.date));
      return tb - ta;
    })
    .slice(0, 6)
    .map((g: any) => {
      const href = g && g.url ? g.url : "";
      const title = g && g.title ? g.title : "(no title)";
      const exam = g && g.exam ? g.exam : undefined;
      return { href, title, exam };
    })
    .filter((g) => !!g.href && g.href !== "/guides/");

  return { props: { newsItems, noteItems, xItems, guides }, revalidate: 1800 };
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
        <meta
          name="description"
          content="品質管理・経営工学の学習と実務に役立つガイドと最新情報"
        />
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
                    <li
                      key={g.href}
                      className="rounded-2xl border border-gray-200 p-4 hover:shadow-sm"
                    >
                      <Link href={g.href} className="block">
                        <div className="text-sm text-gray-500">
                          {g.exam ? `#${g.exam}` : ""}
                        </div>
                        <div className="mt-1 font-semibold">{g.title}</div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          <aside className="space-y-6">
            <NewsFeed limit={6} items={newsItems} />
            <NoteFeed limit={6} user="nieqc_0713" items={noteItems} />
            <XTimeline
              username="@n_ieqclab"
              limit={5}
              mode={xEmbedMode}
              items={xItems}
              minHeight={600}
            />
            <InstagramFeed limit={3} />
          </aside>
        </div>
      </main>
    </>
  );
}
