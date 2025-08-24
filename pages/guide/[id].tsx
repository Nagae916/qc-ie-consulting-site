// pages/guide/[id].tsx
import Link from "next/link";
import { useRouter } from "next/router";
import { GUIDES } from "@/src/components/learn/Guides";
import {
  StudyGuide_RegressionAnova,
  StudyGuide_StatTests,
} from "@/src/components/learn/StudyGuide";

// id → 表示用コンポーネントの対応表
const GUIDE_COMPONENTS: Record<string, () => JSX.Element> = {
  "regression-anova": StudyGuide_RegressionAnova,
  "stat-tests": StudyGuide_StatTests,
};

export default function GuidePage() {
  const router = useRouter();
  const { id } = router.query as { id?: string };

  if (!id) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-10">
        <p className="text-gray-700">読み込み中です…</p>
        <div className="mt-4">
          <Link href="/learn" className="text-brand-800 hover:underline">
            ← 学習コンテンツ一覧へ
          </Link>
        </div>
      </main>
    );
  }

  const meta = GUIDES.find((g) => g.id === id);
  const Cmp = GUIDE_COMPONENTS[id];

  if (!meta || !Cmp) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-10">
        <p className="text-gray-700">指定されたガイドは見つかりませんでした。</p>
        <div className="mt-4">
          <Link href="/learn" className="text-brand-800 hover:underline">
            ← 学習コンテンツ一覧へ
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-brand-900">{meta.title}</h1>
        <Link href="/learn" className="text-brand-800 hover:underline">
          一覧へ戻る
        </Link>
      </div>

      <Cmp />
    </main>
  );
}
