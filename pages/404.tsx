import Link from "next/link";

import { SiteMeta } from "@/components/site/SiteMeta";

export default function NotFoundPage() {
  return (
    <>
      <SiteMeta
        title="ページが見つかりません"
        description="お探しのページは移動したか、URLが正しくない可能性があります。"
        path="/404"
        noIndex
      />
      <main id="main-content" className="min-h-[70vh] bg-slate-50 px-4 py-20 text-slate-900">
        <div className="mx-auto max-w-3xl border-t-4 border-teal-600 bg-white p-8 md:p-12">
          <p className="text-sm font-bold text-teal-700">404</p>
          <h1 className="mt-3 text-3xl font-black md:text-4xl">ページが見つかりません</h1>
          <p className="mt-5 leading-8 text-slate-600">
            URLをご確認ください。ものづくりの4テーマ、ガイド、ツールの入口から目的の情報を探せます。
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/" className="rounded-md bg-slate-950 px-5 py-3 text-sm font-bold text-white hover:bg-teal-800">
              トップへ戻る
            </Link>
            <Link href="/themes" className="rounded-md border border-slate-300 px-5 py-3 text-sm font-bold text-slate-800 hover:border-teal-500">
              4つのテーマを見る
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
