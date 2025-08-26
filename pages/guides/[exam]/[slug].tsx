// pages/guides/[exam]/[slug].tsx
import type { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import { allGuides, type Guide } from "contentlayer2/generated"; // ← ここを contentlayer2 に
import { useMDXComponent } from "next-contentlayer2/hooks";
import Link from "next/link";

const EXAM_LABEL: Record<string, string> = {
  qc: "QC検定",
  stats: "統計検定",
  pe: "技術士試験",
};

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = allGuides
    .filter((g) => g.status !== "draft" && EXAM_LABEL[g.exam])
    .map((g) => ({ params: { exam: g.exam, slug: g.slug } }));
  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<{ guide: Guide }> = async ({ params }) => {
  const exam = String(params?.exam);
  const slug = String(params?.slug);
  const guide = allGuides.find((g) => g.exam === exam && g.slug === slug && g.status !== "draft");
  if (!guide || !EXAM_LABEL[exam]) return { notFound: true };
  return { props: { guide }, revalidate: 60 };
};

export default function GuidePage({ guide }: InferGetStaticPropsType<typeof getStaticProps>) {
  const MDX = useMDXComponent(guide.body.code);
  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <div className="text-sm text-gray-500 mb-4">
        <Link href="/guides" className="underline">ガイド</Link> /{" "}
        <Link href={`/guides/${guide.exam}`} className="underline">{EXAM_LABEL[guide.exam]}</Link>
      </div>

      <article className="prose max-w-none">
        <h1>{guide.title}</h1>
        <p className="text-sm text-gray-500">
          セクション：{guide.section ?? "未分類"} ・ v{guide.version} ・ 更新日 {guide.updatedAt} ・{" "}
          <Link
            href={`https://github.com/Nagae916/qc-ie-consulting-site/edit/main/content/guides/${guide._raw.flattenedPath}.mdx`}
            className="underline"
          >
            編集する
          </Link>
        </p>
        <MDX />
      </article>
    </main>
  );
}
