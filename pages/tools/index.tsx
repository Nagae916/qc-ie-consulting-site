import Head from "next/head";
import Link from "next/link";

import { labTools } from "@/data/site";

const toolFlow = [
  { title: "1. 傾向を見る", href: "/guides/engineer/past-exam-trend-map", description: "過去問トレンドから重点テーマを決める" },
  { title: "2. 課題を分ける", href: "/guides/engineer/issue-decomposition-matrix", description: "複数観点で課題候補を比較する" },
  { title: "3. 骨子にする", href: "/guides/engineer/answer-structure-builder", description: "課題、解決策、リスクを答案構造にする" },
  { title: "4. 問題を広げる", href: "/guides/engineer/problem-matrix", description: "テーマ別に演習範囲を広げる" },
];

export default function ToolsIndexPage() {
  return (
    <>
      <Head>
        <title>演習・ツール | n-ie-qclab</title>
        <meta name="description" content="品質管理、統計、技術士答案の演習・分析ツール一覧" />
      </Head>

      <main className="min-h-screen bg-[#f7f8f5] text-slate-900">
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-5xl px-4 py-10">
            <p className="text-sm font-semibold text-teal-700">Tools</p>
            <h1 className="mt-2 text-3xl font-extrabold">演習・ツール</h1>
            <p className="mt-4 max-w-2xl leading-7 text-slate-600">
              ガイドで学んだ品質管理・統計・技術士答案の考え方を、数値操作、課題整理、答案骨子作成で確認できます。
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-10">
          <div className="mb-8 rounded-xl border border-emerald-200 bg-emerald-50 p-5">
            <p className="text-sm font-semibold text-emerald-800">おすすめの使う順番</p>
            <h2 className="mt-1 text-2xl font-bold text-slate-900">傾向把握から答案骨子まで、一つの流れで使う</h2>
            <div className="mt-5 grid gap-3 md:grid-cols-4">
              {toolFlow.map((step) => (
                <Link key={step.href} href={step.href} className="rounded-lg border border-emerald-100 bg-white p-4 hover:border-emerald-400">
                  <h3 className="text-sm font-bold text-emerald-900">{step.title}</h3>
                  <p className="mt-2 text-xs leading-5 text-slate-600">{step.description}</p>
                </Link>
              ))}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {labTools.map((tool) => (
              <Link key={tool.href} href={tool.href} className="rounded-lg border border-slate-200 bg-white p-5 hover:border-teal-500">
                <div className="text-xs font-semibold text-teal-700">{tool.category}</div>
                <h2 className="mt-2 text-xl font-bold">{tool.title}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">{tool.summary}</p>
                {tool.whenToUse ? (
                  <p className="mt-3 rounded-lg bg-slate-50 p-3 text-sm leading-6 text-slate-700">
                    <span className="font-semibold">いつ使うか: </span>
                    {tool.whenToUse}
                  </p>
                ) : null}
                {tool.steps && tool.steps.length > 0 ? (
                  <div className="mt-3">
                    <div className="text-xs font-semibold text-slate-500">使い方</div>
                    <ol className="mt-2 grid gap-1 text-sm leading-6 text-slate-600">
                      {tool.steps.map((step, index) => (
                        <li key={step}>{index + 1}. {step}</li>
                      ))}
                    </ol>
                  </div>
                ) : null}
                {tool.outcome ? <p className="mt-3 text-sm font-semibold leading-6 text-slate-800">{tool.outcome}</p> : null}
              </Link>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
