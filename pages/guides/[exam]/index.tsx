// pages/guides/[exam]/index.tsx
import Link from "next/link";
import type { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import { allGuides, type Guide } from "contentlayer/generated";

const EXAM_LABEL: Record<string, string> = {
  qc: "QC検定",
  stats: "統計検定",
  pe: "技術士試験",
};

export const getStaticPaths: GetStaticPaths = async () => {
  const exams = Array.from(
    new Set(allGuides.map((g) => g.exam))
  ).filter((e): e is keyof typeof EXAM_LABEL => e in EXAM_LABEL);
  return { paths: exams.map((exam) => ({ params: { exam } })), fallback: false };
};

export const getStaticProps: GetStaticProps<{ exam: keyof typeof EXAM_LABEL }> = async ({ params }) => {
  const exam = String(params?.exam) as keyof typeof EXAM_LABEL;
  if (!EXAM_LABEL[exam]) return { notFound: true };
  return { props: { exam }, revalidate: 60 };
};

export default function ExamIndex({ exam }: InferGetStaticPropsType<typeof getStaticProps>) {
  const guides = allGuides
    .filter((g) => g.exam === exam && g.status !== "draft")
    .sort((a, b) =>
      // 1) セクション名で昇順
      (a.section ?? "").localeCompare(b.section ?? "") ||
      // 2) 更新日で降順（ISO/日付文字列を安全に比較）
      (new Date(b.updatedAt ?? 0).getTime() - new Date(a.updatedAt ?? 0).getTime())
    );

  // bySection の型を明示（補完＆保守性UP）
  const bySection = new Map<string, typeof guides[number][]>();
  for (const g of guides) {
    const sec = g.section ?? "未分類";
    if (!bySection.has(sec)) bySection.set(sec, []);
    bySection.get(sec)!.push(g);
  }

  return (
    <section className="space-y-6">
      <div className="text-sm text-gray-500">
        <Link href="/guides" className="underline">ガイド</Link> / {EXAM_LABEL[exam]}
      </div>

      <h1 className="text-2xl font-semibold">{EXAM_LABEL[exam]} 一覧</h1>

      {[...bySection.entries()].map(([sec, items]) => (
        <div key={sec} className="space-y-2">
          <h2 className="text-lg font-semibold">{sec}</h2>
          <ul className="divide-y rounded-lg border">
            {items.map((g) => (
              <li key={g.slug} className="p-3">
                <Link href={g.url} className="font-medium hover:underline">
                  {g.title}
                </Link>
                <div className="text-sm text-gray-500">
                  v{g.version ?? "1.0.0"} ・ 更新日 {g.updatedAt ?? "—"}
                </div>
                {g.tags?.length ? (
                  <div className="mt-1 text-xs text-gray-500">#{g.tags.join(" #")}</div>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}
