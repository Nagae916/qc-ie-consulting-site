// pages/guides/[exam]/index.tsx
import Head from "next/head";
import Link from "next/link";
import type { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import { allGuides, type Guide } from "contentlayer/generated";

/* ========= 基本 ========= */
type ExamKey = "qc" | "stat" | "engineer";
const EXAM_LABEL: Record<ExamKey, string> = { qc: "品質管理", stat: "統計", engineer: "技術士" };

const THEME: Record<
  ExamKey,
  { border: string; accent: string; title: string; pillBg: string; pillBorder: string; btn: string; btnHover: string }
> = {
  qc:       { border: "border-amber-200",   accent: "bg-amber-300/70",     title: "text-amber-800",
              pillBg: "bg-amber-50 text-amber-800",   pillBorder: "border-amber-200",
              btn: "bg-amber-500",   btnHover: "hover:bg-amber-600" },
  stat:     { border: "border-sky-200",     accent: "bg-sky-300/70",       title: "text-sky-800",
              pillBg: "bg-sky-50 text-sky-800",       pillBorder: "border-sky-200",
              btn: "bg-sky-600",     btnHover: "hover:bg-sky-700" },
  engineer: { border: "border-emerald-200", accent: "bg-emerald-300/70",   title: "text-emerald-800",
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
const safeTags = (v: unknown): string[] => {
  if (Array.isArray(v)) return v.map((x) => String(x ?? "")).filter(Boolean);
  if (typeof v === "string") return v.split(/[,\s]+/).map((s) => s.trim()).filter(Boolean);
  return [];
};

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
  if (typeof (g as any).url === "string" && (g as any).url.startsWith("/guides/")) return (g as any).url as string;
  const exam = toExamKey((g as any).exam) ?? fallbackExam;
  const slug = String((g as any).slug ?? g._raw?.flattenedPath?.split("/").pop() ?? "").trim();
  return `/guides/${exam}/${slug}`;
};

// 並べ替えキー：updatedAtAuto > updatedAt > date
const timeKey = (g: Guide): number =>
  Date.parse(String((g as any).updatedAtAuto ?? (g as any).updatedAt ?? (g as any).date ?? "")) || 0;

// ✅ ジェネリックで元の型を保持しつつ href 基準で重複排除
const uniqByHref = <T extends { href: string }>(arr: T[]): T[] => {
  const seen = new Set<string>();
  return arr.filter((item) => (item.href && !seen.has(item.href) ? (seen.add(item.href), true) : false));
};

/* ========= SSG ========= */
export const getStaticPaths: GetStaticPaths = async () => ({
  paths: (["qc", "stat", "engineer"] as ExamKey[]).map((exam) => ({ params: { exam } })),
  fallback: false,
});

export const getStaticProps: GetStaticProps<{ exam: ExamKey }> = async ({ params }) => {
  const exam = toExamKey(params?.exam);
  if (!exam) return { notFound: true };
  return { props: { exam }, revalidate: 1800 }; // 30分ISR
};

/* ========= Page ========= */
type Card = {
  g: Guide;
  href: string;
  tags: string[];
  updatedYmd: string;
  title: string;
  description?: string;
  section?: string;
};

export default function ExamIndex({ exam }: InferGetStaticPropsType<typeof getStaticProps>) {
  // 下書き除外 → セクション優先 → 更新日降順（updatedAtAuto優先）
  const guidesEnriched: Card[] = allGuides
    .filter((g) => toExamKey((g as any).exam) === exam && (g as any).status !== "draft")
    .sort((a, b) => {
      const secCmp = String((a as any).section ?? "").localeCompare(String((b as any).section ?? ""));
      if (secCmp !== 0) return secCmp;
      return timeKey(b) - timeKey(a);
    })
    .map((g) => ({
      g,
      href: guideHref(g, exam),
      tags: safeTags((g as any).tags).slice(0, 4),
      updatedYmd: formatYMD((g as any).updatedAtAuto ?? (g as any).updatedAt, (g as any).date),
      title: (g as any).title ?? "(no title)",
      description: (g as any).description as string | undefined,
      section: (g as any).section as string | undefined,
    }));

  // 重複ガード（href 基準）
  const guides = uniqByHref<Card>(guidesEnriched);

  const t = THEME[exam];

  return (
    <>
      <Head>
        <title>{EXAM_LABEL[exam]}ガイド一覧 | QC × IE LABO</title>
        <meta name="description" content={`${EXAM_LABEL[exam]}カテゴリのガイド一覧`} />
      </Head>

      <main className="mx-auto max-w-6xl px-4 py-10">
        <div className="text-sm text-gray-500">
          <Link href="/" className="underline">トップ</Link> / <Link href="/guides" className="underline">ガイド</Link> / {EXAM_LABEL[exam]}
        </div>

        <h1 className={`mt-2 text-2xl md:text-3xl font-extrabold ${t.title}`}>{EXAM_LABEL[exam]} 一覧</h1>

        {/* 2カラムのカードレイアウト（大画面は3カラムでも違和感なし） */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {guides.map(({ g, href, tags, updatedYmd, title, description, section }) => (
            <article key={g._id} className={`rounded-2xl border shadow-sm bg-white ${t.border}`}>
              <div className={`h-1 w-full rounded-t-2xl ${t.accent}`} />
              <div className="p-5">
                <h2 className="text-lg font-bold leading-snug">
                  <Link href={href} className={`${t.title} hover:underline`}>{title}</Link>
                </h2>

                {(section || tags.length) && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {section && (
                      <span className={`inline-flex items-center rounded-full ${t.pillBg} ${t.pillBorder} border px-2 py-0.5 text-xs`}>
                        {section}
                      </span>
                    )}
                    {tags.map((tag) => (
                      <span key={tag} className={`inline-flex items-center rounded-full ${t.pillBg} ${t.pillBorder} border px-2 py-0.5 text-xs`}>
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {description && <p className="mt-3 text-sm text-gray-700 line-clamp-3">{description}</p>}

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-gray-500" suppressHydrationWarning>
                    {updatedYmd ? `更新: ${updatedYmd}` : ""}
                  </span>
                  <Link href={href} className={`inline-block rounded-full ${t.btn} ${t.btnHover} text-white text-sm font-semibold px-3 py-1.5`}>
                    開く
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {guides.length === 0 && <p className="text-gray-500 mt-6">公開中のガイドはまだありません。</p>}
      </main>
    </>
  );
}
