import Link from "next/link";

const primaryLinks = [
  { href: "/", label: "ホーム", description: "全体入口" },
  { href: "/learn", label: "学習方針", description: "何から学ぶか" },
  { href: "/guides", label: "ガイド", description: "個別テーマ" },
  { href: "/tools", label: "演習・ツール", description: "操作して練習" },
  { href: "/references", label: "参考資料", description: "白書・過去問" },
];

const guideLinks = [
  { href: "/guides/qc", label: "QC" },
  { href: "/guides/stat", label: "統計" },
  { href: "/guides/engineer", label: "技術士" },
  { href: "/guides/engineer/learning-map", label: "学習マップ" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <Link href="/" className="text-lg font-black tracking-tight text-slate-950 hover:text-teal-700">
            n-ie-qclab
          </Link>
          <span className="hidden text-xs text-slate-500 sm:inline">
            経営工学・品質管理・統計の学習ラボ
          </span>
        </div>

        <nav className="flex flex-wrap gap-2 text-sm" aria-label="主要ナビゲーション">
          {primaryLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-1.5 font-semibold text-slate-700 hover:bg-slate-100 hover:text-teal-700"
            >
              <span className="block leading-5">{item.label}</span>
              <span className="hidden text-[11px] font-normal leading-4 text-slate-500 xl:block">{item.description}</span>
            </Link>
          ))}
        </nav>
      </div>

      <div className="border-t border-slate-100 bg-slate-50">
        <nav className="mx-auto flex max-w-6xl flex-wrap gap-2 px-4 py-2 text-xs" aria-label="分野別ショートカット">
          <span className="py-1.5 font-bold text-slate-700">分野別</span>
          {guideLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full border border-slate-200 bg-white px-3 py-1.5 font-semibold text-slate-700 hover:border-teal-300 hover:text-teal-700"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
