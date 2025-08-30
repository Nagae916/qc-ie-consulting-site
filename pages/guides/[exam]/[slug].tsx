// pages/guides/[exam]/[slug].tsx
import type { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import { allGuides, type Guide } from "contentlayer/generated";
import { useMDXComponent } from "next-contentlayer2/hooks";
import Link from "next/link";

// 対応試験の表記（※ "stat" を正しく受ける / "engineer" に統一）
const EXAM_LABEL = {
  qc: "QC検定",
  stat: "統計検定",
  engineer: "技術士試験",
} as const;

type ExamKey = keyof typeof EXAM_LABEL;
type PageProps = { guide: Guide };

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = allGuides
    .filter(
      (g) =>
        g.status !== "draft" &&
        !!EXAM_LABEL[g.exam as ExamKey] && // 未対応の exam は除外
        !!g.slug
    )
    .map((g) => ({ params: { exam: String(g.exam), slug: String(g.slug) } }));

  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<PageProps> = async ({ params }) => {
  const exam = String(params?.exam ?? "");
  const slug = String(params?.slug ?? "");

  const guide = allGuides.find(
    (g) => g.status !== "draft" && String(g.exam) === exam && String(g.slug) === slug
  );

  if (!guide || !EXAM_LABEL[exam as ExamKey]) return { notFound: true };

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
        <Link href={`/guides/${guide.exam}`} className="underline">
          {EXAM_LABEL[guide.exam as ExamKey] ?? String(guide.exam)}
        </Link>
      </nav>

      <article className="prose max-w-none">
        <h1>{guide.title}</h1>

        <p className="text-sm text-gray-500">
          セクション：{guide.section ?? "未分類"}
          {" ・ "}v{guide.version ?? "1.0.0"}
          {guide.updatedAt ? <>{" ・ "}更新日 {guide.updatedAt}</> : null}
          {" ・ "}
          <a href={editUrl} className="underline" target="_blank" rel="noreferrer">
            編集する
          </a>
        </p>

        <MDX />
      </article>
    </main>
  );
}
