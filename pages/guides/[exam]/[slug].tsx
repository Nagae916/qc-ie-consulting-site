// pages/guides/[exam]/[slug].tsx
import type { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import Head from "next/head";
import Link from "next/link";
import dynamic from "next/dynamic";
import { allGuides, type Guide } from "contentlayer/generated";
// contentlayer2 の hooks
import { useMDXComponent } from "next-contentlayer2/hooks";

// Markdown(+Math) → HTML フォールバック
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

/* ================= 基本定義 ================= */
type ExamKey = "qc" | "stat" | "engineer";
const EXAM_LABEL: Record<ExamKey, string> = {
  qc: "品質管理",
  stat: "統計",
  engineer: "技術士",
};

const THEME: Record<ExamKey, { accent: string; link: string; title: string }> = {
  qc: { accent: "bg-amber-300/70", link: "text-amber-700 hover:text-amber-800", title: "text-amber-800" },
  stat: { accent: "bg-sky-300/70", link: "text-sky-700 hover:text-sky-800", title: "text-sky-800" },
  engineer: { accent: "bg-emerald-300/70", link: "text-emerald-700 hover:text-emerald-800", title: "text-emerald-800" },
};

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

// Markdown(+Math) → HTML フォールバック（MDX code が無いときだけ使用）
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

/* ================= SSG ================= */
export const getStaticPaths: GetStaticPaths = async () => {
  const seen = new Set<string>();
  const paths = allGuides
    .filter((g) => (g as any).status !== "draft")
    .map((g) => stablePath(g))
    .filter(({ exam, slug }) => !!exam && !!slug && !seen.has(`${exam}/${slug}`) && seen.add(`${exam}/${slug}`))
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
    allGuides.find((g) => {
      if ((g as any).status === "draft") return false;
      const { exam, slug } = stablePath(g);
      return exam === examParam && slug.toLowerCase() === slugParam;
    }) ?? null;

  if (!guide) return { notFound: true };

  // 優先：MDX（Reactコンポーネント利用可）
  const mdxCode = (guide as any)?.body?.code ?? null;

  // フォールバック：HTML（MDXが無い or 無効な場合）
  const html = mdxCode ? null : await mdToHtml(guide.body.raw);

  const updatedYmd = formatYMD((guide as any).updatedAtAuto ?? (guide as any).updatedAt, (guide as any).date);

  return { props: { guide, exam: examParam, mdxCode, html, updatedYmd }, revalidate: 60 };
};

/* ================= MDX許可コンポーネント（SSR無効の動的import） =================
   ▼ ファイル名もコメントで残すことで、人為ミスを低減
*/
// /src/components/guide/Quiz.tsx （named export: Quiz）
const Quiz = dynamic(
  () => import("@/components/guide/Quiz").then((m) => m.Quiz),
  { ssr: false }
);

// /src/components/guide/ControlChart.tsx（default export）
const ControlChart = dynamic(
  () => import("@/components/guide/ControlChart").then((m) => m.default),
  { ssr: false }
);

// /src/components/guide/AvailabilitySimulator.tsx（default export：必要ならMDXで使用可）
const AvailabilitySimulator = dynamic(
  () => import("@/components/guide/AvailabilitySimulator").then((m) => m.default),
  { ssr: false }
);

export default function GuidePage({
  guide,
  exam,
  mdxCode,
  html,
  updatedYmd,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const theme = THEME[exam];
  const { url } = stablePath(guide);

  const sourcePath =
    (guide._raw?.sourceFilePath as string | undefined) ??
    `${guide._raw?.flattenedPath ?? `${exam}/${(guide as any).slug}`}.mdx`;
  const editUrl = `https://github.com/Nagae916/qc-ie-consulting-site/edit/main/content/${sourcePath}`;

  // Hooksは常に同じ順序で呼ぶ
  const MDX = useMDXComponent(mdxCode || "");

  // MDX から使えるコンポーネントを注入
  const components = {
    Quiz,
    ControlChart,
    AvailabilitySimulator,
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <Head>
        <title>{guide.title} | QC × IE LABO</title>
        <meta name="description" content={(guide as any).description ?? ""} />
        <link rel="canonical" href={url} />
        {/* guide.css を _app.tsx で import していない場合は下行を有効化 */}
        {/* <link rel="stylesheet" href="/styles/guide.css" /> */}
      </Head>

      <nav className="mb-4 text-sm text-gray-500">
        <Link href="/guides" className="underline">
          ガイド
        </Link>
        {" / "}
        <Link href={`/guides/${exam}`} className={`underline ${theme.link}`}>
          {EXAM_LABEL[exam]}
        </Link>
      </nav>

      <div className={`h-1 w-full rounded-t-2xl ${theme.accent} mb-3`} />
      <h1 className={`text-2xl md:text-3xl font-extrabold ${theme.title}`}>{guide.title}</h1>

      <div className="mt-2 text-xs text-gray-500">
        <span suppressHydrationWarning>{updatedYmd ? `更新: ${updatedYmd}` : ""}</span>
        {guide.version ? <span className="ml-2">v{guide.version}</span> : null}
        <a href={editUrl} target="_blank" rel="noreferrer" className="ml-3 underline">
          編集する
        </a>
      </div>

      {/* 優先：MDX（Reactコンポーネント可）／ 代替：HTML */}
      <article className="prose prose-neutral max-w-none mt-6">
        {mdxCode ? <MDX components={components} /> : <div dangerouslySetInnerHTML={{ __html: html ?? "" }} />}
      </article>
    </main>
  );
}
