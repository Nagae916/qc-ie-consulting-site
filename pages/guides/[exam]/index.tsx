// pages/guides/[exam]/index.tsx
import Link from "next/link";
import type { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import { allGuides, type Guide } from "contentlayer/generated";

// ---- 基本定義 -------------------------------------------------------------
type ExamKey = "qc" | "stat" | "engineer";

const EXAM_LABEL: Record<ExamKey, string> = {
  qc: "品質管理",
  stat: "統計",
  engineer: "技術士",
};

const THEME: Record<
  ExamKey,
  { border: string; accent: string; title: string; pillBg: string; pillBorder: string; btn: string; btnHover: string }
> = {
  qc:       { border: "border-amber-200",   accent: "bg-amber-300/70",   title: "text-amber-800",   pillBg: "bg-amber-50 text-amber-800",   pillBorder: "border-amber-200",   btn: "bg-amber-500",   btnHover: "hover:bg-amber-600" },
  stat:     { border: "border-sky-200",     accent: "bg-sky-300/70",     title: "text-sky-800",     pillBg: "bg-sky-50 text-sky-800",       pillBorder: "border-sky-200",     btn: "bg-sky-600",     btnHover: "hover:bg-sky-700" },
  engineer: { border: "border-emerald-200", accent: "bg-emerald-300/70", title: "text-emerald-800", pillBg: "bg-emerald-50 text-emerald-800", pillBorder: "border-emerald-200", btn: "bg-emerald-600", btnHover: "hover:bg-emerald-700" },
};

const toExamKey = (v: unknown): ExamKey | null => {
  const s = String(v ?? "").toLowerCase().trim();
  if (s === "qc") return "qc";
  if (s === "stat" || s === "stats" || s === "statistics") return "stat";
  if (s === "engineer" || s === "pe" || s === "eng") return "engineer";
  return null;
};

// ---- 依存なしの安全ユーティリティ -----------------------------------------
const safeTags = (v: unknown): string[] => {
  if (Array.isArray(v)) return v.map((x) => String(x ?? "")).filter(Boolean);
  if (typeof v === "string") return v.split(/[,\s]+/).map((s) => s.trim()).filter(Boolean);
  return [];
};
const safeDate = (v1?: unknown, v2?: unknown) => {
  const s = String(v1 ?? v2 ?? "");
  const t = Date.parse(s);
  return Number.isFinite(t) ? new Date(t) : null;
};
const guideHref = (g: Guide, fallbackExam: ExamKey) => {
  if (typeof (g as any).url === "string" && (g as any).url.startsWith("/guides/")) {
    return (g as any).url as string;
  }
  const exam = toExamKey((g as any).exam) ?? fallbackExam;
  const slug = String((g as any).slug ?? g._raw?.flattenedPath?.split("/").pop() ?? "").trim();
  return `/guides/${exam}/${slug}`;
};

// ---- SSG -------------------------------------------------------------------
export const getStaticPaths: GetStaticPaths = async () => ({
  paths: (["qc", "stat", "engineer"] as ExamKey[]).map((exam) => ({ params: { exam } })),
  fallback: false,
});

export const getStaticProps: GetStaticProps<{ exam: ExamKey }> = async ({ params }) => {
  const exam = toExamKey(params?.exam);
  if (!exam) return { notFound: true };
  return { props: { exam }, revalidate: 60 };
};

// ---- Page ------------------------------------------------------------------
export default function ExamIndex({ exam }: InferGetStaticPropsType<typeof getStaticProps>) {
  // 下書き除外 → セクション → 日付降順
  const guides = allGuides
    .filter((g) => toExamKey((g as any).exam) === exam && (g as any).status !== "draft")
    .sort((a, b) => {
      const secCmp = String((a as any).section ?? "").localeCompare(String((b as any).section ?? ""));
      if (secCmp !== 0) return secCmp;
      const ta = Date.parse(String((a as any).updatedAt ?? (a as any).date ?? "")) || 0;
      const tb = Date.parse(String((b as any).updatedAt ?? (b as any).date ?? "")) || 0;
      return tb - ta;
    });

  const t = THEME[exam];

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <div className="text-sm text-gray-500">
        <Link href="/guides" className="underline">ガイド</Link> / {EXAM_LABEL[exam]}
      </div>

      <h1 className="mt-2 text-2xl md:text-3xl font-extrabold">{EXAM_LABEL[exam]} 一覧</h1>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {guides.map((g) => {
          const href = guideHref(g, exam);
          const tags = safeTags((g as any).tags).slice(0, 4);
          const d = safeDate((g as any).updatedAt, (g as any).date);
          const updated = d ? d.toLocaleDateString("ja-JP") : "";

          return (
            <article key={g._id} className={`rounded-2xl border shadow-sm bg-white ${t.border}`}>
              <div className={`h-1 w-full rounded-t-2xl ${t.accent}`} />
              <div className="p-5">
                <h2 className="text-lg font-bold leading-snug">
                  <Link href={href} className={`${t.title} hover:underline`}>{(g as any).title}</Link>
                </h2>

                {(g as any).section || tags.length ? (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {(g as any).section && (
                      <span className={`inline-flex items-center rounded-full ${t.pillBg} ${t.pillBorder} border px-2 py-0.5 text-xs`}>
                        {(g as any).section}
                      </span>
                    )}
                    {tags.map((tag) => (
                      <span key={tag} className={`inline-flex items-center rounded-full ${t.pillBg} ${t.pillBorder} border px-2 py-0.5 text-xs`}>
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : null}

                {(g as any).description ? (
                  <p className="mt-3 text-sm text-gray-700 line-clamp-3">{(g as any).description}</p>
                ) : null}

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-gray-500">{updated ? `更新: ${updated}` : ""}</span>
                  <Link href={href} className={`inline-block rounded-full ${t.btn} ${t.btnHover} text-white text-sm font-semibold px-3 py-1.5`}>
                    開く
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {guides.length === 0 && <p className="text-gray-500 mt-6">公開中のガイドはまだありません。</p>}
    </main>
  );
}
