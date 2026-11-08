import Link from "next/link";

import { SiteMeta } from "@/components/site/SiteMeta";

const preparation = [
  "対象となるページのURL",
  "確認したい内容、または誤記・不具合の状況",
  "不具合の場合は、使用端末と再現手順",
  "返信に必要な情報だけを記載し、機密情報は含めない",
] as const;

export default function ContactPage() {
  return (
    <>
      <SiteMeta
        title="お問い合わせ"
        description="N-IE Labの掲載内容に関する質問、誤記・不具合の連絡方法を案内します。"
        path="/contact"
      />
      <main id="main-content" className="min-h-screen bg-slate-50 text-slate-900">
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-4xl px-4 py-14">
            <p className="text-xs font-bold uppercase text-teal-700">Contact</p>
            <h1 className="mt-3 text-4xl font-black md:text-5xl">お問い合わせ</h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600">
              サイト掲載内容に関する質問、誤記・不具合の連絡を受け付けています。質問者の事業や業務に関する個別支援、有償相談は現在受け付けていません。
            </p>
          </div>
        </section>

        <section className="mx-auto grid max-w-4xl gap-10 px-4 py-12 md:grid-cols-[1.2fr_.8fr]">
          <div>
            <h2 className="text-2xl font-bold">連絡前に整理すること</h2>
            <ol className="mt-5 grid gap-3 pl-6 text-base leading-8 text-slate-700 list-decimal">
              {preparation.map((item) => <li key={item}>{item}</li>)}
            </ol>
            <Link href="/services" className="mt-7 inline-block rounded-md border border-slate-300 bg-white px-5 py-3 text-sm font-bold hover:border-teal-500">
              N-IE Labの対応領域を見る
            </Link>
          </div>
          <aside className="border-l-4 border-teal-600 bg-white p-5">
            <h2 className="text-xl font-bold">正式な連絡先</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">返信の目安は原則3営業日以内です。</p>
            <a href="mailto:n.iecqlab@gmail.com" className="mt-5 inline-block break-all text-sm font-bold text-teal-700 underline decoration-teal-200 underline-offset-4">
              n.iecqlab@gmail.com
            </a>
            <p className="mt-5 text-sm leading-7 text-slate-600">
              企業名、製品名、実数値、個人情報などの機密情報は送信しないでください。
            </p>
          </aside>
        </section>
      </main>
    </>
  );
}
