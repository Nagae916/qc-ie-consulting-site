// pages/guides/[exam]/[slug].tsx
import type { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import Link from "next/link";
import Head from "next/head";
import { allGuides, type Guide } from "contentlayer/generated";
import { useMDXComponent } from "next-contentlayer2/hooks";

/* ===== 共通 ===== */
type ExamKey = "qc" | "stat" | "engineer";

const EXAM_LABEL: Record<ExamKey, string> = {
  qc: "品質管理",
  stat: "統計",
  engineer: "技術士",
};

const toExamKey = (v: unknown): ExamKey | null => {
  const s = String(v ?? "").toLowerCase().trim();
  if (s === "qc") return "qc";
  if (s === "stat" || s === "stats" || s === "statistics") return "stat";
  if (s === "engineer" || s === "pe" || s === "eng") return "engineer";
  return null;
};

// g から /guides/{exam}/{slug} を“必ず”復元する
function stablePath(g: Guide): { exam: ExamKey; slug: string; url: string } {
  const fromRaw = String(g._raw?.flattenedPath ?? "").split("/");
  // content/guides/<exam>/<...>/<slug>
  const rawExam = fromRaw[1] || "";
  const rawSlug = fromRaw[fromRaw.length - 1] || "";

  const exam = toExamKey((g as any).exam) ?? toExamKey(rawExam) ?? "qc";
  const slug = String((g as any).slug ?? rawSlug).trim();
  const url = `/guides/${exam}/${slug}`;
  return { exam, slug, url };
}

const THEME: Record<ExamKey, { accent: string; link: string; title: string }> = {
  qc: { accent: "bg-amber-300/70", link: "text-amber-700 hover:text-amber-800", title: "text-amber-800" },
  stat: { accent: "bg-sky-300/70", link: "text-sky-700 hover:text-sky-800", title: "text-sky-800" },
  engineer: { accent: "bg-emerald-300/70", link: "text-emerald-700 hover:text-emerald-800", title: "text-emerald-800" },
};

/* ===== SSG ===== */
export const getStaticPaths: GetStaticPaths = async () => {
  const seen = new Set<string>();
  const paths = allGuides
    .filter((g) => (g as any).status !== "draft")
    .map((g) => stablePath(g))
    .filter(({ exam, slug }) => !!exam && !!slug && !seen.has(`${exam}/${slug}`) && seen.add(`${exam}/${slug}`))
    .map(({ exam, slug }) => ({ params: { exam, slug } }));

  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<{ guide: Guide; exam: ExamKey }> = async ({ params }) => {
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
  return { props: { guide, exam: examParam }, revalidate: 60 };
};

/* ===== Page ===== */
export default function GuidePage({ guide, exam }: InferGetStaticPropsType<typeof getStaticProps>) {
  const MDX = useMDXComponent(guide.body.code);
  const theme = THEME[exam];
  const { url } = stablePath(guide);

  const updated =
    (guide as any).updatedAt || (guide as any).date
      ? new Date(String((guide as any).updatedAt ?? (guide as any).date)).toLocaleString("ja-JP")
      : "";

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

      {/* パンくず */}
      <nav className="mb-4 text-sm text-gray-500">
        <Link href="/guides" className="underline">ガイド</Link>
        {" / "}
        <Link href={`/guides/${exam}`} className={`underline ${theme.link}`}>{EXAM_LABEL[exam]}</Link>
      </nav>

      {/* アクセントバー */}
      <div className={`h-1 w-full rounded-t-2xl ${theme.accent} mb-3`} />

      <h1 className={`text-2xl md:text-3xl font-extrabold ${theme.title}`}>{guide.title}</h1>

      <div className="mt-2 text-xs text-gray-500">
        {updated ? <>更新: {updated}</> : null}
        {guide.version ? <span className="ml-2">v{guide.version}</span> : null}
        <a href={editUrl} target="_blank" rel="noreferrer" className="ml-3 underline">編集する</a>
      </div>

      <article className="prose prose-neutral max-w-none mt-6">
        <MDX />
      </article>
    </main>
  );
}
