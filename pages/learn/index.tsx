// pages/learn/index.tsx
import Link from "next/link";
import { GUIDES, GuidesGrid } from "@/src/components/learn/Guides";

export default function LearningIndex() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-brand-900">学習コンテンツ</h1>
        <p className="text-gray-700 mt-2">テーマ別の学習ガイドを選んでください。</p>
      </header>

      {/* 学習ガイドの一覧 */}
      <GuidesGrid items={GUIDES} />

      <div className="mt-8">
        <Link href="/" className="text-brand-800 hover:underline">
          ← トップへ戻る
        </Link>
      </div>
    </main>
  );
}
