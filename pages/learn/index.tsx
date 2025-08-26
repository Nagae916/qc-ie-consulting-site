// pages/learn/index.tsx
import Link from "next/link";
import { GUIDES } from "@/components/learn/Guides";
import { guideHref } from "@/lib/routes";

const FALLBACK_QC_SLUGS = new Set([
  "qc-seven-tools",
  "new-qc-seven-tools",
  "stat-tests",
  "regression-anova"
]);

type MaybeGuide = {
  id?: string;
  title?: string;
  description?: string;
  tags?: unknown; // 文字列/配列/未定義どれでも受ける
  exam?: string;
  slug?: string;
};

function toExamSlug(g: MaybeGuide): { exam: string; slug: string } | null {
  if (g.exam && g.slug) return { exam: String(g.exam), slug: String(g.slug) };
  if (g.id && FALLBACK_QC_SLUGS.has(g.id)) return { exam: "qc", slug: g.id };
  return null;
}
function normalizeTags(input: unknown): string[] {
  if (Array.isArray(input)) return input.filter(Boolean).map(String);
  if (typeof input === "string") return input.split(/[,\s]+/).map((s) => s.trim()).filter(Boolean);
  return [];
}

export default function LearningIndex() {
  const list = Array.isArray(GUIDES) ? GUIDES : [];

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-brand-900">学習コンテンツ</h1>
        <p className="text-gray-700 mt-2">テーマ別の学習ガイドを選んでください。</p>
      </header>

      <div className="grid md:grid-cols-3 gap-6">
        {list.map((raw: unknown) => {
          const g = raw as MaybeGuide;
          const es = toExamSlug(g);
          if (!es) return null;

          const tags = normalizeTags(g.tags);

          return (
            <Link
              key={`${es.exam}/${es.slug}`}
              href={guideHref(es.exam, es.slug)}
              className="block rounded-xl2 bg-white border border-brand-200 shadow-soft p-5 hover:shadow-lg transition"
            >
              <h3 className="font-semibold text-brand-900">{g.title ?? es.slug}</h3>
              {g.description ? <p className="text-sm text-gray-700 mt-2">{g.description}</p> : null}
              {tags.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {tags.map((t) => (
                    <span key={t} className="text-xs px-2 py-1 rounded bg-brand-100/70 border border-brand-200">
                      {t}
                    </span>
                  ))}
                </div>
              ) : null}
            </Link>
          );
        })}
      </div>

      <div className="mt-8">
        <Link href="/" className="text-brand-800 hover:underline">← トップへ戻る</Link>
      </div>
    </main>
  );
}
