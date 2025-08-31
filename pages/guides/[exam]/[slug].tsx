// pages/guides/[exam]/[slug].tsx
import type { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import { allGuides, type Guide } from "contentlayer/generated";
import { useMDXComponent } from "next-contentlayer2/hooks";
import Link from "next/link";

const EXAM_LABEL = {
  qc: "QC検定",
  stat: "統計検定",
  engineer: "技術士試験",
} as const;
type ExamKey = keyof typeof EXAM_LABEL;

function toExamKey(v: unknown): ExamKey | null {
  const s = String(v ?? "").toLowerCase();
  if (s === "qc") return "qc";
  if (s === "stat" || s === "stats" || s === "statistics") return "stat";
  if (s === "engineer" || s === "pe" || s === "eng") return "engineer";
  return null;
}

export const getStaticPaths: GetStaticPaths = async () => {
  const seen = new Set<string>();
  const paths: { params: { exam: ExamKey; slug: string } }[] = [];

  for (const g of allGuides) {
    if (g.status === "draft") continue;
    const exam = toExamKey((g as any).exam);
    const slug = String(g.slug ?? "").trim();
    if (!exam || !slug) continue;

    const key = `/guides/${exam}/${slug}`;
    if (seen.has(key)) continue; // ★ 重複ガード
    seen.add(key);

    paths.push({ params: { exam, slug } });
  }

  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<{ guide: Guide }> = async ({ params }) => {
  const exam = toExamKey(params?.exam);
  const slug = String(params?.slug ?? "").trim();

  const guide =
    allGuides.find(
      (g) => toExamKey((g as any).exam) === exam && String(g.slug ?? "") === slug && g.status !== "draft"
    ) ?? null;

  if (!guide || !exam) return { notFound: true };
  return { props: { guide }, revalidate: 60 };
};

export default function GuidePage({ guide }: InferGetStaticPropsType<typeof getStaticProps>) {
  const MDX = useMDXComponent(guide.body.code);
  const sourcePath = guide._raw?.sourceFilePath ?? `${guide._raw.flattenedPath}.mdx`;
  const editUrl = `https://github.com/Nagae916/qc-ie-consulting-site/edit/main/content/${sourcePath}`;

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <nav className="mb-4 text-sm text-gray-500">
        <Link href="/guides" className="underline">ガイド</Link>
        <span> / </span>
        <Link href={`/guides/${(toExamKey(guide.exam) ?? "qc")}`} className="underline">
          {EXAM_LABEL[toExamKey(guide.exam) as ExamKey] ?? String(guide.exam)}
        </Link>
      </nav>

      <article className="prose max-w-none">
        <h1>{guide.title}</h1>

        <p className="text-sm text-gray-500">
          セクション：{guide.section ?? "未分類"}
          {" ・ "}v{guide.version ?? "1.0.0"}
          {guide.updatedAt ? <>{" ・ "}更新日 {guide.updatedAt}</> : null}
          {" ・ "}
          <a href={editUrl} className="underline" target="_blank" rel="noreferrer">編集する</a>
        </p>

        <MDX />
      </article>
    </main>
  );
}
