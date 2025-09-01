// pages/guides/index.tsx
import Link from "next/link";
import { allGuides, type Guide } from "contentlayer/generated";

/* ========= 基本 ========= */
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

const THEME: Record<
  ExamKey,
  { accent: string; title: string; link: string; pillBg: string; pillBorder: string; btn: string; btnHover: string }
> = {
  qc:       { accent: "bg-amber-300/70",   title: "text-amber-800",   link: "text-amber-700 hover:text-amber-800",
              pillBg: "bg-amber-50 text-amber-800",   pillBorder: "border-amber-200",
              btn: "bg-amber-500",   btnHover: "hover:bg-amber-600" },
  stat:     { accent: "bg-sky-300/70",     title: "text-sky-800",     link: "text-sky-700 hover:text-sky-800",
              pillBg: "bg-sky-50 text-sky-800",       pillBorder: "border-sky-200",
              btn: "bg-sky-600",     btnHover: "hover:bg-sky-700" },
  engineer: { accent: "bg-emerald-300/70", title: "text-emerald-800", link: "text-emerald-700 hover:text-emerald-800",
              pillBg: "bg-emerald-50 text-emerald-800", pillBorder: "border-emerald-200",
              btn: "bg-emerald-600", btnHover: "hover:bg-emerald-700" },
};

const toExamKey = (v: unknown): ExamKey | null => {
  const s = String(v ?? "").toLowerCase().trim();
  if (s === "qc") return "qc";
  if (s === "stat" || s === "stats" || s === "statistics") return "stat";
  if (s === "engineer" || s === "pe" || s === "eng") return "engineer";
  return null;
};

/* ========= 安全ユーティリティ ========= */
// UTC固定の YYYY-MM-DD（SSR/CSR差の再発防止）
const formatYMD = (v1?: unknown, v2?: unknown): string => {
  const s = String(v1 ?? v2 ?? "").trim();
  if (!s) return "";
  const m = s.match(/^(\d{4})[-/](\d{2})[-/](\d{2})/);
  if (m) return `${m[1]}-${m[2]}-${m[3]}`;
  const t = Date.parse(s);
  if (!Number.isFinite(t)) return "";
  const d = new Date(t);
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
};

const guideHref = (g: Guide, fallbackExam: ExamKey) => {
  if (typeof (g as any).url === "string" && (g as any).url.startsWith("/guides/")) {
    return (g as any).url as string;
  }
  const exam = toExamKey((g as any).exam) ?? fallbackExam;
  const slug = String((g as any).slug ?? g._raw?.flattenedPath?.split("/").pop() ?? "").trim();
  return `/guides/${exam}/${slug}`;
};

// 並べ替えキー：updatedAtAuto > updatedAt > date
const timeKey = (g: Guide): number =>
  Date.parse(
    String((g as any).updatedAtAuto ?? (g as any).updatedAt ?? (g as any).date ?? "")
  ) || 0;

/* ========= データ整形 ========= */
const published = allGuides.filter((g) => (g as any).status !== "draft");

// カテゴリごとに配列（未知カテゴリは捨てる）
const byExam: Record<ExamKey, Guide[]> = { qc: [], stat: [], engineer: [] };
for (const g of published) {
  const exam = toExamKey((g as any).exam) ?? null;
  if (exam) byExam[exam].push(g);
}

// 各カテゴリを日付降順に並べ替え
for (const k of Object.keys(byExam) as ExamKey[]) {
  byExam[k] = [...byExam[k]].sort((a, b) => timeKey(b) - timeKey(a));
}

/* ========= UI ========= */
function Card({ exam }: { exam: ExamKey }) {
  const t = THEME[exam];
  return (
    <div className="rounded-2xl border border-black/5 bg-white shadow-sm">
      <div className={`h-1 w-full rounded-t-2xl ${t.accent}`} />
      <div className="p-6">
        <h3 className={`text-xl font-extrabold mb-1 ${t.title}`}>{EXAM_LABEL[exam]}</h3>
        <p className="text-gray-600 mb-4">{EXAM_DESC[exam]}</p>
        <Link
          href={`/guides/${exam}`}
          className={`inline-block rounded-full ${t.btn} ${t.btnHover} px-4 py-2 text-white font-semibold`}
        >
          学習コンテンツを開く
        </Link>
      </div>
    </div>
  );
}

function Updates({ exam }: { exam: ExamKey }) {
  const items = byExam[exam].slice(0, 2); // ★ 最新2件だけ
  const t = THEME[exam];
  return (
    <section className="mb-10">
      <h4 className={`text-sm font-semibold mb-2 ${t.title}`}>更新（最新2件）</h4>
      {items.length === 0 ? (
        <p className="text-sm text-gray-500">準備中</p>
      ) : (
        <ul className="space-y-2">
          {items.map((g) => {
            const href = guideHref(g, exam);
            const ymd = formatYMD((g as any).updatedAtAuto ?? (g as any).updatedAt, (g as any).date);
            return (
              <li key={g._id} className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm">
                <Link href={href} className={`block font-medium ${t.link}`}>
                  {(g as any).title}
                </Link>
                <div className="text-xs text-gray-500" suppressHydrationWarning>
                  {ymd ? `更新: ${ymd}` : ""}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

export default function GuidesTop() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-extrabold mb-6">学習カテゴリ</h1>

      {/* 上段：3カード */}
      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <Card exam="qc" />
        <Card exam="stat" />
        <Card exam="engineer" />
      </div>

      {/* 下段：カテゴリごとの最新2件 */}
      <div className="grid gap-8 md:grid-cols-3">
        <div>
          <h2 className="text-xl font-bold mb-3">
            <Link href="/guides/qc" className="underline">{EXAM_LABEL.qc}</Link>
          </h2>
          <Updates exam="qc" />
        </div>
        <div>
          <h2 className="text-xl font-bold mb-3">
            <Link href="/guides/stat" className="underline">{EXAM_LABEL.stat}</Link>
          </h2>
          <Updates exam="stat" />
        </div>
        <div>
          <h2 className="text-xl font-bold mb-3">
            <Link href="/guides/engineer" className="underline">{EXAM_LABEL.engineer}</Link>
          </h2>
          <Updates exam="engineer" />
        </div>
      </div>
    </main>
  );
}
