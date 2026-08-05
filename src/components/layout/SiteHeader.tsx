import Link from "next/link";

import { primaryNavigation, siteIdentity } from "@/data/n-ie-lab";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-5 px-4 py-3">
        <Link href="/" className="min-w-0 text-slate-950 hover:text-teal-700">
          <span className="block text-lg font-black leading-5">{siteIdentity.name}</span>
          <span className="hidden text-xs leading-5 text-slate-500 sm:block">品質・生産・データをつなぐ経営工学メディア</span>
        </Link>

        <nav className="hidden items-center gap-1 text-sm lg:flex" aria-label="主要ナビゲーション">
          {primaryNavigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 font-semibold text-slate-700 hover:bg-slate-100 hover:text-teal-700"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <details className="relative lg:hidden">
          <summary className="cursor-pointer list-none rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-bold text-slate-800 hover:border-teal-500 [&::-webkit-details-marker]:hidden">
            メニュー
          </summary>
          <nav
            className="absolute right-0 mt-2 w-72 rounded-lg border border-slate-200 bg-white p-2 shadow-lg"
            aria-label="モバイルナビゲーション"
          >
            {primaryNavigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-md px-3 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100 hover:text-teal-700"
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-2 border-t border-slate-100 pt-2">
              <Link href="/services" className="block rounded-md px-3 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100">
                相談できる内容
              </Link>
              <Link href="/contact" className="block rounded-md px-3 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100">
                お問い合わせ
              </Link>
            </div>
          </nav>
        </details>
      </div>
    </header>
  );
}
