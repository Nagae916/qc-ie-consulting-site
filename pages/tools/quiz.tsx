// pages/tools/quiz.tsx
import Head from "next/head";
import dynamic from "next/dynamic";

// Quiz はクライアント専用のため SSR 無効で読み込み
const Quiz = dynamic(
  () => import("@/components/guide/Quiz").then((m) => m.Quiz),
  { ssr: false, loading: () => <div className="text-gray-500">Loading quiz…</div> }
);

export default function QuizPage() {
  // デモ用アイテム（QA / 単一選択 / 複数選択）
  const items: any[] = [
    // QA（一問一答）
    {
      q: <>TQM の根幹となる活動は？</>,
      a: <>全員参加で日常管理の PDCA を回し、維持と改善を両立させること。</>,
    },
    // MCQ（単一正解）
    {
      q: <>母分散が未知の 2 群・対応なしで平均差を検定。適切なのは？</>,
      choices: [<>Z 検定</>, <>t 検定</>, <>F 検定</>],
      answer: 1,
      explain: <>実務では母分散は未知が一般的 → 平均差は t 検定（対応なし/ありで分岐）。</>,
    },
    // MCQ（複数正解）
    {
      q: <>新 QC 七つ道具に含まれるものをすべて選べ。</>,
      choices: [<>親和図法</>, <>ヒストグラム</>, <>連関図法</>, <>PDPC 法</>],
      answer: [0, 2, 3],
      explain: <>ヒストグラムは旧 QC 七つ道具。新は親和・連関・系統・マトリックス・アロー・PDPC・マトリックスデータ解析。</>,
    },
  ];

  return (
    <>
      <Head>
        <title>クイズ | QC × IE LABO</title>
        <meta name="description" content="QA と選択式（単一/複数）の学習クイズ" />
      </Head>

      <main className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-2">学習クイズ</h1>
        <p className="text-gray-600 mb-6">
          QA（一問一答）と選択式（単一/複数正解）のクイズです。答えを選ぶと即時判定されます。
        </p>

        <Quiz items={items} />
      </main>
    </>
  );
}
