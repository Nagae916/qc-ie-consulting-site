// pages/guides/index.tsx
import Link from "next/link";
import { allGuides } from "contentlayer/generated";

const EXAM_LABEL = {
  qc: "QC検定",
  stat: "統計検定",
  engineer: "技術士試験",
} as const;

type ExamKey = keyof typeof EXAM_LABEL;

export default function GuidesIndex() {
  // draft を除外
  const guides = allGuides.filter((g) => g.status !== "draft");

  // 初期化時点で必ずキーを持たせる
  const byExam: Record<ExamKey, typeof guides> = {
    qc: [],
    stat: [],
    engineer: [],
  };

  for (const g of guides) {
    const key: ExamKey = (g.exam as ExamKey) in EXAM_LABEL ? (g.exam as ExamKey) : "qc";
    byExam[key].push(g); // ← undefined の可能性がなくなる
  }

  const Section = ({ exam }: { exam: ExamKey }) => (
    <section className="mb-8">
      <h2 className="text-xl font-bold mb-2">
        <Link href={`/guides/${exam}`} className="underline">
          {EXAM_LABEL[exam]}
        </Link>
      </h2>
      <ul className="list-disc pl-6 space-y-1">
        {byExam[exam].map((g) => (
          <li key={`${g.exam}/${g.slug}`}>
            <Link href={`/guides/${g.exam}/${g.slug}`} className="text-blue-700 underline">
              {g.title}
            </Link>
          </li>
        ))}
        {byExam[exam].length === 0 && <li className="text-gray-500">準備中</li>}
      </ul>
    </section>
  );

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-2xl font-extrabold mb-6">ガイド一覧</h1>
      <Section exam="qc" />
      <Section exam="stat" />
      <Section exam="engineer" />
    </main>
  );
}
