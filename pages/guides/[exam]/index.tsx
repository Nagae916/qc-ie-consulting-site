// pages/guides/[exam]/index.tsx
import Link from "next/link";
import type { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import { allGuides, type Guide } from "contentlayer/generated";
import { normalizeStringArray } from "@/lib/safe";

// ルーティング上の正規カテゴリ
type ExamKey = "qc" | "stat" | "engineer";

// 表示ラベル
const EXAM_LABEL: Record<ExamKey, string> = {
  qc: "品質管理",
  stat: "統計",
  engineer: "技術士",
};

// exam の表記ゆれ吸収
function normalizeExamValue(v: unknown): ExamKey | null {
  const s = String(v ?? "").toLowerCase().trim();
  if (s === "qc") return "qc";
  if (s === "stat" || s === "stats" || s === "statistics") return "stat";
  if (s === "engineer" || s === "pe" || s === "eng") return "engineer";
  return null;
}

// パス優先のカテゴリ検出（最も信頼できるソース）
function detectCategory(g: Guide): ExamKey | null {
  const p = String(g._raw?.sourceFilePath ?? g._raw?.flattenedPath ?? "").toLowerCase();
  if (p.includes("/guides/qc/")) return "qc";
  if (p.includes("/guides/stat/")) return "stat";
  if (p.includes("/guides/engineer/")) return "engineer";

  // パスから判定できない場合は frontmatter の exam をフォールバックに使用
  return normalizeExamValue((g as any).exam);
}

export const getStaticPaths: GetStaticPaths = async () => {
  // 正規の 3 カテゴリのみをルーティング
  const paths = (["qc", "stat", "engineer"] as ExamKey[]).map((exam) => ({ params: { exam } }));
  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<{ exam: ExamKey }> = async ({ params }) => {
  const examParam = normalizeExamValue(params?.exam);
  if (!examParam) return { notFound: true };
  return { props: { exam: examParam }, revalidate: 60 };
};

export default function ExamIndex({ exam }: InferGetStaticPropsType<typeof getStaticProps>) {
  // パス優先のカテゴリ判定で厳密フィルタ
  const guides = allGuides
    .filter((g) => detectCategory(g) === exam && g.status !== "draft")
    .sort((a, b) => {
      // セクション → 更新日の降順
      const secCmp = (a.section ?? "").localeCompare(b.section ?? "");
      if (secCmp !== 0) return secCmp;
      const ta = Date.parse(String(a.updatedAt ?? "")) || 0;
      const tb = Date.parse(String(b.updatedAt ?? "")) || 0;
      return tb - ta;
    });

  // セクションごとにグルーピング
  const bySection = new Map<string, typeof guides[number][]>();
  for (const g of guides) {
    const sec = g.section ?? "未分類";
    if (!bySection.has(sec)) bySection.set(sec, []);
    bySection.get(sec)!.push(g);
  }

  return (
    <section className="space-y-6">
      <div className="text-sm text-gray-500">
        <Link href="/guides" className="underline">
          ガイド
        </Link>{" "}
        / {EXAM_LABEL[exam]}
      </div>

      <h1 className="text-2xl font-semibold">{EXAM_LABEL[exam]} 一覧</h1>

      {[...bySection.entries()].map(([sec, items]) => (
        <div key={sec} className="space-y-2">
          <h2 className="text-lg font-semibold">{sec}</h2>
          <ul className="divide-y rounded-lg border bg-white">
            {items.map((g) => {
              const href =
                typeof g.url === "string" && g.url.startsWith("/guides/")
                  ? g.url
                  : `/guides/${detectCategory(g) ?? exam}/${g.slug}`;
              const tags = normalizeStringArray((g as any).tags);

              return (
                <li key={g._id} className="p-3">
                  <Link href={href} className="font-medium hover:underline">
                    {g.title}
                  </Link>
                  <div className="text-sm text-gray-500">
                    v{g.version ?? "1.0.0"} ・ 更新日 {g.updatedAt ?? "—"}
                  </div>
                  {tags.length > 0 ? (
                    <div className="mt-1 text-xs text-gray-500">#{tags.join(" #")}</div>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </div>
      ))}

      {guides.length === 0 && <p className="text-gray-500">公開中のガイドはまだありません。</p>}
    </section>
  );
}
