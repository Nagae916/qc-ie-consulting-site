import type { GetStaticProps, InferGetStaticPropsType } from "next";
import Image from "next/image";
import Link from "next/link";
import { allGuides, type Guide } from "contentlayer/generated";

import { ContentCard } from "@/components/site/ContentCard";
import { SectionHeading } from "@/components/site/SectionHeading";
import { SiteMeta } from "@/components/site/SiteMeta";
import { caseStudies } from "@/data/cases";
import {
  contentTypeLabels,
  difficultyLabels,
  featuredGuideHrefs,
  homeCtas,
  homeToolHrefs,
  learningAreas,
  manufacturingQuestions,
  siteIdentity,
  themes,
  type ContentType,
  type Difficulty,
  type ThemeSlug,
} from "@/data/n-ie-lab";
import { labTools } from "@/data/site";
import { classifyContent } from "@/lib/content-classification";

type HomeGuide = {
  href: string;
  title: string;
  description: string;
  label: "注目記事" | "新着記事" | "最近更新";
  theme: string;
  contentType: string;
  difficulty: string;
  updatedAt: string;
  readingMinutes: number;
};

const themeLabels: Record<ThemeSlug, string> = {
  quality: "品質をつくる",
  production: "生産を整える",
  data: "データで確かめる",
  improvement: "改善を仕組みにする",
};

const processSteps = ["顧客要求", "製品設計", "工程設計", "生産", "検査・データ", "出荷・改善"] as const;

const getGuideHref = (guide: Guide) => {
  const url = (guide as { url?: unknown }).url;
  if (typeof url === "string" && url.startsWith("/guides/")) return url;
  const exam = String((guide as { exam?: unknown }).exam ?? "qc");
  const slug = String((guide as { slug?: unknown }).slug ?? guide._raw.flattenedPath.split("/").pop() ?? "");
  return `/guides/${exam}/${slug}`;
};

const getTimestamp = (guide: Guide) => {
  const values = guide as { updatedAtAuto?: unknown; updatedAt?: unknown; date?: unknown };
  const value = String(values.updatedAtAuto ?? values.updatedAt ?? values.date ?? "");
  const time = Date.parse(value);
  return Number.isFinite(time) ? time : 0;
};

const formatDate = (timestamp: number) => {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")}`;
};

const inferTheme = (guide: Guide): ThemeSlug => {
  const exam = String((guide as { exam?: unknown }).exam ?? "");
  const text = `${guide.title} ${String((guide as { slug?: unknown }).slug ?? "")} ${JSON.stringify((guide as { tags?: unknown }).tags ?? [])}`.toLowerCase();
  if (exam === "qc" || /quality|品質|qms|検査|fmea|工程能力/.test(text)) return "quality";
  if (exam === "stat" || /data|統計|回帰|検定|分布|分析/.test(text)) return "data";
  if (/改善|標準|pdca|kpi|監査|change|kaizen|教育|組織/.test(text)) return "improvement";
  return "production";
};

const inferContentType = (guide: Guide): ContentType => {
  const classification = classifyContent({ slug: String((guide as { slug?: unknown }).slug ?? "") });
  if (classification === "tool") return "tool";
  if (classification === "learning-route") return "learning";
  return "explanation";
};

const inferDifficulty = (guide: Guide): Difficulty => {
  const value = (guide as { difficulty?: unknown }).difficulty;
  if (value === "introductory" || value === "practical" || value === "advanced") return value;
  const classification = classifyContent({ slug: String((guide as { slug?: unknown }).slug ?? "") });
  return classification === "learning-route" ? "introductory" : "practical";
};

const toHomeGuide = (guide: Guide, label: HomeGuide["label"]): HomeGuide => {
  const values = guide as { description?: unknown; body?: { raw?: string } };
  const raw = values.body?.raw ?? "";
  const contentType = inferContentType(guide);
  const difficulty = inferDifficulty(guide);
  return {
    href: getGuideHref(guide),
    title: guide.title,
    description:
      typeof values.description === "string" && values.description.trim()
        ? values.description
        : "品質、生産、データ、改善の判断に使える考え方を整理します。",
    label,
    theme: themeLabels[inferTheme(guide)],
    contentType: contentTypeLabels[contentType],
    difficulty: difficultyLabels[difficulty],
    updatedAt: formatDate(getTimestamp(guide)),
    readingMinutes: Math.max(2, Math.ceil(raw.replace(/\s/g, "").length / 700)),
  };
};

export const getStaticProps: GetStaticProps<{ contentItems: HomeGuide[] }> = async () => {
  const published = allGuides.filter((guide) => (guide as { status?: unknown }).status !== "draft");
  const byHref = new Map(published.map((guide) => [getGuideHref(guide), guide]));
  const used = new Set<string>();

  const featured = featuredGuideHrefs
    .map((href) => byHref.get(href))
    .filter((guide): guide is Guide => !!guide)
    .slice(0, 2)
    .map((guide) => {
      used.add(getGuideHref(guide));
      return toHomeGuide(guide, "注目記事");
    });

  const remaining = published
    .filter((guide) => !used.has(getGuideHref(guide)))
    .sort((a, b) => getTimestamp(b) - getTimestamp(a));

  const newItems = remaining.slice(0, 2).map((guide) => {
    used.add(getGuideHref(guide));
    return toHomeGuide(guide, "新着記事");
  });
  const updatedItems = remaining
    .filter((guide) => !used.has(getGuideHref(guide)))
    .slice(0, 2)
    .map((guide) => toHomeGuide(guide, "最近更新"));

  return { props: { contentItems: [...featured, ...newItems, ...updatedItems] }, revalidate: 1800 };
};

export default function HomePage({ contentItems }: InferGetStaticPropsType<typeof getStaticProps>) {
  const selectedTools = homeToolHrefs
    .map((href) => labTools.find((tool) => tool.href === href))
    .filter((tool): tool is (typeof labTools)[number] => !!tool);

  return (
    <>
      <SiteMeta
        description="ものづくりは、仕組みが見えるともっと面白い。品質管理、生産管理、統計、改善を経営工学の視点から読み解く専門メディアです。"
        path="/"
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: siteIdentity.name,
            url: siteIdentity.siteUrl,
            description: siteIdentity.description,
          },
          {
            "@context": "https://schema.org",
            "@type": "Organization",
            name: siteIdentity.name,
            url: siteIdentity.siteUrl,
          },
        ]}
      />
      <main id="main-content" className="bg-slate-50 text-slate-900">
        <section className="relative flex h-[72svh] min-h-[520px] max-h-[680px] items-center overflow-hidden border-b border-slate-200 bg-white">
          <Image
            src="/images/home/n-ie-lab-manufacturing-hero.jpg"
            alt="製造現場で工程設備と品質データを確認する実務者"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[62%_center] md:object-center"
          />
          <div className="absolute inset-0 bg-white/80 md:bg-white/20" aria-hidden="true" />
          <div className="relative mx-auto w-full max-w-6xl px-4 py-12">
            <div className="max-w-2xl">
              <p className="text-sm font-bold uppercase text-teal-800">Quality · Production · Data · Improvement</p>
              <h1 className="mt-4 text-5xl font-black leading-none text-slate-950 md:text-7xl">{siteIdentity.name}</h1>
              <p className="mt-6 text-2xl font-black leading-tight text-slate-900 md:text-4xl">{siteIdentity.message}</p>
              <p className="mt-5 max-w-xl text-base leading-8 text-slate-700 md:text-lg">{siteIdentity.subMessage}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/themes" className="rounded-md bg-slate-950 px-5 py-3 text-sm font-bold text-white hover:bg-teal-800">テーマから読む</Link>
                <Link href="/cases" className="rounded-md border border-slate-500 bg-white/90 px-5 py-3 text-sm font-bold text-slate-900 hover:border-teal-600">ケースを見る</Link>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-12">
          <SectionHeading eyebrow="Questions" title="ものづくりの問いから始める" description="仕事の中の素朴な疑問には、複数の分野がつながっています。" />
          <div className="mt-7 grid gap-4 md:grid-cols-3">
            {manufacturingQuestions.map((item) => (
              <Link key={item.question} href={item.href} className="rounded-lg border border-slate-200 bg-white p-5 hover:border-teal-500">
                <h2 className="text-lg font-bold leading-7">{item.question}</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">{item.answerHint}</p>
                <span className="mt-5 inline-block text-sm font-bold text-teal-700">考え方を見る</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="border-y border-slate-200 bg-white">
          <div className="mx-auto max-w-6xl px-4 py-12">
            <SectionHeading eyebrow="Four perspectives" title="4つの視点" description="担当業務から入り、隣接する視点までつなげます。" />
            <div className="mt-7 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {themes.map((theme, index) => (
                <Link key={theme.slug} href={`/themes/${theme.slug}`} className="border-t-4 border-slate-300 p-4 hover:border-teal-600">
                  <span className="text-xs font-bold text-slate-500">0{index + 1}</span>
                  <h2 className="mt-2 text-xl font-bold">{theme.title}</h2>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{theme.description}</p>
                  <span className="mt-4 inline-block text-sm font-bold text-teal-700">テーマへ進む</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-12">
          <SectionHeading eyebrow="System view" title="製品が届くまでを、一つの仕組みとして見る" description="品質、生産、データ、改善は、同じ価値の流れの中で相互に影響します。" />
          <div className="mt-8" role="img" aria-label="顧客要求から製品設計、工程設計、生産、検査とデータ、出荷と改善へつながるものづくりの流れ">
            <ol className="grid gap-3 md:grid-cols-6">
              {processSteps.map((step, index) => (
                <li key={step} className="relative rounded-lg border border-slate-200 bg-white px-3 py-5 text-center text-sm font-bold text-slate-800">
                  <span className="mb-2 block text-xs text-teal-700">STEP {index + 1}</span>
                  {step}
                  {index < processSteps.length - 1 ? <span className="mt-3 block text-teal-600 md:absolute md:-right-3 md:top-1/2 md:z-10 md:mt-0 md:-translate-y-1/2" aria-hidden="true">→</span> : null}
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="border-y border-slate-200 bg-white">
          <div className="mx-auto max-w-6xl px-4 py-12">
            <SectionHeading eyebrow="Case studies" title="ケースから考える" description="制約のある実務課題を、情報収集、判断、成果物の順で読み解きます。" />
            <div className="mt-7 grid gap-5 md:grid-cols-2">
              {caseStudies.map((study) => (
                <ContentCard key={study.slug} href={`/cases/${study.slug}`} eyebrow="ケースから学ぶ" title={study.title} description={study.summary} meta="匿名化・再構成ケース" action="判断過程を見る" />
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-12">
          <SectionHeading eyebrow="Interactive tools" title="試して理解する" description="数値や条件を動かし、判断結果がどう変わるかを確かめます。" />
          <div className="mt-7 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {selectedTools.map((tool) => (
              <ContentCard key={tool.href} href={tool.href} eyebrow={tool.category} title={tool.title} description={tool.summary} meta="利用可能" action="使ってみる" />
            ))}
          </div>
          <Link href="/tools" className="mt-6 inline-block text-sm font-bold text-teal-700 underline decoration-teal-200 underline-offset-4">すべてのツールを見る</Link>
        </section>

        <section className="border-y border-slate-200 bg-white">
          <div className="mx-auto max-w-6xl px-4 py-12">
            <SectionHeading eyebrow="Library" title="注目・新着コンテンツ" description="実際のガイドから、注目、新着、最近更新した内容を6件に絞っています。" />
            <div className="mt-7 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {contentItems.map((item) => (
                <ContentCard
                  key={`${item.label}-${item.href}`}
                  href={item.href}
                  eyebrow={`${item.label} · ${item.theme}`}
                  title={item.title}
                  description={item.description}
                  meta={[item.contentType, item.difficulty, item.updatedAt, `約${item.readingMinutes}分`].filter(Boolean).join(" · ")}
                  action="読む"
                />
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-12">
          <SectionHeading eyebrow="Deepen learning" title="学びを深める" description="体系的な学習や資格試験を通じて、ものづくりへの理解をさらに深めます。" />
          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {learningAreas.map((area) => (
              <Link key={area.title} href={area.href} className="rounded-lg border border-slate-200 bg-white p-4 hover:border-teal-500">
                <h2 className="font-bold">{area.title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">{area.description}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="border-y border-slate-200 bg-slate-950 text-white">
          <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-[1.2fr_.8fr] md:items-center">
            <div>
              <p className="text-xs font-bold uppercase text-teal-300">About N-IE Lab</p>
              <h2 className="mt-3 text-3xl font-bold">知識を、判断と成果物へ変える</h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
                経営工学を中心に品質・生産・統計を扱い、製造業の実務と資格学習を接続します。複雑な課題を図解、ケース、チェックリスト、ツールとして残します。
              </p>
            </div>
            <div className="flex flex-wrap gap-3 md:justify-end">
              <Link href="/about" className="rounded-md bg-white px-5 py-3 text-sm font-bold text-slate-950 hover:bg-teal-50">N-IE Labについて</Link>
              <Link href="/services" className="rounded-md border border-slate-500 px-5 py-3 text-sm font-bold text-white hover:border-teal-300">相談できる内容</Link>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-12">
          <SectionHeading title="次に進む" description="目的に近い入口を一つ選んでください。" />
          <div className="mt-7 grid gap-5 md:grid-cols-3">
            {homeCtas.map((cta) => (
              <ContentCard key={cta.href} href={cta.href} title={cta.title} description={cta.description} action="開く" />
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
