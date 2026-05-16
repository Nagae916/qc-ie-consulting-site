import Head from "next/head";
import Link from "next/link";
import type { GetStaticProps, InferGetStaticPropsType } from "next";

import * as CL from "contentlayer/generated";
import { isGuideContent } from "@/lib/content-classification";

type Pillar = {
  title: string;
  description: string;
  href: string;
  className: string;
};

type RecentGuide = {
  title: string;
  description: string;
  href: string;
  category: string;
};

type GuideLike = {
  title?: unknown;
  description?: unknown;
  exam?: unknown;
  slug?: unknown;
  status?: unknown;
  updatedAt?: unknown;
  date?: unknown;
  publishedAt?: unknown;
  _raw?: { flattenedPath?: string };
};

const pillars: Pillar[] = [
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

const purposeLinks = [
  {
    title: "QC検定・品質管理を学びたい",
    description: "品質改善やQMS、QC検定に必要な基礎から確認します。",
    href: "/guides/qc",
  },
  {
    title: "統計を基礎から学びたい",
    description: "記述統計、検定、回帰分析などを段階的に学びます。",
    href: "/guides/stat",
  },
  {
    title: "技術士二次試験の答案力を上げたい",
    description: "過去問、設問形式、キーワード、答案骨子をつなげて学びます。",
    href: "/guides/engineer",
  },
  {
    title: "生産管理を体系的に学びたい",
    description: "生産計画、工程管理、在庫管理、SCM、物流管理の入口です。",
    href: "/guides/production",
  },
  {
    title: "実務改善に使える知識を整理したい",
    description: "まず4本柱から近い領域を選び、必要な知識へ進みます。",
    href: "/guides",
  },
];

const categoryLabels: Record<string, string> = {
  qc: "QC・品質管理",
  stat: "統計・データ分析",
  engineer: "技術士 経営工学部門",
};

const collectDocs = (): GuideLike[] => {
  const arrays = Object.values(CL).filter((value: unknown) => {
    if (!Array.isArray(value) || value.length === 0) return false;
    const first = value[0] as { _raw?: unknown } | undefined;
    return typeof first === "object" && !!first?._raw;
  }) as GuideLike[][];
  return arrays.flat();
};

const getGuideTime = (guide: GuideLike) => {
  const rawDate = guide.updatedAt ?? guide.date ?? guide.publishedAt;
  if (typeof rawDate !== "string") return 0;
  const time = new Date(rawDate).getTime();
  return Number.isFinite(time) ? time : 0;
};

const toRecentGuide = (guide: GuideLike): RecentGuide | null => {
  const title = typeof guide.title === "string" ? guide.title : "";
  const description = typeof guide.description === "string" ? guide.description : "";
  const exam = typeof guide.exam === "string" ? guide.exam : "";
  const slug = typeof guide.slug === "string" ? guide.slug : "";
  if (!title || !slug || !["qc", "stat", "engineer"].includes(exam)) return null;
  if (!isGuideContent({ slug })) return null;
  return {
    title,
    description,
    href: `/guides/${exam}/${slug}`,
    category: categoryLabels[exam] ?? "ガイド",
  };
};

export const getStaticProps: GetStaticProps<{ recentGuides: RecentGuide[] }> = async () => {
  const recentGuides = collectDocs()
    .filter((guide) => guide.status !== "draft")
    .sort((a, b) => getGuideTime(b) - getGuideTime(a))
    .map(toRecentGuide)
    .filter((guide): guide is RecentGuide => guide !== null)
    .slice(0, 6);

  return { props: { recentGuides }, revalidate: 1800 };
};

export default function GuidesIndexPage({ recentGuides }: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <Head>
        <title>ガイド | n-ie-qclab</title>
        <meta
          name="description"
          content="n-ie-qclabの学習ホームです。経営工学を中心に、QC・品質管理、統計・データ分析、技術士 経営工学部門、生産管理の4本柱から学習を始められます。"
        />
      </Head>

      <main className="min-h-screen bg-[#f7f8f5] text-slate-900">
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
            <p className="text-sm font-semibold tracking-[0.18em] text-teal-700">GUIDES</p>
            <h1 className="mt-3 text-4xl font-black md:text-5xl">学びたい領域から選ぶ</h1>
            <p className="mt-4 max-w-3xl leading-8 text-slate-600">
              n-ie-qclab では、経営工学を中心に、QC・品質管理、統計・データ分析、技術士 経営工学部門、生産管理の4本柱で学習できます。
              まずは目的に合う領域を選び、各ガイドで全体像から深掘りしていきます。
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-10">
          <SectionTitle title="経営工学を4本柱で学ぶ" description="最初は1つの柱を選びます。関連分野は下位ページで必要に応じてつなげます。" />
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {pillars.map((pillar) => (
              <Link key={pillar.href} href={pillar.href} className={`rounded-xl border p-5 hover:shadow-sm ${pillar.className}`}>
                <h2 className="text-xl font-bold">{pillar.title}</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">{pillar.description}</p>
                <span className="mt-4 inline-block text-sm font-semibold text-teal-700">この領域へ進む</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="border-y border-slate-200 bg-white">
          <div className="mx-auto max-w-6xl px-4 py-10">
            <SectionTitle title="目的から選ぶ" description="やりたいことが決まっている場合は、目的に近い入口から始めます。" />
            <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
              {purposeLinks.map((item) => (
                <Link key={item.title} href={item.href} className="rounded-xl border border-slate-200 bg-white p-5 hover:border-teal-500 hover:shadow-sm">
                  <h2 className="font-bold">{item.title}</h2>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{item.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-10">
          <SectionTitle title="4本柱はつながっています" description="入口は分けますが、実務や試験では互いに接続して使います。" />
          <div className="mt-6 rounded-xl border border-slate-200 bg-white p-5">
            <p className="text-sm leading-7 text-slate-600">
              QC・統計・生産管理は、いずれも経営工学を支える重要領域です。技術士 経営工学部門では、これらの知識を過去問・キーワード・答案骨子へ接続して学習します。
              最初の階層では4本柱を混ぜすぎず、各柱の入口から順に進めます。
            </p>
          </div>
        </section>

        {recentGuides.length > 0 ? (
          <section className="border-t border-slate-200 bg-white">
            <div className="mx-auto max-w-6xl px-4 py-10">
              <SectionTitle title="最近追加されたコンテンツ" description="最近追加されたガイドを少しだけ表示します。体系的に探す場合は、4本柱の入口から進んでください。" />
              <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {recentGuides.map((guide) => (
                  <Link key={guide.href} href={guide.href} className="rounded-xl border border-slate-200 bg-white p-5 hover:border-teal-500 hover:shadow-sm">
                    <div className="text-xs font-semibold text-teal-700">{guide.category}</div>
                    <h2 className="mt-2 font-bold">{guide.title}</h2>
                    {guide.description ? <p className="mt-2 text-sm leading-7 text-slate-600">{guide.description}</p> : null}
                  </Link>
                ))}
              </div>
            </div>
          </section>
        ) : null}
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
