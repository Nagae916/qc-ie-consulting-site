// pages/index.tsx
import Head from "next/head";
import Link from "next/link";

// トップページ専用セクション（src/components/home）
import Hero from "@/components/home/Hero";
import Services from "@/components/home/Services";
import Training from "@/components/home/Training";
import HomeFeeds from "@/components/home/Feeds";

// ガイド一覧（Contentlayer）
import { allGuides } from "contentlayer/generated";

// ---- 表示名と説明 ----
const EXAM_LABEL = {
  qc: "品質管理",
  stat: "統計",
  engineer: "技術士",
} as const;

type ExamKey = keyof typeof EXAM_LABEL;

const EXAM_DESC: Record<ExamKey, string> = {
  qc: "統計の基礎〜管理図・検定・推定。現場データで演習。",
  stat: "記述・推測統計／多変量。理解と活用を両立。",
  engineer: "論文構成・キーワード整理。演習添削に対応。",
};

// ---- ユーティリティ ----
const parseDate = (v?: string) => (v ? new Date(v) : undefined);
const updatedAtOf = (g: { updatedAt?: string; date?: string }) =>
  parseDate(g.updatedAt) ?? parseDate(g.date) ?? new Date(0);

// 直近2件を返す
const latestOf = (exam: ExamKey) =>
  allGuides
    .filter((g) => g.status !== "draft" && String(g.exam) === exam)
    .sort((a, b) => updatedAtOf(b).getTime() - updatedAtOf(a).getTime())
    .slice(0, 2);

export default function HomePage() {
  const latestQC = latestOf("qc");
  const latestStat = latestOf("stat");
  const latestEng = latestOf("engineer");

  const Card = ({
    exam,
    items,
    extra,
  }: {
    exam: ExamKey;
    items: typeof latestQC;
    extra?: React.ReactNode;
  }) => (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="text-xl font-extrabold mb-1">{EXAM_LABEL[exam]}</h3>
      <p className="text-gray-500 mb-4">{EXAM_DESC[exam]}</p>

      {/* 直近2件のみ */}
      <ul className="list-disc pl-5 space-y-1 mb-4">
        {items.map((g) => (
          <li key={`${g.exam}/${g.slug}`}>
            <Link
              href={`/guides/${g.exam}/${g.slug}`}
              className="text-blue-700 underline"
            >
              {g.title}
            </Link>
            {g.updatedAt ? (
              <span className="text-xs text-gray-400 ml-2">{g.updatedAt}</span>
            ) : null}
          </li>
        ))}
        {items.length === 0 && <li className="text-gray-400">準備中</li>}
      </ul>

      <Link
        href={`/guides/${exam}`}
        className="inline-block rounded-full bg-emerald-600 px-4 py-2 text-white font-semibold hover:bg-emerald-700"
      >
        学習コンテンツを開く
      </Link>

      {/* 統計だけ更新履歴を強調 */}
      {exam === "stat" && items.length > 0 && (
        <div className="mt-5 rounded-lg bg-gray-50 border border-gray-200 p-3">
          <div className="text-sm font-bold mb-2">統計の更新履歴（直近）</div>
          <ul className="text-sm list-disc pl-5 space-y-1">
            {items.map((g) => (
              <li key={`hist-${g.slug}`}>
                <Link
                  href={`/guides/${g.exam}/${g.slug}`}
                  className="underline"
                >
                  {g.title}
                </Link>
                {g.updatedAt ? (
                  <span className="text-xs text-gray-400 ml-2">
                    {g.updatedAt}
                  </span>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      )}

      {extra}
    </div>
  );

  return (
    <>
      <Head>
        <title>学習ガイドライブラリ | QC × IE LABO</title>
        <meta
          name="description"
          content="見やすさと親しみやすさを大切に、ガイドとツールを継続更新しています。QC検定・統計検定・技術士、そして研修の情報をまとめています。"
        />
      </Head>

      <main className="container mx-auto px-4 py-10 space-y-12">
        {/* ヒーロー（タイトル/リード） */}
        <Hero />

        {/* カテゴリーボタン（品質管理 / 統計 / 技術士） */}
        <section className="text-center">
          <h2 className="text-xl font-semibold mb-4">学習カテゴリ</h2>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link
              href="/guides/qc"
              className="px-6 py-3 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700"
            >
              品質管理
            </Link>
            <Link
              href="/guides/stat"
              className="px-6 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700"
            >
              統計
            </Link>
            <Link
              href="/guides/engineer"
              className="px-6 py-3 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700"
            >
              技術士
            </Link>
          </div>
        </section>

        {/* 学習ガイドライブラリ（カード：各カテゴリ直近2件） */}
        <section>
          <h2 className="text-xl font-semibold mb-4">学習ガイドライブラリ</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <Card exam="qc" items={latestQC} />
            <Card exam="stat" items={latestStat} />
            <Card exam="engineer" items={latestEng} />
          </div>
        </section>

        {/* 学習サポート（既存：カードのサイズ感を維持） */}
        <Services />

        {/* 研修（SPC演習/IE基礎 など） */}
        <Training />

        {/* ニュース・note・X・Instagram まとめ（ホーム用） */}
        <HomeFeeds />
      </main>
    </>
  );
}
