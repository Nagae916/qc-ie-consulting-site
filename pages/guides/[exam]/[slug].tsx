// pages/guides/[exam]/[slug].tsx
import type { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import { allGuides, type Guide } from "contentlayer/generated";
import { useMDXComponent } from "next-contentlayer/hooks";
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
    <article className="prose max-w-none">
      <div className="text-sm text-gray-500">
        <Link href="/guides" className="underline">Guides</Link> /{" "}
        <Link href={`/guides/${guide.exam}`} className="underline">{EXAM_LABEL[guide.exam]}</Link>
      </div>
      <h1>{guide.title}</h1>
      <p className="text-sm text-gray-500">
        セクション：{guide.section ?? "未分類"} ・ v{guide.version} ・ 更新日 {guide.updatedAt} ・{" "}
        <Link
          href={`https://github.com/your-org/your-repo/edit/main/content/guides/${guide._raw.flattenedPath}.mdx`}
          className="underline"
        >
          編集する
        </Link>
      </p>
      <MDX />
    </article>
  );
}
