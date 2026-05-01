import Head from "next/head";
import Link from "next/link";

import { labTools } from "@/data/site";

export default function ToolsIndexPage() {
  return (
    <>
      <Head>
        <title>シミュレーター一覧 | QC × IE LABO</title>
        <meta name="description" content="品質管理・統計・学習用シミュレーターの一覧" />
      </Head>

      <main className="min-h-screen bg-[#f7f8f5] text-slate-900">
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-5xl px-4 py-10">
            <p className="text-sm font-semibold text-teal-700">Tools</p>
            <h1 className="mt-2 text-3xl font-extrabold">シミュレーター一覧</h1>
            <p className="mt-4 max-w-2xl leading-7 text-slate-600">
              ガイドで扱う品質管理・統計の考え方を、数値を動かしながら確認できます。
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-10">
          <div className="grid gap-4 md:grid-cols-2">
            {labTools.map((tool) => (
              <Link key={tool.href} href={tool.href} className="rounded-lg border border-slate-200 bg-white p-5 hover:border-teal-500">
                <div className="text-xs font-semibold text-teal-700">{tool.category}</div>
                <h2 className="mt-2 text-xl font-bold">{tool.title}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">{tool.summary}</p>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
