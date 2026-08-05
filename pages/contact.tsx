import Link from "next/link";

import { SiteMeta } from "@/components/site/SiteMeta";
import { socialChannels } from "@/data/site";

const preparation = [
  "現在困っていることと、期待する状態",
  "対象となる業務、製品、工程の範囲",
  "既に分かっている制約と期限",
  "必要な成果物のイメージ",
  "公開できない情報の範囲",
] as const;

export default function ContactPage() {
  return (
    <>
      <SiteMeta
        title="お問い合わせ"
        description="N-IE Labへの相談内容を整理し、公開プロフィールから連絡方法を確認するための案内です。"
        path="/contact"
      />
      <main id="main-content" className="min-h-screen bg-slate-50 text-slate-900">
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-4xl px-4 py-14">
            <p className="text-xs font-bold uppercase text-teal-700">Contact</p>
            <h1 className="mt-3 text-4xl font-black md:text-5xl">お問い合わせ</h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600">
              相談内容と必要な成果物を確認したうえで、対応可能な範囲を判断します。企業名、製品名、実数値などの機密情報は、公開SNSへ記載しないでください。
            </p>
          </div>
        </section>

        <section className="mx-auto grid max-w-4xl gap-10 px-4 py-12 md:grid-cols-[1.2fr_.8fr]">
          <div>
            <h2 className="text-2xl font-bold">最初に整理すること</h2>
            <ol className="mt-5 grid gap-3 pl-6 text-base leading-8 text-slate-700 list-decimal">
              {preparation.map((item) => <li key={item}>{item}</li>)}
            </ol>
            <Link href="/services" className="mt-7 inline-block rounded-md border border-slate-300 bg-white px-5 py-3 text-sm font-bold hover:border-teal-500">
              相談できる内容を確認する
            </Link>
          </div>
          <aside className="border-l-4 border-teal-600 bg-white p-5">
            <h2 className="text-xl font-bold">公開プロフィール</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">現在の連絡方法や最新の活動は、公開プロフィールから確認してください。</p>
            <ul className="mt-5 grid gap-3">
              {socialChannels.map((channel) => (
                <li key={channel.name}>
                  <a href={channel.href} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-teal-700 underline decoration-teal-200 underline-offset-4">
                    {channel.name}を開く
                  </a>
                </li>
              ))}
            </ul>
          </aside>
        </section>
      </main>
    </>
  );
}
