// pages/guides/index.tsx
import Link from "next/link";
import type { GetStaticProps } from "next";
import { allGuides } from "contentlayer/generated";

export const getStaticProps: GetStaticProps = async () => ({ props: {}, revalidate: 60 });

const EXAM_LABEL: Record<string, string> = {
  qc: "QC検定",
  stats: "統計検定",
  pe: "技術士試験",
};

export default function GuidesHome() {
  const groups = Object.groupBy(
    allGuides.filter((g) => g.status !== "draft"),
    (g) => g.exam as keyof typeof EXAM_LABEL
  );
  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-semibold">Guides Library</h1>
      <div className="grid gap-6 md:grid-cols-3">
        {Object.entries(EXAM_LABEL).map(([key, label]) => {
          const cnt = (groups[key as keyof typeof EXAM_LABEL] || []).length;
          return (
            <Link key={key} href={`/guides/${key}`} className="block rounded-lg border p-5 hover:shadow">
              <h2 className="font-semibold">{label}</h2>
              <div className="text-sm text-gray-500 mt-1">{cnt} 本</div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
