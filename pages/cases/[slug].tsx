import type { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import Link from "next/link";

import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { SiteMeta } from "@/components/site/SiteMeta";
import {
  caseStudies,
  getCaseStudy,
  type CaseDeliverable,
  type CaseDiagram as CaseDiagramData,
  type CaseSection as CaseSectionData,
  type CaseStudy,
} from "@/data/cases";
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
    datePublished: study.publishedAt,
    dateModified: study.updatedAt,
    keywords: study.tags.join(", "),
    author: { "@type": "Organization", name: "N-IE Lab" },
    publisher: { "@type": "Organization", name: "N-IE Lab" },
    mainEntityOfPage: `https://n-ie-qclab.com${path}`,
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "ホーム", item: "https://n-ie-qclab.com/" },
      { "@type": "ListItem", position: 2, name: "ケース", item: "https://n-ie-qclab.com/cases" },
      { "@type": "ListItem", position: 3, name: study.title, item: `https://n-ie-qclab.com${path}` },
    ],
  };

  return (
    <>
      <SiteMeta title={study.title} description={study.summary} path={path} type="article" jsonLd={[articleJsonLd, breadcrumbJsonLd]} />
      <main id="main-content" className="min-h-screen bg-slate-50 text-slate-900">
        <article>
          <header className="border-b border-slate-200 bg-white">
            <div className="mx-auto max-w-4xl px-4 py-12">
              <Breadcrumbs items={[{ label: "ホーム", href: "/" }, { label: "ケース", href: "/cases" }, { label: study.title }]} />
              <p className="mt-8 text-xs font-bold uppercase text-teal-700">Case study</p>
              <h1 className="mt-3 text-3xl font-black leading-tight md:text-5xl">{study.title}</h1>
              <p className="mt-4 text-lg font-semibold leading-8 text-slate-700">{study.subtitle}</p>
              <p className="mt-6 max-w-3xl text-base leading-8 text-slate-600">{study.summary}</p>
              <p className="mt-4 text-sm text-slate-500">
                公開 <time dateTime={study.publishedAt}>{study.publishedAt}</time>
                <span aria-hidden="true"> · </span>
                更新 <time dateTime={study.updatedAt}>{study.updatedAt}</time>
              </p>
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
              <p className="mt-3 border-l-4 border-sky-500 bg-sky-50 px-4 py-3 text-sm leading-7 text-slate-700">
                {study.scopeNote}
              </p>
            </div>
          </header>

          <div className="mx-auto max-w-4xl px-4 py-12">
            {study.sections.map((section) => (
              <div key={section.title}>
                <CaseSection section={section} />
                {study.diagram.afterSection === section.title ? <CaseDiagram diagram={study.diagram} /> : null}
              </div>
            ))}
            <DeliverablesSection deliverables={study.deliverables} />
            <CaseListSection title="この事例で得られる一般的知見" items={study.insights} />
          </div>
        </article>

        <section className="border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-4xl px-4 py-10">
            <h2 className="text-2xl font-bold">関連記事</h2>
            <p className="mt-2 text-sm leading-7 text-slate-600">原則を確認し、関連するテーマやN-IE Labの考え方へ進めます。</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {study.relatedLinks.map((item) => (
                <Link key={item.href} href={item.href} className="rounded-lg border border-slate-200 bg-slate-50 p-4 hover:border-teal-500">
                  <span className="font-bold text-slate-900">{item.title}</span>
                  <span className="mt-2 block text-sm leading-6 text-slate-600">{item.description}</span>
                </Link>
              ))}
            </div>
            <Link href="/cases" className="mt-6 inline-block text-sm font-bold text-teal-700 underline decoration-teal-200 underline-offset-4">ケース一覧へ戻る</Link>
          </div>
        </section>
      </main>
    </>
  );
}

function CaseSection({ section }: { section: CaseSectionData }) {
  const List = section.ordered ? "ol" : "ul";
  return (
    <section className="border-b border-slate-200 py-8 first:pt-0">
      <h2 className="text-2xl font-bold">{section.title}</h2>
      {section.paragraphs?.map((paragraph) => (
        <p key={paragraph} className="mt-4 text-base leading-8 text-slate-700">{paragraph}</p>
      ))}
      {section.items?.length ? (
        <List className={`mt-4 grid gap-3 pl-6 text-base leading-8 text-slate-700 ${section.ordered ? "list-decimal" : "list-disc"}`}>
          {section.items.map((item) => <li key={item}>{item}</li>)}
        </List>
      ) : null}
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

function CaseDiagram({ diagram }: { diagram: CaseDiagramData }) {
  return (
    <figure className={`case-diagram case-diagram--${diagram.kind}`} aria-labelledby={`diagram-${diagram.kind}`}>
      <figcaption id={`diagram-${diagram.kind}`}>
        <strong>{diagram.title}</strong>
        <span>{diagram.description}</span>
      </figcaption>
      <ol className="case-diagram__items">
        {diagram.items.map((item, index) => (
          <li key={item.label}>
            <span className="case-diagram__index">{index + 1}</span>
            <h3>{item.label}</h3>
            <p>{item.description}</p>
            <small>{item.usage}</small>
          </li>
        ))}
      </ol>
    </figure>
  );
}

function DeliverablesSection({ deliverables }: { deliverables: CaseDeliverable[] }) {
  return (
    <section className="border-b border-slate-200 py-8">
      <h2 className="text-2xl font-bold">作成した成果物</h2>
      <p className="mt-4 text-base leading-8 text-slate-700">
        実際の社内様式や数値は公開せず、各成果物が担う判断と、必要な情報の構造を示します。
      </p>
      <div className="case-deliverable-grid">
        {deliverables.map((item) => (
          <article key={item.name} className="case-deliverable-card">
            <h3>{item.name}</h3>
            <p>{item.purpose}</p>
            <dl>
              <div>
                <dt>主な記載項目</dt>
                <dd>{item.fields.join("、")}</dd>
              </div>
              <div>
                <dt>使うタイミング</dt>
                <dd>{item.timing}</dd>
              </div>
              <div>
                <dt>関係者</dt>
                <dd>{item.stakeholders}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
    </section>
  );
}
