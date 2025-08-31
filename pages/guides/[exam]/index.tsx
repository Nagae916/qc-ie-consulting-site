// pages/guides/[exam]/index.tsx
import Link from "next/link";
import type { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import { allGuides, type Guide } from "contentlayer/generated";
import { normalizeStringArray } from "@/lib/safe";

type ExamKey = "qc" | "stat" | "engineer";

const EXAM_LABEL: Record<ExamKey, string> = {
  qc: "品質管理",
  stat: "統計",
  engineer: "技術士",
};

const toExamKey = (v: unknown): ExamKey | null => {
  const s = String(v ?? "").toLowerCase().trim();
  if (s === "qc") return "qc";
  if (s === "stat" || s === "stats" || s === "statistics") return "stat";
  if (s === "engineer" || s === "pe" || s === "eng") return "engineer";
  return null;
};

// exam ごとのテーマ（色）
const THEME: Record<
  ExamKey,
  {
    border: string;
    accent: string;
    title: string;
    pillBg: string;
    pillBorder: string;
    button: string;
    buttonHover: string;
  }
> = {
  qc: {
    border: "border-amber-200",
    accent: "bg-amber-300/70",
    title: "text-amber-800",
    pillBg: "bg-amber-50 text-amber-800",
    pillBorder: "border-amber-200",
    button: "bg-amber-500",
    buttonHover: "hover:bg-amber-600",
  },
  stat: {
    border: "border-sky-200",
    accent: "bg-sky-300/70",
    title: "text-sky-800",
    pillBg: "bg-sky-50 text-sky-800",
    pillBorder: "border-sky-200",
    button: "bg-sky-600",
    buttonHover: "hover:bg-sky-700",
  },
  engineer: {
    border: "border-emerald-200",
    accent: "bg-emerald-300/70",
    title: "text-emerald-800",
    pillBg: "bg-emerald-50 text-emerald-800",
    pillBorder: "border-emerald-200",
    button: "bg-emerald-600",
    buttonHover: "hover:bg-emerald-700",
  },
};

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = (["qc", "stat", "engineer"] as ExamKey[]).map((exam) => ({ params: { exam } }));
  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<{ exam: ExamKey }> = async ({ params }) => {
  const exam = toExamKey(params?.exam);
  if (!exam) return { notFound: true };
  return { props: { exam }, revalidate: 60 };
};

export default function ExamIndex({ exam }: InferGetStaticPropsType<typeof getStaticProps>) {
  // 下書き除外 → セクション→更新日の優先順で並べ替え
  const guides = allGuides
    .filter((g) => toExamKey(g.exam) === exam && g.status !== "draft")
    .sort((a, b) => {
      const secCmp = (a.section ?? "").localeCompare(b.section ?? "");
      if (secCmp !== 0) return secCmp;
      const ta = Date.parse(String(a.updatedAt ?? a.date ?? "")) || 0;
      const tb = Date.parse(String(b.updatedAt ?? b.date ?? "")) || 0;
      return tb - ta;
    });

  const t = THEME[exam];

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <div className="text-sm text-gray-500">
        <Link href="/guides" className="underline">ガイド</Link> / {EXAM_LABEL[exam]}
      </div>

      <h1 className="mt-2 text-2xl md:text-3xl font-extrabold">{EXAM_LABEL[exam]} 一覧</h1>

      {/* 2カラムのカードグリッド */}
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {guides.map((g) => {
          const href =
            typeof g.url === "string" && g.url.startsWith("/guides/")
              ? g.url
              : `/guides/${toExamKey(g.exam) ?? exam}/${g.slug}`;

          const tags = normalizeStringArray((g as any).tags).slice(0, 4);
          const updated = g.updatedAt || g.date
            ? new Date(String(g.updatedAt || g.date)).toLocaleDateString("ja-JP")
            : "";

          return (
            <article key={g._id} className={`rounded-2xl border shadow-sm bg-white ${t.border}`}>
              {/* 上部アクセントバー */}
              <div className={`h-1 w-full rounded-t-2xl ${t.accent}`} />

              <div className="p-5">
                <h2 className="text-lg font-bold leading-snug">
                  <Link href={href} className={`${t.title} hover:underline`}>
                    {g.title}
                  </Link>
                </h2>

                {/* section / tags */}
                {(g.section || tags.length > 0) && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {g.section && (
                      <span
                        className={`inline-flex items-center rounded-full ${t.pillBg} ${t.pillBorder} border px-2 py-0.5 text-xs`}
                      >
                        {g.section}
                      </span>
                    )}
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className={`inline-flex items-center rounded-full ${t.pillBg} ${t.pillBorder} border px-2 py-0.5 text-xs`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* 説明 */}
                {g.description && (
                  <p className="mt-3 text-sm text-gray-700 line-clamp-3">{g.description}</p>
                )}

                {/* フッタ */}
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    {updated ? `更新: ${updated}` : ""}
                  </span>
                  <Link
                    href={href}
                    className={`inline-block rounded-full ${t.button} ${t.buttonHover} text-white text-sm font-semibold px-3 py-1.5`}
                  >
                    開く
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {guides.length === 0 && (
        <p className="text-gray-500 mt-6">公開中のガイドはまだありません。</p>
      )}
    </main>
  );
}
