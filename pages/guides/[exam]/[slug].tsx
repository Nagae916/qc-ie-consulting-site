// pages/guides/[exam]/[slug].tsx
import type { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import Head from "next/head";
import Link from "next/link";
import { allGuides, type Guide } from "contentlayer/generated";

import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";          // ← MDXではなく数式拡張のみ
import remarkRehype from "remark-rehype";
import rehypeKatex from "rehype-katex";         // ← 数式をHTML化
import rehypeSanitize from "rehype-sanitize";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeStringify from "rehype-stringify";

type ExamKey = "qc" | "stat" | "engineer";
const EXAM_LABEL: Record<ExamKey, string> = { qc: "品質管理", stat: "統計", engineer: "技術士" };

const toExamKey = (v: unknown): ExamKey | null => {
  const s = String(v ?? "").toLowerCase().trim();
  if (s === "qc") return "qc";
  if (s === "stat" || s === "stats" || s === "statistics") return "stat";
  if (s === "engineer" || s === "pe" || s === "eng") return "engineer";
  return null;
};

function stablePath(g: Guide): { exam: ExamKey; slug: string; url: string } {
  const raw = String(g._raw?.flattenedPath ?? ""); // 例: guides/qc/xxx
  const parts = raw.split("/");
  const rawExam = parts[1] ?? "";
  const rawSlug = parts[parts.length - 1] ?? "";
  const exam = toExamKey((g as any).exam) ?? toExamKey(rawExam) ?? "qc";
  const slug = String((g as any).slug ?? rawSlug).trim();
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

const THEME: Record<ExamKey, { accent: string; link: string; title: string }> = {
  qc: { accent: "bg-amber-300/70", link: "text-amber-700 hover:text-amber-800", title: "text-amber-800" },
  stat: { accent: "bg-sky-300/70", link: "text-sky-700 hover:text-sky-800", title: "text-sky-800" },
  engineer: { accent: "bg-emerald-300/70", link: "text-emerald-700 hover:text-emerald-800", title: "text-emerald-800" },
};

// Markdown(+Math) → HTML（MDXは使わない）
async function mdxToHtml(mdxRaw: string): Promise<string> {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMath) // $...$, $$...$$
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeKatex) // KaTeX へ
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
    .filter((g) => (g as any).status !== "draft")
    .map((g) => stablePath(g))
    .filter(({ exam, slug }) => !!exam && !!slug && !seen.has(`${exam}/${slug}`) && seen.add(`${exam}/${slug}`))
    .map(({ exam, slug }) => ({ params: { exam, slug } }));
  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<{ guide: Guide; exam: ExamKey; html: string; updatedYmd: string }> =
  async ({ params }) => {
    const examParam = toExamKey(params?.exam);
    const slugParam = String(params?.slug ?? "").trim().toLowerCase();
    if (!examParam || !slugParam) return { notFound: true };

    const guide =
      allGuides.find((g) => {
        if ((g as any).status === "draft") return false;
        const { exam, slug } = stablePath(g);
        return exam === examParam && slug.toLowerCase() === slugParam;
      }) ?? null;

    if (!guide) return { notFound: true };

    const html = await mdxToHtml(guide.body.raw);
    const updatedYmd = formatYMD((guide as any).updatedAtAuto ?? (guide as any).updatedAt, (guide as any).date);

    return { props: { guide, exam: examParam, html, updatedYmd }, revalidate: 60 };
  };

export default function GuidePage({
  guide, exam, html, updatedYmd,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const theme = THEME[exam];
  const { url } = stablePath(guide);

  const sourcePath =
    (guide._raw?.sourceFilePath as string | undefined) ??
    `${guide._raw?.flattenedPath ?? `${exam}/${(guide as any).slug}`}.mdx`;
  const editUrl = `https://github.com/Nagae916/qc-ie-consulting-site/edit/main/content/${sourcePath}`;

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <Head>
        <title>{guide.title} | QC × IE LABO</title>
        <meta name="description" content={(guide as any).description ?? ""} />
        <link rel="canonical" href={url} />
      </Head>

      <nav className="mb-4 text-sm text-gray-500">
        <Link href="/guides" className="underline">ガイド</Link>{" / "}
        <Link href={`/guides/${exam}`} className={`underline ${theme.link}`}>{EXAM_LABEL[exam]}</Link>
      </nav>

      <div className={`h-1 w-full rounded-t-2xl ${theme.accent} mb-3`} />
      <h1 className={`text-2xl md:text-3xl font-extrabold ${theme.title}`}>{guide.title}</h1>

      <div className="mt-2 text-xs text-gray-500">
        <span suppressHydrationWarning>{updatedYmd ? `更新: ${updatedYmd}` : ""}</span>
        {guide.version ? <span className="ml-2">v{guide.version}</span> : null}
        <a href={editUrl} target="_blank" rel="noreferrer" className="ml-3 underline">編集する</a>
      </div>

      <article className="prose prose-neutral max-w-none mt-6" dangerouslySetInnerHTML={{ __html: html }} />
    </main>
  );
}
