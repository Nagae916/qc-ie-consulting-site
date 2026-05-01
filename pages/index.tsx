import Head from "next/head";
import Link from "next/link";
import type { GetStaticProps, InferGetStaticPropsType } from "next";

import InstagramFeed from "@/components/feeds/InstagramFeed";
import NewsFeed from "@/components/feeds/NewsFeed";
import NoteFeed from "@/components/feeds/NoteFeed";
import { labTools, learningPillars, socialChannels } from "@/data/site";
import { fetchFeedByUrl, type NormalizedFeedItem } from "@/lib/feeds";

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

const formatDate = (value: string | null) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
};

const cleanPostTitle = (title: string) =>
  title
    .replace(/https?:\/\/\S+/g, "")
    .replace(/^RT by @[^:]+:\s*/i, "")
    .trim();

export const getStaticProps: GetStaticProps<{
  newsItems: NewsItem[];
  noteItems: NoteItem[];
  xItems: XItem[];
}> = async () => {
  const NEWS_RSS_URL = process.env.NEWS_RSS_URL || "";
  const NOTE_RSS_URL = process.env.NOTE_RSS_URL || "https://note.com/nieqc_0713/rss";
  const X_RSS_URL = process.env.X_RSS_URL || "";

  const [newsRaw, noteRaw, xRaw] = await Promise.all([
    NEWS_RSS_URL ? fetchFeedByUrl(NEWS_RSS_URL, 6) : Promise.resolve<NormalizedFeedItem[]>([]),
    NOTE_RSS_URL ? fetchFeedByUrl(NOTE_RSS_URL, 6) : Promise.resolve<NormalizedFeedItem[]>([]),
    X_RSS_URL ? fetchFeedByUrl(X_RSS_URL, 5) : Promise.resolve<NormalizedFeedItem[]>([]),
  ]);

  return {
    props: {
      newsItems: uniqBy(toNews(newsRaw), (it) => it.link).slice(0, 3),
      noteItems: uniqBy(toNote(noteRaw), (it) => it.link).slice(0, 3),
      xItems: uniqBy(toX(xRaw), (it) => it.link).slice(0, 3),
    },
    revalidate: 1800,
  };
};

export default function HomePage({
  newsItems,
  noteItems,
  xItems,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <Head>
        <title>QC × IE LABO | 品質管理・統計・技術士</title>
        <meta
          name="description"
          content="品質管理・統計・技術士を、ガイド・シミュレーター・最新情報で学ぶQC × IE LABO。"
        />
      </Head>

      <main className="min-h-screen bg-[#f7f8f5] text-slate-900">
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-[1.15fr_.85fr] md:py-16">
            <div>
              <p className="text-sm font-semibold tracking-[0.18em] text-teal-700">QC × IE LABO</p>
              <h1 className="mt-4 max-w-3xl text-4xl font-black leading-tight md:text-6xl">
                品質管理を、
                <span className="block text-teal-700">学びとキャリアの軸に。</span>
              </h1>
              <p className="mt-5 max-w-2xl leading-8 text-slate-600">
                初学者にも実務者にも使いやすいガイドと、数値を動かして理解するシミュレーターをまとめています。
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/guides" className="rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-700">
                  ガイドを見る
                </Link>
                <Link href="/tools" className="rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 hover:border-teal-600">
                  シミュレーターを見る
                </Link>
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-[#eef6f1] p-5">
              <h2 className="text-base font-bold">学習の入口</h2>
              <div className="mt-4 space-y-3">
                {learningPillars.map((pillar) => (
                  <Link key={pillar.key} href={pillar.href} className="block rounded-lg bg-white p-4 hover:ring-1 hover:ring-teal-500">
                    <div className="font-bold">{pillar.title}</div>
                    <p className="mt-1 text-sm leading-6 text-slate-600">{pillar.summary}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-10">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-teal-700">Simulators</p>
              <h2 className="text-2xl font-bold">数値を動かして概念をつかむ</h2>
            </div>
            <Link href="/tools" className="text-sm font-semibold text-teal-700 hover:text-teal-900">
              一覧へ
            </Link>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {labTools.slice(0, 3).map((tool) => (
              <Link key={tool.href} href={tool.href} className="rounded-lg border border-slate-200 bg-white p-5 hover:border-teal-500">
                <div className="text-xs font-semibold text-teal-700">{tool.category}</div>
                <h3 className="mt-2 font-bold">{tool.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{tool.summary}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="border-y border-slate-200 bg-white">
          <div className="mx-auto max-w-6xl px-4 py-10">
            <p className="text-sm font-semibold text-teal-700">Catch up</p>
            <h2 className="text-2xl font-bold">最新情報</h2>
            <div className="mt-5 grid gap-6 lg:grid-cols-2">
              <div className="rounded-lg border border-slate-200 p-5">
                <NewsFeed limit={3} items={newsItems} />
              </div>
              <div className="rounded-lg border border-slate-200 p-5">
                <NoteFeed limit={3} user="nieqc_0713" items={noteItems} />
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-10">
          <p className="text-sm font-semibold text-teal-700">Social</p>
          <h2 className="text-2xl font-bold">SNSの最新投稿</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {socialChannels.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                className="group rounded-lg border border-slate-200 bg-white p-5 hover:border-teal-500 hover:shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="grid h-11 w-11 place-items-center rounded-lg bg-slate-900 text-sm font-black text-white">
                    {social.name === "Instagram" ? "IG" : social.name === "note" ? "N" : "X"}
                  </div>
                  <div>
                    <div className="font-bold">{social.name}</div>
                    <div className="text-sm text-slate-500">@{social.handle}</div>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-6 text-slate-600">{social.purpose}</p>
                <div className="mt-4 text-sm font-semibold text-teal-700 group-hover:text-teal-900">公式ページを見る</div>
              </a>
            ))}
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1fr]">
            <div className="rounded-lg border border-slate-200 bg-white p-5">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-teal-700">note</p>
                  <h3 className="font-bold">考え方・経験を読む</h3>
                </div>
                <a href="https://note.com/nieqc_0713" target="_blank" rel="noreferrer" className="text-sm font-semibold text-teal-700">
                  noteへ
                </a>
              </div>
              <div className="grid gap-3">
                {noteItems.length > 0 ? (
                  noteItems.map((item) => (
                    <a key={item.link} href={item.link} target="_blank" rel="noreferrer" className="rounded-lg border border-slate-100 p-4 hover:border-teal-500">
                      <div className="flex gap-3">
                        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-[#41c9b4] text-xs font-black text-white">note</div>
                        <div>
                          <div className="font-semibold leading-6">{item.title}</div>
                          {item.pubDate ? <div className="mt-1 text-xs text-slate-500">{formatDate(item.pubDate)}</div> : null}
                        </div>
                      </div>
                    </a>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">noteの最新記事を取得できませんでした。</p>
                )}
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-5">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-teal-700">X</p>
                  <h3 className="font-bold">更新・気づきを追う</h3>
                </div>
                <a href="https://twitter.com/n_ieqclab" target="_blank" rel="noreferrer" className="text-sm font-semibold text-teal-700">
                  Xへ
                </a>
              </div>
              <div className="grid gap-3">
                {xItems.length > 0 ? (
                  xItems.map((item) => (
                    <a key={item.link} href={item.link} target="_blank" rel="noreferrer" className="rounded-lg border border-slate-100 p-4 hover:border-teal-500">
                      <div className="flex gap-3">
                        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-slate-900 text-sm font-black text-white">X</div>
                        <div>
                          <div className="line-clamp-3 font-semibold leading-6">{cleanPostTitle(item.title) || "投稿を読む"}</div>
                          {item.pubDate ? <div className="mt-1 text-xs text-slate-500">{formatDate(item.pubDate)}</div> : null}
                        </div>
                      </div>
                    </a>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">Xの最新投稿を取得できませんでした。</p>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-lg border border-slate-200 bg-white p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-teal-700">Instagram</p>
                <h3 className="font-bold">図解・短い学習メモを見る</h3>
              </div>
              <a href="https://www.instagram.com/n.ieqclab" target="_blank" rel="noreferrer" className="text-sm font-semibold text-teal-700">
                Instagramへ
              </a>
            </div>
            <InstagramFeed limit={3} />
          </div>
        </section>
      </main>
    </>
  );
}
