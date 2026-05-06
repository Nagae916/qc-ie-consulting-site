import type { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import Head from "next/head";
import Link from "next/link";
import * as React from "react";
import { allGuides, type Guide } from "contentlayer/generated";
import { useMDXComponent } from "next-contentlayer2/hooks";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkRehype from "remark-rehype";
import rehypeKatex from "rehype-katex";
import rehypeSanitize from "rehype-sanitize";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeStringify from "rehype-stringify";

import { GUIDE_COMPONENTS, type GuideComponentMap } from "@/components/guide/registry.client";

type ExamKey = "qc" | "stat" | "engineer";
type GuideStatus = "published" | "draft" | "planned" | "needs-review" | "wip";

const EXAM_LABEL: Record<ExamKey, string> = {
  qc: "品質管理・QMS",
  stat: "統計・データ分析",
  engineer: "経営工学・技術士",
};

const THEME: Record<ExamKey, { accent: string; link: string; title: string; border: string; panel: string }> = {
  qc: {
    accent: "bg-amber-300/70",
    link: "text-amber-700 hover:text-amber-800",
    title: "text-amber-800",
    border: "border-amber-200",
    panel: "bg-amber-50",
  },
  stat: {
    accent: "bg-sky-300/70",
    link: "text-sky-700 hover:text-sky-800",
    title: "text-sky-800",
    border: "border-sky-200",
    panel: "bg-sky-50",
  },
  engineer: {
    accent: "bg-emerald-300/70",
    link: "text-emerald-700 hover:text-emerald-800",
    title: "text-emerald-800",
    border: "border-emerald-200",
    panel: "bg-emerald-50",
  },
};

const statusLabels: Record<GuideStatus, string> = {
  published: "公開済み",
  draft: "下書き",
  planned: "準備中",
  "needs-review": "要レビュー",
  wip: "作成中",
};

const statusClasses: Record<GuideStatus, string> = {
  published: "bg-emerald-50 text-emerald-800 border-emerald-200",
  draft: "bg-slate-50 text-slate-700 border-slate-200",
  planned: "bg-amber-50 text-amber-800 border-amber-200",
  "needs-review": "bg-rose-50 text-rose-800 border-rose-200",
  wip: "bg-sky-50 text-sky-800 border-sky-200",
};

const normalizeStatus = (value: unknown): GuideStatus => {
  if (value === "draft" || value === "planned" || value === "needs-review" || value === "wip") return value;
  return "published";
};

const toExamKey = (v: unknown): ExamKey | null => {
  const s = String(v ?? "").toLowerCase().trim();
  if (s === "qc") return "qc";
  if (s === "stat" || s === "stats" || s === "statistics") return "stat";
  if (s === "engineer" || s === "pe" || s === "eng") return "engineer";
  return null;
};

function stablePath(g: Guide): { exam: ExamKey; slug: string; url: string } {
  const raw = String(g._raw?.flattenedPath ?? "");
  const parts = raw.split("/");
  const rawExam = parts[1] ?? "";
  const rawSlug = parts[parts.length - 1] ?? "";
  const values = g as { exam?: unknown; slug?: unknown };
  const exam = toExamKey(values.exam) ?? toExamKey(rawExam) ?? "qc";
  const slug = String(values.slug ?? rawSlug).trim();
  return { exam, slug, url: `/guides/${exam}/${slug}` };
}

function formatYMD(v1?: unknown, v2?: unknown): string {
  const s = String(v1 ?? v2 ?? "").trim();
  if (!s) return "";
  const m = s.match(/^(\d{4})[-/](\d{2})[-/](\d{2})/);
  if (m) return `${m[1]}-${m[2]}-${m[3]}`;
  const t = Date.parse(s);
  if (!Number.isFinite(t)) return "";
  const d = new Date(t);
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
}

async function mdToHtml(mdxRaw: string): Promise<string> {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMath)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeKatex)
    .use(rehypeSanitize)
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, { behavior: "wrap" })
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(mdxRaw);
  return String(file);
}

export const getStaticPaths: GetStaticPaths = async () => {
  const seen = new Set<string>();
  const paths = allGuides
    .filter((g) => (g as { status?: unknown }).status !== "draft")
    .map((g) => stablePath(g))
    .filter(({ exam, slug }) => {
      const key = `${exam}/${slug}`;
      if (!exam || !slug || seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .map(({ exam, slug }) => ({ params: { exam, slug } }));
  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<{
  guide: Guide;
  exam: ExamKey;
  mdxCode: string | null;
  html: string | null;
  updatedYmd: string;
}> = async ({ params }) => {
  const examParam = toExamKey(params?.exam);
  const slugParam = String(params?.slug ?? "").trim().toLowerCase();
  if (!examParam || !slugParam) return { notFound: true };

  const guide =
    allGuides.find((candidate) => {
      if ((candidate as { status?: unknown }).status === "draft") return false;
      const { exam, slug } = stablePath(candidate);
      return exam === examParam && slug.toLowerCase() === slugParam;
    }) ?? null;

  if (!guide) return { notFound: true };

  const mdxCode = (guide as { body?: { code?: string } })?.body?.code ?? null;
  const html = mdxCode ? null : await mdToHtml(guide.body.raw);
  const guideDates = guide as { updatedAtAuto?: unknown; updatedAt?: unknown; date?: unknown };
  const updatedYmd = formatYMD(guideDates.updatedAtAuto ?? guideDates.updatedAt, guideDates.date);

  return { props: { guide, exam: examParam, mdxCode, html, updatedYmd }, revalidate: 60 };
};

export default function GuidePage({
  guide,
  exam,
  mdxCode,
  html,
  updatedYmd,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const theme = THEME[exam];
  const { url } = stablePath(guide);
  const guideMeta = guide as { slug?: unknown; description?: unknown; version?: unknown; status?: unknown };
  const status = normalizeStatus(guideMeta.status);

  const sourcePath =
    (guide._raw?.sourceFilePath as string | undefined) ??
    `${guide._raw?.flattenedPath ?? `${exam}/${String(guideMeta.slug ?? "")}`}.mdx`;
  const editUrl = `https://github.com/Nagae916/qc-ie-consulting-site/edit/main/content/${sourcePath}`;

  const MDX = useMDXComponent(mdxCode || "");
  const components = React.useMemo(() => GUIDE_COMPONENTS as GuideComponentMap, []);

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <Head>
        <title>{guide.title} | n-ie-qclab</title>
        <meta name="description" content={typeof guideMeta.description === "string" ? guideMeta.description : ""} />
        <link rel="canonical" href={url} />
      </Head>

      <Breadcrumb exam={exam} title={guide.title} themeLink={theme.link} />

      <div className={`mb-3 h-1 w-full rounded-t-2xl ${theme.accent}`} />
      <h1 className={`text-2xl font-extrabold md:text-3xl ${theme.title}`}>{guide.title}</h1>

      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-500">
        <StatusBadge status={status} />
        <span suppressHydrationWarning>{updatedYmd ? `更新: ${updatedYmd}` : ""}</span>
        {guideMeta.version ? <span className="ml-2">v{String(guideMeta.version)}</span> : null}
        <a href={editUrl} target="_blank" rel="noreferrer" className="ml-3 underline">
          編集する
        </a>
      </div>

      <article className="prose prose-neutral mt-6 max-w-none">
        {mdxCode ? <MDX components={components} /> : <div dangerouslySetInnerHTML={{ __html: html ?? "" }} />}
      </article>

      <GuideBackLinks exam={exam} theme={theme} />
    </main>
  );
}

function Breadcrumb({ exam, title, themeLink }: { exam: ExamKey; title: string; themeLink: string }) {
  return (
    <nav className="mb-4 text-sm text-gray-500" aria-label="パンくず">
      <Link href="/" className="underline">
        ホーム
      </Link>
      <span aria-hidden="true"> / </span>
      <Link href="/guides" className="underline">
        ガイド
      </Link>
      <span aria-hidden="true"> / </span>
      <Link href={`/guides/${exam}`} className={`underline ${themeLink}`}>
        {EXAM_LABEL[exam]}
      </Link>
      <span aria-hidden="true"> / </span>
      <span className="text-gray-700">{title}</span>
    </nav>
  );
}

function StatusBadge({ status }: { status: GuideStatus }) {
  return (
    <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${statusClasses[status]}`}>
      {statusLabels[status]}
    </span>
  );
}

function GuideBackLinks({ exam, theme }: { exam: ExamKey; theme: { border: string; panel: string; link: string } }) {
  const links = [
    {
      title: "経営工学 学習マップ",
      description: "品質管理・統計・技術士演習のつながりを確認する",
      href: "/guides/engineer/learning-map",
    },
    {
      title: `${EXAM_LABEL[exam]}のガイド一覧`,
      description: "同じカテゴリのガイドへ戻る",
      href: `/guides/${exam}`,
    },
    {
      title: "トップページ",
      description: "n-ie-qclab の入口へ戻る",
      href: "/",
    },
  ];

  return (
    <section className={`mt-10 rounded-2xl border ${theme.border} ${theme.panel} p-5`}>
      <h2 className="text-lg font-bold text-slate-900">次に見るページ</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        学習中に迷ったら、学習マップ・カテゴリ一覧・トップページへ戻れます。
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {links.map((item) => (
          <Link key={item.href} href={item.href} className="rounded-xl border border-white/80 bg-white p-4 hover:shadow-sm">
            <span className={`text-sm font-bold ${theme.link}`}>{item.title}</span>
            <span className="mt-2 block text-xs leading-5 text-slate-600">{item.description}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
