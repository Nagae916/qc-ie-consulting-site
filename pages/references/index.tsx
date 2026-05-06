import Head from "next/head";
import Link from "next/link";

import { insightItems } from "@/data/insights";
import { whitepaperTopics } from "@/data/whitepapers";

export default function ReferencesIndexPage() {
  return (
    <>
      <Head>
        <title>参考資料 | n-ie-qclab</title>
        <meta name="description" content="白書、法令、過去問データ、年度別トピックを整理する参考資料の入口です。" />
      </Head>

      <main className="min-h-screen bg-[#f7f8f5] text-slate-900">
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-6xl px-4 py-12">
            <p className="text-sm font-semibold text-teal-700">References</p>
            <h1 className="mt-2 text-3xl font-extrabold md:text-4xl">参考資料</h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">
              白書、法令、過去問データ、参考リンクを、技術士答案や実務改善へ使いやすい形で整理していく入口です。
              今回はMVPとして、一次情報への導線と今後保持するメタデータ構造を示します。
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-10">
          <div className="grid gap-4 md:grid-cols-3">
            <ReferenceCard title="白書・法令" description="ものづくり、物流、DX、標準化、取引適正化などの一次情報を確認します。" href="#whitepapers" />
            <ReferenceCard title="過去問データ" description="技術士 経営工学の過去問を、年度・テーマ・設問パターンで整理するためのデータです。" href="/guides/engineer/past-exam-trend-map" />
            <ReferenceCard title="年度別トピック" description="今後、前年からの変化、試験との関連、答案で使える観点を整理していきます。" href="#metadata" />
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

        <section id="metadata" className="mx-auto max-w-6xl px-4 pb-14">
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h2 className="text-2xl font-bold">白書メタデータの予定項目</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              将来的に、年度、白書名、主要トピック、前年からの変化、技術士試験との関連、答案で使える観点、一次ソースURLを保持します。
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

