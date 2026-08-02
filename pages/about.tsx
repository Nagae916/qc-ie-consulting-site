import Link from "next/link";

import { SectionHeading } from "@/components/site/SectionHeading";
import { SiteMeta } from "@/components/site/SiteMeta";
import { siteIdentity, themes } from "@/data/n-ie-lab";

const workingPrinciples = [
  "個別手法を並べるだけでなく、品質・納期・在庫・原価・組織の関係を示す",
  "結論だけでなく、制約、根拠、判断過程、適用範囲を残す",
  "解説を、図解、ケース、チェックリスト、計算・演習ツールへ変換する",
  "実務と資格学習を分断せず、相互に理解を深める",
] as const;

export default function AboutPage() {
  return (
    <>
      <SiteMeta title="N-IE Labについて" description={siteIdentity.description} path="/about" />
      <main id="main-content" className="min-h-screen bg-slate-50 text-slate-900">
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-5xl px-4 py-14">
            <p className="text-xs font-bold uppercase text-teal-700">About</p>
            <h1 className="mt-3 text-4xl font-black md:text-5xl">{siteIdentity.name}について</h1>
            <p className="mt-5 max-w-3xl text-xl font-bold leading-9 text-slate-800">{siteIdentity.message}</p>
            <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600">{siteIdentity.subMessage}</p>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-12">
          <SectionHeading title="3つの役割" />
          <div className="mt-7 grid gap-5 md:grid-cols-3">
            {[
              ["専門メディア", "ものづくりの仕組みと、分野間の因果関係を読み解きます。"],
              ["体験型教材", "図解、演習、シミュレーションで、判断の感覚を身につけます。"],
              ["キャリアポートフォリオ", "実務課題を構造化し、成果物へ変える進め方を示します。"],
            ].map(([title, description]) => (
              <article key={title} className="border-t-4 border-teal-600 bg-white p-5">
                <h2 className="text-lg font-bold">{title}</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">{description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="border-y border-slate-200 bg-white">
          <div className="mx-auto max-w-5xl px-4 py-12">
            <SectionHeading title="扱う領域" description="経営工学を軸に、担当部門を越えてものづくりを見ます。" />
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {themes.map((theme) => (
                <Link key={theme.slug} href={`/themes/${theme.slug}`} className="rounded-lg border border-slate-200 p-4 hover:border-teal-500">
                  <h2 className="font-bold">{theme.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{theme.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-12">
          <SectionHeading title="知識の残し方" />
          <ul className="mt-6 grid gap-3 text-base leading-8 text-slate-700">
            {workingPrinciples.map((item) => <li key={item} className="border-l-4 border-slate-300 pl-4">{item}</li>)}
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/cases" className="rounded-md bg-slate-950 px-5 py-3 text-sm font-bold text-white hover:bg-teal-800">ケースを見る</Link>
            <Link href="/services" className="rounded-md border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-800 hover:border-teal-500">相談できる内容を見る</Link>
          </div>
        </section>
      </main>
    </>
  );
}
