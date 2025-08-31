// pages/index.tsx
import Link from "next/link";
import { allGuides, type Guide } from "contentlayer/generated";

/** ========= 基本設定 ========= */
type ExamKey = "qc" | "stat" | "engineer";

const EXAM_LABEL: Record<ExamKey, string> = {
  qc: "品質管理",
  stat: "統計",
  engineer: "技術士",
};

const EXAM_DESC: Record<ExamKey, string> = {
  qc: "現場改善・QC手法の要点をコンパクトに。QC七つ道具／新QC七つ道具など。",
  stat: "検定・推定・管理図など。品質・R&Dで使う統計を実務目線で整理。",
  engineer: "学習計画や要点整理を中心に、効率よく得点力を高めるナレッジ。",
};

// カラールール統一（QC=薄いオレンジ / 統計=青 / 技術士=緑）
const COLORS = {
  qc: {
    badgeDot: "text-[#D26B00]",
    headerBg: "bg-[#FFE5CC]",
    button: "bg-[#F28C28] hover:bg-[#e87f18] text-white",
  },
  stat: {
    badgeDot: "text-[#0058B0]",
    headerBg: "bg-[#CCE5FF]",
    button: "bg-[#2D75D3] hover:bg-[#1f62b5] text-white",
  },
  engineer: {
    badgeDot: "text-[#0F7A35]",
    headerBg: "bg-[#CCF5CC]",
    button: "bg-[#1E9E50] hover:bg-[#198543] text-white",
  },
} as const;

/** ========= ユーティリティ ========= */

// Contentlayer 側の正規化後 exam は信頼できるのでそのまま ExamKey に落とす
const asExamKey = (v: Guide["exam"]): ExamKey | null =>
  v === "qc" || v === "stat" || v === "engineer" ? v : null;

// 並べ替えキー（updatedAt → date）
const sortKey = (g: Guide) => {
  const t =
    Date.parse(String((g as any).updatedAt ?? "")) ||
    Date.parse(String((g as any).date ?? "")) ||
    0;
  return t;
};

/** ========= ページ本体 ========= */

export default function Home() {
  // 下書きは除外
  const docs = allGuides.filter((g) => g.status !== "draft");

  // カテゴリで振り分け
  const byExam: Record<ExamKey, Guide[]> = { qc: [], stat: [], engineer: [] };
  for (const g of docs) {
    const ek = asExamKey(g.exam);
    if (ek) byExam[ek].push(g);
  }

  // 各カテゴリの最新2件
  const pick2 = (arr: Guide[]) => [...arr].sort((a, b) => sortKey(b) - sortKey(a)).slice(0, 2);
  const latest = {
    qc: pick2(byExam.qc),
    stat: pick2(byExam.stat),
    engineer: pick2(byExam.engineer),
  };

  // カテゴリカード（更新履歴付き）
  const CategoryCard = ({ exam }: { exam: ExamKey }) => {
    const color = COLORS[exam];
    const items = latest[exam];

    return (
      <section className="rounded-2xl border border-black/5 bg-white shadow-sm overflow-hidden">
        {/* ヘッダー（色帯） */}
        <div className={`${color.headerBg} px-6 py-4`}>
          <div className="flex items-center gap-2 text-sm text-black/70">
            <span className={`${color.badgeDot}`}>●</span>
            <span>{EXAM_LABEL[exam]}</span>
          </div>
          <h3 className="mt-1 text-xl font-bold text-black">
            {exam === "qc" ? "QC ガイド" : exam === "stat" ? "統計ガイド" : "技術士ガイド"}
          </h3>
          <p className="mt-1 text-sm text-black/70">{EXAM_DESC[exam]}</p>
          <div className="mt-3">
            <Link
              href={`/guides/${exam}`}
              className={`inline-flex items-center rounded-lg px-4 py-2 text-sm font-semibold ${color.button}`}
            >
              {exam === "qc" ? "QCのガイドを見る" : exam === "stat" ? "統計のガイドを見る" : "技術士のガイドを見る"}
            </Link>
          </div>
        </div>

        {/* 更新履歴（各カテゴリの最新2件） */}
        <div className="px-6 py-5">
          <div className="rounded-xl border border-black/10 bg-white">
            <div className="border-b border-black/10 px-4 py-2 text-sm text-black/70">
              更新履歴（最新2件）
            </div>
            <div className="p-4 text-sm">
              {items.length === 0 ? (
                <p className="text-black/50">更新情報はまだありません。</p>
              ) : (
                <ul className="space-y-2">
                  {items.map((g) => (
                    <li key={g._id} className="leading-relaxed">
                      <Link href={g.url} className="text-blue-700 hover:underline">
                        {g.title}
                      </Link>
                      {sortKey(g) > 0 && (
                        <span className="ml-2 text-black/40">
                          {new Date(sortKey(g)).toLocaleDateString("ja-JP")}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      {/* ヒーロー */}
      <section className="rounded-3xl bg-emerald-50 px-8 py-8">
        <h1 className="text-3xl font-extrabold tracking-tight">QC × IE LABO</h1>
        <p className="mt-2 text-black/70">見やすさと親しみやすさを大切に、淡いグリーン基調で設計しました。</p>
      </section>

      {/* 学習ガイドライブラリ：カテゴリカード3つ（各カテゴリの更新履歴を下に表示） */}
      <h2 className="mt-10 text-center text-2xl font-bold">学習ガイドライブラリ</h2>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
        <CategoryCard exam="qc" />
        <CategoryCard exam="stat" />
        <CategoryCard exam="engineer" />
      </div>
    </main>
  );
}
