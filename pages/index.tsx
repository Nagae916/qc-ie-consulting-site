import Head from "next/head";
import Link from "next/link";
import type { GetStaticProps, InferGetStaticPropsType } from "next";

import InstagramFeed from "@/components/feeds/InstagramFeed";
import NoteFeed from "@/components/feeds/NoteFeed";
import { socialChannels } from "@/data/site";
import { fetchFeedByUrl, type NormalizedFeedItem } from "@/lib/feeds";

type NoteItem = { title: string; link: string; pubDate: string | null; excerpt: string };
type XItem = { title: string; link: string; pubDate: string | null };

const pillars = [
  {
    title: "QC・品質管理",
    description: "品質保証、品質改善、QMS、QC検定、管理図、工程能力、実験計画法などを学びます。",
    href: "/guides/qc",
    className: "border-orange-200 bg-orange-50",
  },
  {
    title: "統計・データ分析",
    description: "記述統計、確率分布、推定、検定、回帰分析、分散分析などを、品質管理や生産管理を支える数理基盤として学びます。",
    href: "/guides/stat",
    className: "border-blue-200 bg-blue-50",
  },
  {
    title: "技術士 経営工学部門",
    description: "過去問分析、設問形式、重要キーワード、答案骨子、問題演習を通じて、技術士第二次試験に向けた学習を進めます。",
    href: "/guides/engineer",
    className: "border-emerald-200 bg-emerald-50",
  },
  {
    title: "生産管理",
    description: "生産計画、工程管理、在庫管理、IE、設備効率、SCM、物流管理を、経営工学の中核領域として学びます。",
    href: "/guides/production",
    className: "border-sky-200 bg-sky-50",
  },
];

const values = [
  {
    title: "分かりやすさ",
    description: "専門用語を単に並べるのではなく、図解・具体例・比較で理解しやすく整理します。",
  },
  {
    title: "情報の質と根拠",
    description: "過去問データ、白書、品質管理・統計・生産管理の体系に基づいて、学習に使える情報へ整理します。",
  },
  {
    title: "使いやすい学習導線",
    description: "トップでは4本柱を示し、詳細は各カテゴリページで段階的に深掘りできるようにします。",
  },
  {
    title: "試験と実務への接続",
    description: "QC検定、統計学習、技術士試験だけでなく、現場の品質改善・生産管理・QMS改善にもつながる理解を重視します。",
  },
];

const studySteps = [
  "4本柱から学びたい領域を選ぶ",
  "ガイドで全体像をつかむ",
  "キーワードや図解で理解を深める",
  "問題・答案・実務視点で使える形にする",
];

const uniqBy = <T, K extends string | number>(items: T[], key: (_item: T) => K) => {
  const seen = new Set<K>();
  return items.filter((item) => {
    const value = key(item);
    if (seen.has(value)) return false;
    seen.add(value);
    return true;
  });
};

const toNote = (items: NormalizedFeedItem[]): NoteItem[] =>
  items.map((item) => ({
    title: item.title,
    link: item.link,
    pubDate: item.pubDate ?? null,
    excerpt: item.excerpt ?? "",
  }));

const toX = (items: NormalizedFeedItem[]): XItem[] =>
  items.map((item) => ({ title: item.title, link: item.link, pubDate: item.pubDate ?? null }));

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
  noteItems: NoteItem[];
  xItems: XItem[];
}> = async () => {
  const NOTE_RSS_URL = process.env.NOTE_RSS_URL || "https://note.com/nieqc_0713/rss";
  const X_RSS_URL = process.env.X_RSS_URL || "";

  const [noteRaw, xRaw] = await Promise.all([
    NOTE_RSS_URL ? fetchFeedByUrl(NOTE_RSS_URL, 6) : Promise.resolve<NormalizedFeedItem[]>([]),
    X_RSS_URL ? fetchFeedByUrl(X_RSS_URL, 5) : Promise.resolve<NormalizedFeedItem[]>([]),
  ]);

  return {
    props: {
      noteItems: uniqBy(toNote(noteRaw), (item) => item.link).slice(0, 3),
      xItems: uniqBy(toX(xRaw), (item) => item.link).slice(0, 3),
    },
    revalidate: 1800,
  };
};

export default function HomePage({ noteItems, xItems }: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <Head>
        <title>n-ie-qclab | 経営工学を試験対策と現場改善につなげる</title>
        <meta
          name="description"
          content="n-ie-qclabは、経営工学を中心にQC・品質管理、統計・データ分析、技術士 経営工学部門、生産管理をつなぐ学習サイトです。"
        />
      </Head>

      <main className="min-h-screen bg-[#f7f8f5] text-slate-900">
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-6xl px-4 py-14 md:py-20">
            <p className="text-sm font-semibold tracking-[0.18em] text-teal-700">n-ie-qclab</p>
            <h1 className="mt-4 max-w-4xl text-4xl font-black leading-tight md:text-6xl">
              経営工学を、
              <span className="block text-teal-700">試験対策と現場改善につなげる。</span>
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-slate-600">
              n-ie-qclab は、QC・統計・技術士・生産管理を、経営工学の視点で整理する学習サイトです。
              知識を読むだけでなく、図解・キーワード・答案骨子・実務視点を通じて、使える理解へつなげます。
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/guides" className="rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-700">
                ガイドを見る
              </Link>
              <a
                href="https://note.com/nieqc_0713"
                target="_blank"
                rel="noreferrer"
                className="rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 hover:border-teal-600"
              >
                noteを読む
              </a>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-12">
          <SectionTitle title="このサイトで大切にしていること" description="経営工学を、知識の整理で終わらせず、試験対策と実務改善に使える形へつなげます。" />
          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <div key={value.title} className="rounded-xl border border-slate-200 bg-white p-5">
                <h2 className="font-bold">{value.title}</h2>
                <p className="mt-2 text-sm leading-7 text-slate-600">{value.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="border-y border-slate-200 bg-white">
          <div className="mx-auto max-w-6xl px-4 py-12">
            <SectionTitle title="経営工学を4本柱で学ぶ" description="最初は大きな領域を選び、そこから必要なガイドへ進みます。" />
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {pillars.map((pillar) => (
                <Link key={pillar.href} href={pillar.href} className={`rounded-xl border p-5 hover:shadow-sm ${pillar.className}`}>
                  <h2 className="font-bold">{pillar.title}</h2>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{pillar.description}</p>
                  <span className="mt-4 inline-block text-sm font-semibold text-teal-700">この領域から始める</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-12">
          <SectionTitle title="学び方はシンプルです" description="詳細ページを探し回る前に、まずは領域、全体像、キーワード、演習の順に進めます。" />
          <ol className="mt-6 grid gap-4 md:grid-cols-4">
            {studySteps.map((step, index) => (
              <li key={step} className="rounded-xl border border-slate-200 bg-white p-5">
                <div className="text-xs font-bold text-teal-700">STEP {index + 1}</div>
                <p className="mt-2 text-sm font-semibold leading-7">{step}</p>
              </li>
            ))}
          </ol>
          <div className="mt-6 rounded-xl border border-slate-200 bg-white p-5">
            <p className="text-sm leading-7 text-slate-600">
              迷ったら、まずはガイド一覧から始めてください。QC、統計、技術士、生産管理の入口を分けているので、今の目的に近い領域から学べます。
            </p>
            <Link href="/guides" className="mt-4 inline-block rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-700">
              ガイド一覧へ
            </Link>
          </div>
        </section>

        <section className="border-y border-slate-200 bg-white">
          <div className="mx-auto max-w-6xl px-4 py-12">
            <SectionTitle title="SNS・noteでも発信しています" description="SNSで触れた内容を、サイト側で体系的な学習コンテンツへ整理していきます。" />
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {socialChannels.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group rounded-xl border border-slate-200 bg-white p-5 hover:border-teal-500 hover:shadow-sm"
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
                  <p className="mt-4 text-sm leading-7 text-slate-600">{social.purpose}</p>
                  <div className="mt-4 text-sm font-semibold text-teal-700 group-hover:text-teal-900">公式ページを開く</div>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-12">
          <SectionTitle title="最近の発信" description="noteでは、試験対策や品質管理・経営工学に関する考察を発信しています。" />
          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_.9fr]">
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <NoteFeed limit={3} user="nieqc_0713" items={noteItems} />
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <div className="mb-4">
                <p className="text-xs font-semibold text-teal-700">Instagram</p>
                <h2 className="font-bold">学習カードを見る</h2>
              </div>
              <InstagramFeed limit={3} />
            </div>
          </div>
          {xItems.length > 0 ? (
            <div className="mt-6 rounded-xl border border-slate-200 bg-white p-5">
              <p className="text-xs font-semibold text-teal-700">X</p>
              <h2 className="font-bold">更新・気づきを追う</h2>
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                {xItems.map((item) => (
                  <a key={item.link} href={item.link} target="_blank" rel="noreferrer" className="rounded-lg border border-slate-100 p-4 hover:border-teal-500">
                    <div className="line-clamp-3 text-sm font-semibold leading-6">{cleanPostTitle(item.title) || "投稿を読む"}</div>
                    {item.pubDate ? <div className="mt-2 text-xs text-slate-500">{formatDate(item.pubDate)}</div> : null}
                  </a>
                ))}
              </div>
            </div>
          ) : null}
        </section>
      </main>
    </>
  );
}

function SectionTitle({ title, description }: { title: string; description: string }) {
  return (
    <div>
      <h2 className="text-2xl font-bold">{title}</h2>
      <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">{description}</p>
    </div>
  );
}
