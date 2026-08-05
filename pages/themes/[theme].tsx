import type { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import Link from "next/link";

import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { ContentCard } from "@/components/site/ContentCard";
import { SectionHeading } from "@/components/site/SectionHeading";
import { SiteMeta } from "@/components/site/SiteMeta";
import {
  contentTypeLabels,
  difficultyLabels,
  getTheme,
  themes,
  type ContentLink,
  type ThemeDefinition,
} from "@/data/n-ie-lab";

type ThemePageProps = { theme: ThemeDefinition };

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: themes.map((theme) => ({ params: { theme: theme.slug } })),
  fallback: false,
});

export const getStaticProps: GetStaticProps<ThemePageProps> = async ({ params }) => {
  const theme = getTheme(String(params?.theme ?? ""));
  if (!theme) return { notFound: true };
  return { props: { theme }, revalidate: 1800 };
};

export default function ThemePage({ theme }: InferGetStaticPropsType<typeof getStaticProps>) {
  const related = theme.relatedThemes.map((slug) => getTheme(slug)).filter((item): item is ThemeDefinition => !!item);

  return (
    <>
      <SiteMeta
        title={theme.title}
        description={theme.description}
        path={`/themes/${theme.slug}`}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: theme.title,
          description: theme.description,
          url: `https://n-ie-qclab.com/themes/${theme.slug}`,
        }}
      />
      <main id="main-content" className="min-h-screen bg-slate-50 text-slate-900">
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-6xl px-4 py-12">
            <Breadcrumbs items={[{ label: "ホーム", href: "/" }, { label: "4つのテーマ", href: "/themes" }, { label: theme.title }]} />
            <p className="mt-8 text-xs font-bold uppercase text-teal-700">Theme</p>
            <h1 className="mt-3 text-4xl font-black leading-tight md:text-5xl">{theme.title}</h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">{theme.description}</p>
            <p className="mt-6 border-l-4 border-teal-600 pl-4 text-base font-bold leading-8 text-slate-800">{theme.question}</p>
          </div>
        </section>

        <ContentSection title="初めて読む人へ" description="このテーマの基本用語と見方をつかみます。" items={theme.introductory} />
        <ContentSection title="現場で考える" description="条件、判断基準、他部門とのつながりまで掘り下げます。" items={theme.practical} alternate />
        {theme.cases.length > 0 ? <ContentSection title="ケースから考える" description="一つの正解ではなく、制約下での判断過程を確認します。" items={theme.cases} /> : null}
        {theme.tools.length > 0 ? <ContentSection title="試して理解する" description="数値や条件を動かし、結果の変化を確かめます。" items={theme.tools} alternate /> : null}
        {theme.learning.length > 0 ? <ContentSection title="学びを深める" description="資格や体系学習を通じて理解を補強します。" items={theme.learning} /> : null}

        <section className="border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-6xl px-4 py-10">
            <h2 className="text-xl font-bold">関連する視点</h2>
            <div className="mt-4 flex flex-wrap gap-3">
              {related.map((item) => (
                <Link key={item.slug} href={`/themes/${item.slug}`} className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-700 hover:border-teal-500 hover:text-teal-700">
                  {item.title}
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

function ContentSection({
  title,
  description,
  items,
  alternate = false,
}: {
  title: string;
  description: string;
  items: ContentLink[];
  alternate?: boolean;
}) {
  return (
    <section className={alternate ? "border-y border-slate-200 bg-white" : "bg-slate-50"}>
      <div className="mx-auto max-w-6xl px-4 py-12">
        <SectionHeading title={title} description={description} />
        <div className="mt-7 grid gap-5 md:grid-cols-2">
          {items.map((item) => (
            <ContentCard
              key={item.href}
              href={item.href}
              eyebrow={contentTypeLabels[item.contentType]}
              title={item.title}
              description={item.description}
              meta={difficultyLabels[item.difficulty]}
              {...(item.tags ? { tags: item.tags } : {})}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
