import Link from "next/link";

import { SectionHeading } from "@/components/site/SectionHeading";
import { SiteMeta } from "@/components/site/SiteMeta";

const serviceAreas = [
  {
    title: "品質規格・管理方法の整理",
    description: "要求事項、重要特性、リスク、測定方法、判定条件を整理し、規格書や管理表の骨格へ落とします。",
    outputs: ["品質特性一覧", "規格設定根拠", "初期流動管理表", "判定フロー"],
  },
  {
    title: "試験・評価設計",
    description: "試験目的、試料、条件、比較対象、判定基準を整理し、結果を意思決定へ使える形にします。",
    outputs: ["試験要求事項", "サンプリング計画", "結果レビュー様式", "評価基準"],
  },
  {
    title: "業務・改善プロセスの構造化",
    description: "属人的な判断や一時対策を、標準、役割、KPI、レビュー手順を持つ仕組みへ整理します。",
    outputs: ["業務フロー", "役割分担表", "KPI設計", "チェックリスト"],
  },
  {
    title: "研修・図解・ツール化",
    description: "複雑な品質・生産・統計の考え方を、研修資料、図解、演習、簡易ツールへ変換します。",
    outputs: ["研修構成", "関係図", "演習問題", "計算・判断ツール"],
  },
] as const;

export default function ServicesPage() {
  return (
    <>
      <SiteMeta
        title="相談できる内容"
        description="品質規格、評価設計、改善プロセス、研修・図解・ツール化について、N-IE Labが支援できる領域を紹介します。"
        path="/services"
      />
      <main id="main-content" className="min-h-screen bg-slate-50 text-slate-900">
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-5xl px-4 py-14">
            <p className="text-xs font-bold uppercase text-teal-700">Services</p>
            <h1 className="mt-3 text-4xl font-black md:text-5xl">相談できる内容</h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600">
              答えだけを提示するのではなく、課題、制約、判断基準を整理し、現場で使える成果物へ変換する支援を想定しています。
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-12">
          <SectionHeading title="対応領域と成果物" description="依頼内容と保有情報を確認し、実施可能な範囲を個別に判断します。" />
          <div className="mt-7 grid gap-6 md:grid-cols-2">
            {serviceAreas.map((area) => (
              <article key={area.title} className="rounded-lg border border-slate-200 bg-white p-5">
                <h2 className="text-xl font-bold">{area.title}</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">{area.description}</p>
                <h3 className="mt-5 text-sm font-bold text-slate-800">成果物の例</h3>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {area.outputs.map((output) => <li key={output} className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">{output}</li>)}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="border-t border-slate-200 bg-white">
          <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-10 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold">判断の進め方を先に確認する</h2>
              <p className="mt-2 text-sm leading-7 text-slate-600">匿名化ケースで、背景から成果物までの流れを確認できます。</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/cases" className="rounded-md border border-slate-300 px-5 py-3 text-sm font-bold hover:border-teal-500">ケースを見る</Link>
              <Link href="/contact" className="rounded-md bg-slate-950 px-5 py-3 text-sm font-bold text-white hover:bg-teal-800">問い合わせ方法を見る</Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
