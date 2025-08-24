// pages/learn/index.tsx
import Link from "next/link";
import { GUIDES } from "@/components/learn/Guides";

export default function LearningIndex() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-brand-900">学習コンテンツ</h1>
        <p className="text-gray-700 mt-2">テーマ別の学習ガイドを選んでください。</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {GUIDES.map((g) => (
          <Link key={g.id} href={`/guide/${g.id}`} className="block">
            <div className="bg-white rounded-xl2 border border-brand-200 p-5 hover:shadow-soft transition">
              <h3 className="text-lg font-semibold text-brand-900">{g.title}</h3>
              <p className="text-sm text-gray-600 mt-2">{g.description}</p>
              {g.tags && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {g.tags.map((t) => (
                    <span key={t} className="text-xs px-2 py-1 rounded bg-brand-100 text-brand-800 border border-brand-200">
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>

      <div className="pt-2">
        <Link href="/" className="text-brand-700 hover:underline">← トップへ戻る</Link>
      </div>
    </main>
  );
}
