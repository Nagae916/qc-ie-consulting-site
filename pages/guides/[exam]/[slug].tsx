// pages/guides/[exam]/[slug].tsx
import type { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import { allGuides, type Guide } from "contentlayer/generated";
import { useMDXComponent } from "next-contentlayer2/hooks";
import Link from "next/link";

const EXAM_LABEL = { qc: "品質管理", stat: "統計", engineer: "技術士" } as const;
type ExamKey = keyof typeof EXAM_LABEL;
type PageProps = { guide: Guide };

export const getStaticPaths: GetStaticPaths = async () => {
  // draft を除外しつつ exam/slug をキーに厳密に一意化
  const uniq = new Map<string, { exam: string; slug: string }>();
  for (const g of allGuides) {
    if (g.status === "draft") continue;

    // Contentlayer の computed 値を信頼
    const exam = String((g as any).exam || "").toLowerCase();
    const slug = String((g as any).slug || "").toLowerCase();
    if (!exam || !slug) continue;

    const key = `${exam}/${slug}`;
    if (!uniq.has(key)) uniq.set(key, { exam, slug });
  }

  const paths = Array.from(uniq.values()).map(({ exam, slug }) => ({
    params: { exam, slug },
  }));

  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<PageProps> = async ({ params }) => {
  const exam = String(params?.exam ?? "").toLowerCase();
  const slug = String(params?.slug ?? "").toLowerCase();

  // exam/slug 完全一致の1件のみ採用
  const guide = allGuides.find(
    (g) =>
      g.status !== "draft" &&
      String((g as any).exam).toLowerCase() === exam &&
      String((g as any).slug).toLowerCase() === slug
  );

  if (!guide || !(guide.exam as string in EXAM_LABEL)) return { notFound: true };
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
          <a href={editUrl} className="underline" target="_blank" rel="noreferrer">編集する</a>
        </p>
        <MDX />
      </article>
    </main>
  );
}
