// pages/learn/index.tsx
import Link from "next/link";
import { GUIDES } from "@/components/learn/Guides";
import { guideHref } from "@/lib/routes";
import { normalizeStringArray } from "@/lib/safe"; // ← 追加：tags を配列に正規化

// GUIDES の要素に exam/slug が無い場合のフォールバック（従来4件をQC扱い）
const FALLBACK_QC_SLUGS = new Set([
  "qc-seven-tools",
  "new-qc-seven-tools",
  "stat-tests",
  "regression-anova",
]);

type MaybeGuide = {
  id?: string;
  title?: string;
  description?: string;
  tags?: unknown; // 文字列/配列/未定義いずれも許容して正規化で吸収
  exam?: string;
  slug?: string;
};

function toExamSlug(g: MaybeGuide): { exam: string; slug: string } | null {
  // 1) 正式に exam/slug を持っている場合（推奨形）
  if (g.exam && g.slug) return { exam: String(g.exam), slug: String(g.slug) };

  // 2) 旧データ：id のみ → 既知IDはQC配下にマップ
  if (g.id && FALLBACK_QC_SLUGS.has(g.id)) {
    return { exam: "qc", slug: g.id };
  }

  // 3) どれでもない場合は無効
  return null;
}

export default function LearningIndex() {
  // GUIDES が配列以外になっても落ちないよう防御（念のため）
  const list: MaybeGuide[] = Array.isArray(GUIDES) ? (GUIDES as MaybeGuide[]) : [];

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-brand-900">学習コンテンツ</h1>
        <p className="text-gray-700 mt-2">テーマ別の学習ガイドを選んでください。</p>
      </header>

      <div className="grid md:grid-cols-3 gap-6">
        {list.map((g) => {
          const es = toExamSlug(g);
          if (!es) return null; // 形が不十分な要素は無視（実行時例外を防止）

          // ← ここがポイント：tags を常に string[] に正規化
          const tags = normalizeStringArray(g.tags);

          return (
            <Link
              key={`${es.exam}/${es.slug}`}
              href={guideHref(es.exam, es.slug)}
              className="block rounded-xl2 bg-white border border-brand-200 shadow-soft p-5 hover:shadow-lg transition"
            >
              <h3 className="font-semibold text-brand-900">{g.title ?? es.slug}</h3>
              {g.description ? (
                <p className="text-sm text-gray-700 mt-2">{g.description}</p>
              ) : null}

              {tags.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {tags.map((t) => (
                    <span
                      key={t}
                      className="text-xs px-2 py-1 rounded bg-brand-100/70 border border-brand-200"
                    >
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
        <Link href="/" className="text-brand-800 hover:underline">
          ← トップへ戻る
        </Link>
      </div>
    </main>
  );
}
