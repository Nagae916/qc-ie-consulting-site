import type { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import Link from "next/link";

import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { SiteMeta } from "@/components/site/SiteMeta";
import { caseStudies, getCaseStudy, type CaseStudy } from "@/data/cases";
import { getTheme } from "@/data/n-ie-lab";

type CasePageProps = { study: CaseStudy };

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: caseStudies.map((study) => ({ params: { slug: study.slug } })),
  fallback: false,
});

export const getStaticProps: GetStaticProps<CasePageProps> = async ({ params }) => {
  const study = getCaseStudy(String(params?.slug ?? ""));
  if (!study) return { notFound: true };
  return { props: { study }, revalidate: 1800 };
};

export default function CaseStudyPage({ study }: InferGetStaticPropsType<typeof getStaticProps>) {
  const path = `/cases/${study.slug}`;
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: study.title,
    description: study.summary,
    dateModified: study.updatedAt,
    author: { "@type": "Organization", name: "N-IE Lab" },
    publisher: { "@type": "Organization", name: "N-IE Lab" },
    mainEntityOfPage: `https://n-ie-qclab.com${path}`,
  };

  return (
    <>
      <SiteMeta title={study.title} description={study.summary} path={path} type="article" jsonLd={articleJsonLd} />
      <main id="main-content" className="min-h-screen bg-slate-50 text-slate-900">
        <article>
          <header className="border-b border-slate-200 bg-white">
            <div className="mx-auto max-w-4xl px-4 py-12">
              <Breadcrumbs items={[{ label: "ホーム", href: "/" }, { label: "ケース", href: "/cases" }, { label: study.title }]} />
              <p className="mt-8 text-xs font-bold uppercase text-teal-700">Case study</p>
              <h1 className="mt-3 text-3xl font-black leading-tight md:text-5xl">{study.title}</h1>
              <p className="mt-4 text-lg font-semibold leading-8 text-slate-700">{study.subtitle}</p>
              <p className="mt-6 max-w-3xl text-base leading-8 text-slate-600">{study.summary}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {study.themes.map((slug) => {
                  const theme = getTheme(slug);
                  return theme ? (
                    <Link key={slug} href={`/themes/${slug}`} className="rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-bold text-teal-800">
                      {theme.title}
                    </Link>
                  ) : null;
                })}
              </div>
              <p className="mt-7 border-l-4 border-amber-500 bg-amber-50 px-4 py-3 text-sm leading-7 text-slate-700">
                {study.confidentialityNote}
              </p>
            </div>
          </header>

          <div className="mx-auto max-w-4xl px-4 py-12">
            <CaseTextSection title="背景" body={study.context} />
            <CaseTextSection title="問題" body={study.problem} />
            <CaseListSection title="制約条件" items={study.constraints} />
            <CaseListSection title="収集した情報" items={study.information} />
            <CaseListSection title="問題の構造" items={study.structure} ordered />
            <CaseListSection title="判断したこと" items={study.decisions} ordered />
            <CaseListSection title="作成した成果物" items={study.deliverables} />
            <CaseListSection title="得られる効果" items={study.effects} />
            <CaseListSection title="他の現場へ応用できる知見" items={study.insights} />
          </div>
        </article>

        <section className="border-t border-slate-200 bg-white">
          <div className="mx-auto flex max-w-4xl flex-col gap-4 px-4 py-10 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold">別のケースも見る</h2>
              <p className="mt-2 text-sm leading-7 text-slate-600">異なる制約と判断の組み立て方を比較できます。</p>
            </div>
            <Link href="/cases" className="w-fit rounded-md bg-slate-950 px-5 py-3 text-sm font-bold text-white hover:bg-teal-800">ケース一覧へ</Link>
          </div>
        </section>
      </main>
    </>
  );
}

function CaseTextSection({ title, body }: { title: string; body: string }) {
  return (
    <section className="border-b border-slate-200 py-8 first:pt-0">
      <h2 className="text-2xl font-bold">{title}</h2>
      <p className="mt-4 text-base leading-8 text-slate-700">{body}</p>
    </section>
  );
}

function CaseListSection({ title, items, ordered = false }: { title: string; items: string[]; ordered?: boolean }) {
  const List = ordered ? "ol" : "ul";
  return (
    <section className="border-b border-slate-200 py-8">
      <h2 className="text-2xl font-bold">{title}</h2>
      <List className={`mt-4 grid gap-3 text-base leading-8 text-slate-700 ${ordered ? "list-decimal" : "list-disc"} pl-6`}>
        {items.map((item) => <li key={item}>{item}</li>)}
      </List>
    </section>
  );
}
