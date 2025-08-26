// pages/guides/[exam]/[slug].tsx
import type { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import { allGuides, type Guide } from "contentlayer/generated";
import { useMDXComponent } from "next-contentlayer2/hooks";
import Link from "next/link";

// 対応試験の表記を定義（ここにない exam はビルド対象外に）
const EXAM_LABEL = {
  qc: "QC検定",
  stats: "統計検定",
  pe: "技術士試験",
} as const;

type ExamKey = keyof typeof EXAM_LABEL;
type PageProps = { guide: Guide };

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = allGuides
    .filter((g) => g.status !== "draft" && !!EXAM_LABEL[g.exam as ExamKey] && !!g.slug)
    .map((g) => ({ params: { exam: String(g.exam), slug: String(g.slug) } }));

  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<PageProps> = async ({ params }) => {
  const exam = String(params?.exam ?? "");
  const slug = String(params?.slug ?? "");

  // exam/slug が一致、かつドラフト以外のみ
  const guide = allGuides.find(
    (g) => g.status !== "draft" && String(g.exam) === exam && String(g.slug) === slug
  );

  // 未対応 exam も 404
  if (!guide || !EXAM_LABEL[exam as ExamKey]) return { notFound: true };

  // ISR（必要に応じて値を調整）
  return { props: { guide }, revalidate: 60 };
};

export default function GuidePage({ guide }: InferGetStaticPropsType<typeof getStaticProps>) {
  const MDX = useMDXComponent(guide.body.code);

  // GitHub 編集リンクは Contentlayer の生ファイルパスを使うと安全
  // _raw.sourceFilePath 例: "guides/qc/pareto.mdx"
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
