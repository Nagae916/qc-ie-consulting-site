// pages/guides/index.tsx
import Link from "next/link";
import { allGuides } from "contentlayer/generated";

const EXAM_LABEL = {
  qc: "品質管理",
  stat: "統計",
  engineer: "技術士",
} as const;

const EXAM_DESC: Record<keyof typeof EXAM_LABEL, string> = {
  qc: "統計の基礎〜管理図・検定・推定。現場データで演習。",
  stat: "記述・推測統計／多変量。理解と活用を両立。",
  engineer: "論文構成・キーワード整理。演習添削に対応。",
};

type ExamKey = keyof typeof EXAM_LABEL;

export default function GuidesIndex() {
  // 下書きは除外
  const guides = allGuides.filter((g) => g.status !== "draft");

  // カテゴリごとに配列を必ず用意して undefined を排除
  const byExam: Record<ExamKey, typeof guides> = {
    qc: [],
    stat: [],
    engineer: [],
  };
  for (const g of guides) {
    const key = (g.exam as ExamKey) in EXAM_LABEL ? (g.exam as ExamKey) : "qc";
    byExam[key].push(g);
  }

  const Card = ({ exam }: { exam: ExamKey }) => (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="text-xl font-extrabold mb-1">{EXAM_LABEL[exam]}</h3>
      <p className="text-gray-500 mb-4">{EXAM_DESC[exam]}</p>
      <Link
        href={`/guides/${exam}`}
        className="inline-block rounded-full bg-emerald-600 px-4 py-2 text-white font-semibold hover:bg-emerald-700"
      >
        学習コンテンツを開く
      </Link>
    </div>
  );

  const Section = ({ exam }: { exam: ExamKey }) => (
    <section className="mb-10">
      <h2 className="text-xl font-bold mb-3">
        <Link href={`/guides/${exam}`} className="underline">
          {EXAM_LABEL[exam]}
        </Link>
      </h2>
      <ul className="list-disc pl-6 space-y-1">
        {byExam[exam].map((g) => (
          <li key={`${g.exam}/${g.slug}`}>
            <Link
              href={`/guides/${g.exam}/${g.slug}`}
              className="text-blue-700 underline"
            >
              {g.title}
            </Link>
          </li>
        ))}
        {byExam[exam].length === 0 && (
          <li className="text-gray-500">準備中</li>
        )}
      </ul>
    </section>
  );

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-extrabold mb-6">学習カテゴリ</h1>

      {/* 上段：常時表示の3カード（トップの学習サポート風） */}
      <div className="grid gap-6 md:grid-cols-3 mb-10">
        <Card exam="qc" />
        <Card exam="stat" />
        <Card exam="engineer" />
      </div>

      {/* 下段：カテゴリ別のガイド一覧（0件は準備中） */}
      <Section exam="qc" />
      <Section exam="stat" />
      <Section exam="engineer" />
    </main>
  );
}
