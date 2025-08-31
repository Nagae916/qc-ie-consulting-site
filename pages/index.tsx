// pages/index.tsx
import Link from "next/link";
import { allGuides, type Guide } from "contentlayer/generated";

/** ===== 基本設定 ===== */
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

// トーン統一（QC=薄いオレンジ / 統計=青 / 技術士=緑）
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

/** ===== 共通ユーティリティ（既存 guides/index.tsx に準拠） ===== */

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

// 並び替えキー（更新日優先）
function getSortKey(g: Guide) {
  // updatedAt が無いケースもあるため冗長に吸収
  const t =
    Date.parse(String((g as any).updated ?? "")) ||
    Date.parse(String((g as any).updatedAt ?? "")) ||
    Date.parse(String((g as any).date ?? "")) ||
    Date.parse(String((g as any).publishedAt ?? "")) ||
    0;
  return t;
}

/** ===== ページ本体 ===== */

export default function Home() {
  // 下書き除外
  const guides = allGuides.filter((g) => g.status !== "draft");

  // カテゴリごとに振り分け
  const byExam: Record<ExamKey, Guide[]> = { qc: [], stat: [], engineer: [] };
  for (const g of guides) {
    const cat = detectCategory(g);
    if (cat) byExam[cat].push(g);
  }

  // 各カテゴリで最新2件を抽出
  const latest2 = (arr: Guide[]) => [...arr].sort((a, b) => getSortKey(b) - getSortKey(a)).slice(0, 2);

  const latest = {
    qc: latest2(byExam.qc),
    stat: latest2(byExam.stat),
    engineer: latest2(byExam.engineer),
  };

  // ガイドへのリンク生成
  const guideHref = (exam: ExamKey, g: Guide) => {
    const slug = g.slug || g._raw.flattenedPath.split("/").pop();
    return `/guides/${exam}/${slug}`;
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

        {/* 更新履歴（最新2件） */}
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
                      <Link href={guideHref(exam, g)} className="text-blue-700 hover:underline">
                        {g.title}
                      </Link>
                      {getSortKey(g) > 0 && (
                        <span className="ml-2 text-black/40">
                          {new Date(getSortKey(g)).toLocaleDateString("ja-JP")}
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

      {/* ライブラリ：3カテゴリ（各カテゴリ配色＋更新履歴2件） */}
      <h2 className="mt-10 text-center text-2xl font-bold">学習ガイドライブラリ</h2>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
        <CategoryCard exam="qc" />
        <CategoryCard exam="stat" />
        <CategoryCard exam="engineer" />
      </div>
    </main>
  );
}
