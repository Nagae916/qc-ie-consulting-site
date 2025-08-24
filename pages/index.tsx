import Link from "next/link";
import { GUIDES } from "@/components/learn/Guides";

export default function LearningIndex() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-brand-900">学習コンテンツ</h1>
        <p className="text-gray-700 mt-2">テーマ別の学習ガイドを選んでください。</p>
      </header>

      <div className="grid md:grid-cols-3 gap-6">
        {GUIDES.map((g) => (
          <Link
            key={g.id}
            href={`/guide/${g.id}`}
            className="block rounded-xl2 bg-white border border-brand-200 shadow-soft p-5 hover:shadow-lg transition"
          >
            <h3 className="font-semibold text-brand-900">{g.title}</h3>
            <p className="text-sm text-gray-700 mt-2">{g.description}</p>
            {g.tags?.length ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {g.tags.map((t) => (
                  <span key={t} className="text-xs px-2 py-1 rounded bg-brand-100/70 border border-brand-200">{t}</span>
                ))}
              </div>
            ) : null}
          </Link>
        ))}
      </div>

      <div className="mt-8">
        <Link href="/" className="text-brand-800 hover:underline">← トップへ戻る</Link>
      </div>
    </main>
  );
}
