import Head from "next/head";
import Link from "next/link";
import type { GetStaticProps, InferGetStaticPropsType } from "next";

import InstagramFeed from "@/components/feeds/InstagramFeed";
import NewsFeed from "@/components/feeds/NewsFeed";
import NoteFeed from "@/components/feeds/NoteFeed";
import XTimeline from "@/components/feeds/XTimeline";
import { contentIdeas, labTools, learningPillars, socialChannels } from "@/data/site";
import { fetchFeedByUrl, type NormalizedFeedItem } from "@/lib/feeds";
import * as CL from "contentlayer/generated";

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
  a.map((it) => ({ title: it.title, link: it.link, source: it.source, pubDate: it.pubDate ?? null }));

const toNote = (a: NormalizedFeedItem[]): NoteItem[] =>
  a.map((it) => ({ title: it.title, link: it.link, pubDate: it.pubDate ?? null, excerpt: it.excerpt ?? "" }));

const toX = (a: NormalizedFeedItem[]): XItem[] =>
  a.map((it) => ({ title: it.title, link: it.link, pubDate: it.pubDate ?? null }));

function toXMode(v?: string): "auto" | "widget" | "fallback" {
  return v === "widget" || v === "fallback" || v === "auto" ? v : "auto";
}

const ts = (v: unknown): number => {
  if (typeof v !== "string") return 0;
  const n = Date.parse(v);
  return Number.isFinite(n) ? n : 0;
};

const collectAllDocs = (): any[] => {
  const arrays = Object.values(CL).filter(
    (v: unknown) => Array.isArray(v) && v.length > 0 && typeof (v as any)[0] === "object" && (v as any)[0]?._raw
  ) as any[][];
  return arrays.flat();
};

const guideHref = (g: any): string => {
  if (typeof g?.url === "string" && g.url.startsWith("/guides/")) return g.url;
  const slug = String(g?.slug ?? g?._raw?.flattenedPath?.split("/")?.pop() ?? "").trim();
  const examRaw = String(g?.exam ?? g?._raw?.flattenedPath?.split("/")?.[1] ?? "").toLowerCase();
  const exam =
    examRaw === "qc"
      ? "qc"
      : examRaw === "stat" || examRaw === "stats"
      ? "stat"
      : examRaw === "engineer" || examRaw === "eng" || examRaw === "pe"
      ? "engineer"
      : "qc";
  return `/guides/${exam}/${slug}`;
};

export const getStaticProps: GetStaticProps<{
  newsItems: NewsItem[];
  noteItems: NoteItem[];
  xItems: XItem[];
  latestGuides: { href: string; title: string; exam?: string; description?: string }[];
}> = async () => {
  const NEWS_RSS_URL = process.env.NEWS_RSS_URL || "";
  const NOTE_RSS_URL = process.env.NOTE_RSS_URL || "https://note.com/nieqc_0713/rss";
  const X_RSS_URL = process.env.X_RSS_URL || "";

  const [newsRaw, noteRaw, xRaw] = await Promise.all([
    NEWS_RSS_URL ? fetchFeedByUrl(NEWS_RSS_URL, 6) : Promise.resolve<NormalizedFeedItem[]>([]),
    NOTE_RSS_URL ? fetchFeedByUrl(NOTE_RSS_URL, 6) : Promise.resolve<NormalizedFeedItem[]>([]),
    X_RSS_URL ? fetchFeedByUrl(X_RSS_URL, 5) : Promise.resolve<NormalizedFeedItem[]>([]),
  ]);

  const latestGuides = uniqBy(
    collectAllDocs()
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
  ).slice(0, 4);

  return {
    props: {
      newsItems: uniqBy(toNews(newsRaw), (it) => it.link).slice(0, 3),
      noteItems: uniqBy(toNote(noteRaw), (it) => it.link).slice(0, 3),
      xItems: uniqBy(toX(xRaw), (it) => it.link).slice(0, 3),
      latestGuides,
    },
    revalidate: 1800,
  };
};

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
        <title>QC × IE LABO | 品質管理・統計・技術士の学習拠点</title>
        <meta
          name="description"
          content="品質管理、統計、技術士を軸に、学習ガイド・シミュレーター・SNS発信・公的情報をまとめるQC × IE LABO。"
        />
      </Head>

      <main className="min-h-screen bg-[#f7f8f5] text-slate-900">
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-[1.2fr_.8fr] md:py-14">
            <div>
              <p className="text-sm font-semibold text-teal-700">Quality control as a career axis</p>
              <h1 className="mt-3 text-4xl font-extrabold leading-tight md:text-5xl">
                品質管理の考え方を、学習・実務・キャリアにつなげる場所。
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600">
                QC × IE LABO は、品質管理・統計・技術士を軸に、現場で使える知識と学び続けるための道筋をまとめるプラットフォームです。
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/guides" className="rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-700">
                  学習ガイドを見る
                </Link>
                <Link href="/tools/oc-simulator" className="rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 hover:border-teal-600">
                  シミュレーターを試す
                </Link>
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-[#eef6f1] p-5">
              <h2 className="text-sm font-bold text-slate-800">発信の軸</h2>
              <div className="mt-4 space-y-3">
                {["品質管理の考え方", "統計を使った判断", "技術士とキャリア形成", "勉強サポート"].map((item) => (
                  <div key={item} className="flex items-center gap-3 rounded-md bg-white px-3 py-3 text-sm font-medium text-slate-700">
                    <span className="h-2 w-2 rounded-full bg-teal-600" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-10">
          <div className="grid gap-4 md:grid-cols-3">
            {learningPillars.map((pillar) => (
              <Link key={pillar.key} href={pillar.href} className="rounded-lg border border-slate-200 bg-white p-5 hover:border-teal-500 hover:shadow-sm">
                <div className="text-xs font-semibold uppercase text-teal-700">{pillar.key}</div>
                <h2 className="mt-2 text-xl font-bold">{pillar.title}</h2>
                <p className="mt-3 min-h-20 text-sm leading-6 text-slate-600">{pillar.summary}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {pillar.topics.map((topic) => (
                    <span key={topic} className="rounded-md bg-slate-100 px-2.5 py-1 text-xs text-slate-600">
                      {topic}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="border-y border-slate-200 bg-white">
          <div className="mx-auto max-w-6xl px-4 py-10">
            <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-sm font-semibold text-teal-700">Interactive tools</p>
                <h2 className="text-2xl font-bold">考え方を手で動かして理解する</h2>
              </div>
              <Link href="/tools/control-chart" className="text-sm font-semibold text-teal-700 hover:text-teal-900">
                管理図ツールへ
              </Link>
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-4">
              {labTools.map((tool) => (
                <Link key={tool.href} href={tool.href} className="rounded-lg border border-slate-200 p-4 hover:border-teal-500">
                  <div className="text-xs font-semibold text-teal-700">{tool.status === "usable" ? "利用可" : "準備中"}</div>
                  <h3 className="mt-2 font-bold">{tool.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{tool.summary}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-6xl gap-6 px-4 py-10 lg:grid-cols-[.9fr_1.1fr]">
          <div>
            <p className="text-sm font-semibold text-teal-700">Social channels</p>
            <h2 className="text-2xl font-bold">SNSと役割を分けて運用する</h2>
            <div className="mt-5 space-y-3">
              {socialChannels.map((social) => (
                <a key={social.name} href={social.href} target="_blank" rel="noreferrer" className="block rounded-lg border border-slate-200 bg-white p-4 hover:border-teal-500">
                  <div className="flex items-center justify-between gap-3">
                    <div className="font-bold">{social.name}</div>
                    <div className="text-sm text-slate-500">@{social.handle}</div>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{social.purpose}</p>
                </a>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <h2 className="text-xl font-bold">発信アイデア</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              {contentIdeas.map((block) => (
                <div key={block.channel} className="rounded-lg bg-slate-50 p-4">
                  <h3 className="font-bold">{block.channel}</h3>
                  <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
                    {block.ideas.map((idea) => (
                      <li key={idea}>・{idea}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-12">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-lg border border-slate-200 bg-white p-5">
              <h2 className="text-xl font-bold">新着ガイド</h2>
              <div className="mt-4 grid gap-3">
                {latestGuides.length > 0 ? (
                  latestGuides.map((g) => (
                    <Link key={g.href} href={g.href} className="rounded-lg border border-slate-100 p-4 hover:border-teal-500">
                      <div className="text-xs font-semibold text-teal-700">{g.exam ? `#${g.exam}` : "#guide"}</div>
                      <div className="mt-1 font-bold">{g.title}</div>
                      {g.description ? <p className="mt-1 text-sm text-slate-600">{g.description}</p> : null}
                    </Link>
                  ))
                ) : (
                  <p className="text-slate-500">公開中のガイドはまだありません。</p>
                )}
              </div>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-5">
              <NoteFeed limit={3} user="nieqc_0713" items={noteItems} />
            </div>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            <div className="rounded-lg border border-slate-200 bg-white p-5 lg:col-span-1">
              <NewsFeed limit={3} items={newsItems} />
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-5">
              <XTimeline username="@n_ieqclab" limit={3} mode={xEmbedMode} items={xItems} minHeight={360} />
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-5">
              <InstagramFeed limit={3} />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
