import Link from "next/link";

import { primaryNavigation, siteIdentity } from "@/data/n-ie-lab";

const supportLinks = [
  { label: "相談できる内容", href: "/services" },
  { label: "お問い合わせ", href: "/contact" },
  { label: "参考資料", href: "/references" },
  { label: "ガイド一覧", href: "/guides" },
] as const;

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-slate-950 text-slate-200">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Link href="/" className="text-xl font-black text-white">{siteIdentity.name}</Link>
          <p className="mt-3 max-w-md text-sm leading-7 text-slate-400">{siteIdentity.message}</p>
          <p className="mt-2 max-w-md text-sm leading-7 text-slate-400">
            品質、生産、データ、改善を、実務で使える仕組みとして読み解きます。
          </p>
        </div>
        <nav aria-label="フッター主要リンク">
          <p className="text-sm font-bold text-white">サイトを使う</p>
          <ul className="mt-3 grid gap-2 text-sm text-slate-400">
            {primaryNavigation.map((item) => (
              <li key={item.href}><Link href={item.href} className="hover:text-white">{item.label}</Link></li>
            ))}
          </ul>
        </nav>
        <nav aria-label="フッター補助リンク">
          <p className="text-sm font-bold text-white">関連情報</p>
          <ul className="mt-3 grid gap-2 text-sm text-slate-400">
            {supportLinks.map((item) => (
              <li key={item.href}><Link href={item.href} className="hover:text-white">{item.label}</Link></li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="border-t border-slate-800 px-4 py-5 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} {siteIdentity.name}
      </div>
    </footer>
  );
}
