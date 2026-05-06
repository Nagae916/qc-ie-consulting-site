import Link from "next/link";

const primaryLinks = [
  { href: "/", label: "ホーム" },
  { href: "/guides/engineer/learning-map", label: "学習マップ" },
  { href: "/guides/engineer", label: "技術士" },
  { href: "/guides/qc", label: "品質管理" },
  { href: "/guides/stat", label: "統計" },
  { href: "/guides", label: "サイトマップ" },
];

const engineerLinks = [
  { href: "/guides/engineer/first-exam-roadmap", label: "第一次試験" },
  { href: "/guides/engineer/past-exam-trend-map", label: "過去問トレンド" },
  { href: "/guides/engineer/issue-decomposition-matrix", label: "課題分解" },
  { href: "/guides/engineer/answer-structure-builder", label: "答案骨子" },
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
              className="rounded-full px-3 py-1.5 font-semibold text-slate-700 hover:bg-slate-100 hover:text-teal-700"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="border-t border-slate-100 bg-slate-50">
        <nav className="mx-auto flex max-w-6xl flex-wrap gap-2 px-4 py-2 text-xs" aria-label="技術士ショートカット">
          <span className="py-1.5 font-bold text-emerald-800">技術士ショートカット</span>
          {engineerLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full border border-emerald-100 bg-white px-3 py-1.5 font-semibold text-emerald-800 hover:border-emerald-300"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
