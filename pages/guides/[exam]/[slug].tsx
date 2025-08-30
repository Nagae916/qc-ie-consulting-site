// pages/guides/[exam]/[slug].tsx
import type { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import { allGuides, type Guide } from "contentlayer/generated";
import { useMDXComponent } from "next-contentlayer2/hooks";
import Link from "next/link";

const EXAM_LABEL = {
  qc: "品質管理",
  stat: "統計",
  engineer: "技術士",
} as const;
type ExamKey = keyof typeof EXAM_LABEL;

type PageProps = { guide: Guide };

export const getStaticPaths: GetStaticPaths = async () => {
  // Contentlayer が計算した URL を唯一の真実として使い、Set で重複排除
  const urls = new Set(
    allGuides
      .filter((g) => g.status !== "draft" && typeof g.url === "string" && g.url.startsWith("/guides/"))
      .map((g) => g.url!)
  );

  const paths = Array.from(urls).map((u) => {
    const [, , exam, slug] = u.split("/");
    return { params: { exam, slug } };
  });

  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<PageProps> = async ({ params }) => {
  const exam = String(params?.exam ?? "");
  const slug = String(params?.slug ?? "");
  const targetUrl = `/guides/${exam}/${slug}`;

  const guide = allGuides.find((g) => g.status !== "draft" && g.url === targetUrl);
  if (!guide || !(guide.exam in EXAM_LABEL)) return { notFound: true };

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
