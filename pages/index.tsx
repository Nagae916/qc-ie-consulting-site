// pages/guides/index.tsx
import Link from "next/link";
import { allGuides, type Guide } from "contentlayer/generated";

type ExamKey = "qc" | "stat" | "engineer";

const EXAM_LABEL: Record<ExamKey, string> = {
  qc: "品質管理",
  stat: "統計",
  engineer: "技術士",
};

const EXAM_DESC: Record<ExamKey, string> = {
  qc: "統計の基礎〜管理図・検定・推定。現場データで演習。",
  stat: "記述・推測統計／多変量。理解と活用を両立。",
  engineer: "論文構成・キーワード整理。演習添削に対応。",
};

// frontmatter の exam 値を正規化
function normalizeExamValue(v: unknown): ExamKey | null {
  const s = String(v ?? "").toLowerCase().trim();
  if (s === "qc") return "qc";
  if (s === "stat" || s === "stats" || s === "statistics") return "stat";
  if (s === "engineer" || s === "pe" || s === "eng") return "engineer";
  return null;
}

// パス優先のカテゴリ検出（最優先）→ だめなら frontmatter を使用
function detectCategory(g: Guide): ExamKey | null {
  const p = String(g._raw?.sourceFilePath ?? g._raw?.flattenedPath ?? "").toLowerCase();
  if (p.includes("/guides/qc/")) return "qc";
  if (p.includes("/guides/stat/")) return "stat";
  if (p.includes("/guides/engineer/")) return "engineer";
  return normalizeExamValue((g as any).exam);
}

export default function GuidesIndex() {
  // 下書きは除外
  const guides = allGuides.filter((g) => g.status !== "draft");

  // カテゴリごとに配列を必ず用意（未知カテゴリは混ぜない＝破棄）
  const byExam: Record<ExamKey, Guide[]> = { qc: [], stat: [], engineer: [] };
  for (const g of guides) {
    const cat = detectCategory(g);
    if (cat) byExam[cat].push(g);
  }

  // セクション → 更新日降順で並べ替え
  const sortGuides = (arr: Guide[]) =>
    [...arr].sort((a, b) => {
      const secCmp = (a.section ?? "").localeCompare(b.section ?? "");
      if (secCmp !== 0) return secCmp;
      const ta = Date.parse(String(a.updatedAt ?? "")) || 0;
      const tb = Date.parse(String(b.updatedAt ?? "")) || 0;
      return tb - ta;
    });

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

  const Section = ({ exam }: { exam: ExamKey }) => {
    const items = sortGuides(byExam[exam]);
    return (
      <section className="mb-10">
        <h2 className="text-xl font-bold mb-3">
          <Link href={`/guides/${exam}`} className="underline">
            {EXAM_LABEL[exam]}
          </Link>
        </h2>
        <ul className="list-disc pl-6 space-y-1">
          {items.map((g) => {
            const slug = g.slug || g._raw.flattenedPath.split("/").pop();
            const href = `/guides/${exam}/${slug}`;
            return (
              <li key={g._id}>
                <Link href={href} className="text-blue-700 underline">
                  {g.title}
                </Link>
              </li>
            );
          })}
          {items.length === 0 && <li className="text-gray-500">準備中</li>}
        </ul>
      </section>
    );
  };

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-extrabold mb-6">学習カテゴリ</h1>

      {/* 上段：常時表示の3カード */}
      <div className="grid gap-6 md:grid-cols-3 mb-10">
        <Card exam="qc" />
        <Card exam="stat" />
        <Card exam="engineer" />
      </div>

      {/* 下段：カテゴリ別のガイド一覧 */}
      <Section exam="qc" />
      <Section exam="stat" />
      <Section exam="engineer" />
    </main>
  );
}
