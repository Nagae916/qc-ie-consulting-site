import Link from "next/link";

import { SiteMeta } from "@/components/site/SiteMeta";
import { insightItems } from "@/data/insights";
import { whitepaperTopics } from "@/data/whitepapers";

export default function ReferencesIndexPage() {
  return (
    <>
      <SiteMeta title="参考資料" description="白書、法令、過去問の整理情報、年度別トピックを確認する参考資料の入口です。" path="/references" />

      <main className="min-h-screen bg-[#f7f8f5] text-slate-900">
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-6xl px-4 py-12">
            <p className="text-sm font-semibold text-teal-700">References</p>
            <h1 className="mt-2 text-3xl font-extrabold md:text-4xl">参考資料</h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">
              白書、法令、過去問の整理情報、参考リンクを、技術士答案や実務改善へ使いやすい形でまとめています。
              数値や制度は一次情報へ戻って確認できるようにします。
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-10">
          <div className="grid gap-4 md:grid-cols-3">
            <ReferenceCard title="白書・法令" description="ものづくり、物流、DX、標準化、取引適正化などの一次情報を確認します。" href="#whitepapers" />
            <ReferenceCard title="過去問の整理" description="技術士 経営工学の過去問を、年度・テーマ・設問パターンで確認できます。" href="/guides/engineer/past-exam-trend-map" />
            <ReferenceCard title="年度別トピック" description="前年からの変化、試験との関連、答案で使える観点を確認します。" href="#topics" />
          </div>
        </section>

        <section id="whitepapers" className="mx-auto max-w-6xl px-4 pb-10">
          <h2 className="text-2xl font-bold">一次情報リンク</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {insightItems.map((item) => (
              <a key={`${item.source}-${item.title}`} href={item.href} target="_blank" rel="noopener noreferrer" className="rounded-lg border border-slate-200 bg-white p-5 hover:border-teal-500">
                <div className="text-xs font-semibold text-teal-700">{item.source}</div>
                <h3 className="mt-2 font-bold">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.summary}</p>
              </a>
            ))}
          </div>
        </section>

        <section id="topics" className="mx-auto max-w-6xl px-4 pb-14">
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h2 className="text-2xl font-bold">白書を読むときの確認項目</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              年度、白書名、主要トピック、前年からの変化、技術士試験との関連、答案で使える観点、一次情報へのリンクを整理します。
            </p>
            <p className="mt-4 text-sm text-slate-500">
              現在の登録件数: {whitepaperTopics.length} 件
            </p>
          </div>
        </section>
      </main>
    </>
  );
}

function ReferenceCard({ title, description, href }: { title: string; description: string; href: string }) {
  return (
    <Link href={href} className="rounded-lg border border-slate-200 bg-white p-5 hover:border-teal-500">
      <h2 className="font-bold">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
    </Link>
  );
}
