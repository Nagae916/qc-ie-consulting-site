// pages/guides/qc/[slug].tsx
import type { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import { allGuides, type Guide } from "contentlayer/generated";
import { useMDXComponent } from "next-contentlayer2/hooks";
import Link from "next/link";

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = allGuides
    .filter(g => g.status !== "draft")
    .map(g => ({ params: { slug: g.slug } }));
  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<{ guide: Guide }> = async ({ params }) => {
  const slug = String(params?.slug);
  const guide = allGuides.find(g => g.slug === slug && g.status !== "draft");
  if (!guide) return { notFound: true };
  return { props: { guide }, revalidate: 60 };
};

export default function GuidePage({ guide }: InferGetStaticPropsType<typeof getStaticProps>) {
  const MDX = useMDXComponent(guide.body.code);

  return (
    <article className="prose max-w-none">
      <div className="text-sm text-gray-500">
        <Link href="/guides" className="underline">ガイド</Link> /{" "}
        <Link href="/guides/qc" className="underline">QC検定</Link>
      </div>
      <h1>{guide.title}</h1>
      <p className="text-sm text-gray-500">
        セクション：{guide.section ?? "はじめに"} ・ v{guide.version} ・ 更新日 {guide.updatedAt} ・{" "}
        <Link
          href={`https://github.com/your-org/your-repo/edit/main/content/guides/qc/${guide._raw.flattenedPath.split("/").slice(-1)[0]}`}
          className="underline"
        >
          編集する
        </Link>
      </p>
      <MDX />
    </article>
  );
}
