import type { GetStaticProps, InferGetStaticPropsType } from "next";
import Image from "next/image";
import Link from "next/link";
import { allGuides, type Guide } from "contentlayer/generated";

import { ContentCard } from "@/components/site/ContentCard";
import { SectionHeading } from "@/components/site/SectionHeading";
import { SiteMeta } from "@/components/site/SiteMeta";
import {
  contentTypeLabels,
  difficultyLabels,
  featuredGuideHrefs,
  homeLearningGuides,
  siteIdentity,
  supportingInformationAreas,
  themes,
  type ContentType,
  type Difficulty,
  type ThemeSlug,
} from "@/data/n-ie-lab";
import { featuredExternalArticles, socialChannels } from "@/data/site";
import { classifyContent } from "@/lib/content-classification";
import { isPublishedGuideStatus } from "@/lib/frontmatter-normalization";

type HomeGuide = {
  href: string;
  title: string;
  description: string;
  label: "注目記事" | "新着記事";
  theme: string;
  contentType: string;
  difficulty: string;
  updatedAt: string;
  readingMinutes: number;
};

const themeLabels: Record<ThemeSlug, string> = {
  quality: "品質マネジメント",
  production: "生産管理",
  data: "データマネジメント",
  improvement: "改善マネジメント",
};

const getGuideHref = (guide: Guide) => {
  const url = (guide as { url?: unknown }).url;
  if (typeof url === "string" && url.startsWith("/guides/")) return url;
  const exam = String((guide as { exam?: unknown }).exam ?? "qc");
  const slug = String((guide as { slug?: unknown }).slug ?? guide._raw.flattenedPath.split("/").pop() ?? "");
  return `/guides/${exam}/${slug}`;
};

const getTimestamp = (guide: Guide) => {
  const values = guide as { updatedAtAuto?: unknown; updatedAt?: unknown; date?: unknown };
  const time = Date.parse(String(values.updatedAtAuto ?? values.updatedAt ?? values.date ?? ""));
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
  return classifyContent({ slug: String((guide as { slug?: unknown }).slug ?? "") }) === "learning-route"
    ? "introductory"
    : "practical";
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
  const published = allGuides.filter((guide) => isPublishedGuideStatus((guide as { status?: unknown }).status));
  const byHref = new Map(published.map((guide) => [getGuideHref(guide), guide]));
  const featured = featuredGuideHrefs.map((href) => byHref.get(href)).find((guide): guide is Guide => !!guide);
  const usedHref = featured ? getGuideHref(featured) : "";
  const recent = published
    .filter((guide) => getGuideHref(guide) !== usedHref)
    .sort((a, b) => getTimestamp(b) - getTimestamp(a))
    .slice(0, 2)
    .map((guide) => toHomeGuide(guide, "新着記事"));
  return {
    props: { contentItems: [...(featured ? [toHomeGuide(featured, "注目記事")] : []), ...recent] },
    revalidate: 1800,
  };
};

export default function HomePage({ contentItems }: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <SiteMeta
        description="ものづくりは、仕組みが見えるともっと面白い。品質管理、生産管理、統計、改善を経営工学の視点から読み解く専門メディアです。"
        path="/"
        jsonLd={[
          { "@context": "https://schema.org", "@type": "WebSite", name: siteIdentity.name, url: siteIdentity.siteUrl, description: siteIdentity.description },
          { "@context": "https://schema.org", "@type": "Organization", name: siteIdentity.name, url: siteIdentity.siteUrl },
        ]}
      />
      <main id="main-content" className="bg-slate-50 text-slate-900">
        <section className="relative flex min-h-[460px] items-center overflow-hidden border-b border-slate-200 bg-white md:min-h-[520px]">
          <Image
            src="/images/home/n-ie-lab-manufacturing-hero.jpg"
            alt="製造現場で工程設備と品質データを確認する実務者"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[62%_center] md:object-center"
          />
          <div className="absolute inset-0 bg-white/85 md:bg-white/30" aria-hidden="true" />
          <div className="relative mx-auto w-full max-w-6xl px-4 py-12">
            <div className="max-w-2xl">
              <p className="text-sm font-bold text-teal-800">経営工学から、ものづくりをつなげて学ぶ</p>
              <h1 className="mt-3 text-5xl font-black leading-none text-slate-950 md:text-7xl">{siteIdentity.name}</h1>
              <p className="mt-5 text-2xl font-black leading-tight text-slate-900 md:text-4xl">{siteIdentity.message}</p>
              <p className="mt-4 max-w-xl text-base leading-8 text-slate-700">{siteIdentity.subMessage}</p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="#learning-areas" className="rounded-md bg-slate-950 px-5 py-3 text-sm font-bold text-white hover:bg-teal-800">学ぶテーマを選ぶ</Link>
                <Link href="/guides" className="rounded-md border border-slate-500 bg-white/90 px-5 py-3 text-sm font-bold text-slate-900 hover:border-teal-600">ガイドを探す</Link>
              </div>
              <nav className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm" aria-label="SNS・外部メディア">
                <span className="font-semibold text-slate-600">SNS・外部メディア</span>
                {socialChannels.map((channel) => (
                  <a key={channel.name} href={channel.href} target="_blank" rel="noreferrer" className="font-bold text-teal-800 underline decoration-teal-300 underline-offset-4">
                    {channel.name}
                  </a>
                ))}
              </nav>
            </div>
          </div>
        </section>

        <section id="learning-areas" className="scroll-mt-20 border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-6xl px-4 py-12">
            <SectionHeading eyebrow="Learning areas" title="テーマから学ぶ" description="4つの専門領域を中心に、資格学習と外部発信を目的に応じて使い分けます。" />
            <div className="mt-7 grid gap-x-6 gap-y-7 sm:grid-cols-2 lg:grid-cols-4">
              {themes.map((theme, index) => (
                <Link key={theme.slug} href={`/themes/${theme.slug}`} className="border-t-4 border-slate-300 pt-4 hover:border-teal-600">
                  <span className="text-xs font-bold text-slate-500">専門領域 0{index + 1}</span>
                  <h2 className="mt-2 text-xl font-bold">{theme.title}</h2>
                  <p className="mt-1 text-sm font-semibold text-teal-800">{theme.supportingLabel}</p>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{theme.topicExamples.slice(0, 3).join("／")}</p>
                  <span className="mt-4 inline-block text-sm font-bold text-teal-700">この領域を見る</span>
                </Link>
              ))}
            </div>
            <div className="mt-9 grid gap-5 border-t border-slate-200 pt-7 md:grid-cols-2">
              {supportingInformationAreas.map((area) => (
                <section key={area.title} className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
                  <div>
                    <p className="text-xs font-bold text-slate-500">横断的な入口</p>
                    <h2 className="mt-1 text-lg font-bold">{area.title}</h2>
                    <p className="mt-1 text-sm font-semibold text-teal-800">{area.supportingLabel}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{area.description}</p>
                    <p className="mt-2 text-xs leading-6 text-slate-500">{area.topics.join("／")}</p>
                  </div>
                  <Link href={area.href} className="text-sm font-bold text-teal-700 underline decoration-teal-200 underline-offset-4">入口を見る</Link>
                </section>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-12">
          <SectionHeading eyebrow="Guides" title="理解を助けるガイド" description="判断過程を読む、条件を動かす、知識をつなぐ。理解したい内容に合う入口を選べます。" />
          <div className="mt-7 grid gap-5 md:grid-cols-3">
            {homeLearningGuides.map((guide) => (
              <ContentCard key={guide.href} href={guide.href} eyebrow={guide.eyebrow} title={guide.title} description={guide.description} action={guide.action} />
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm font-bold text-teal-700">
            <Link href="/cases" className="underline decoration-teal-200 underline-offset-4">ケースをすべて見る</Link>
            <Link href="/tools" className="underline decoration-teal-200 underline-offset-4">ツールをすべて見る</Link>
            <Link href="/guides" className="underline decoration-teal-200 underline-offset-4">ガイド一覧を見る</Link>
          </div>
        </section>

        <section className="border-y border-slate-200 bg-white">
          <div className="mx-auto max-w-6xl px-4 py-12">
            <SectionHeading eyebrow="Recent" title="新着・更新" description="サイト内の注目・新着と、noteで公開した記事を分けて掲載します。" />
            <div className="mt-7 grid gap-10 lg:grid-cols-[minmax(0,1.6fr)_minmax(280px,.8fr)]">
              <div>
                <h2 className="text-base font-bold">N-IE Labのガイド</h2>
                <div className="mt-4 grid gap-5 md:grid-cols-3">
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
              <div>
                <h2 className="text-base font-bold">noteの記事から</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">学習経験や背景を、文章として記録しています。</p>
                <ol className="mt-4 divide-y divide-slate-200 border-y border-slate-200">
                  {featuredExternalArticles.map((article) => (
                    <li key={article.href} className="py-4">
                      <a href={article.href} target="_blank" rel="noreferrer" className="font-bold leading-7 text-slate-900 hover:text-teal-700">{article.title}</a>
                      <p className="mt-1 text-xs text-slate-500">note · {article.publishedAt}</p>
                    </li>
                  ))}
                </ol>
                <a href={socialChannels.find((channel) => channel.name === "note")?.href} target="_blank" rel="noreferrer" className="mt-4 inline-block text-sm font-bold text-teal-700 underline decoration-teal-200 underline-offset-4">noteのプロフィールを見る</a>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-10">
          <SectionHeading eyebrow="About" title="関連情報" description="サイトの目的、運営方針、連絡先を確認できます。" />
          <nav className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm font-bold" aria-label="関連情報">
            <Link href="/about" className="text-teal-700 underline decoration-teal-200 underline-offset-4">N-IE Labについて</Link>
            <Link href="/services" className="text-teal-700 underline decoration-teal-200 underline-offset-4">掲載内容と対応範囲</Link>
            <Link href="/contact" className="text-teal-700 underline decoration-teal-200 underline-offset-4">お問い合わせ</Link>
            <Link href="/references" className="text-teal-700 underline decoration-teal-200 underline-offset-4">参考資料</Link>
          </nav>
        </section>
      </main>
    </>
  );
}
