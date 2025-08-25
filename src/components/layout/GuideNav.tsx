import Link from "next/link";
import { guideUrl, guidesQcTop } from "@/lib/routes";

const items = [
  { href: guidesQcTop, label: "QC検定トップ" },
  { href: guideUrl("qc-seven-tools"), label: "QC七つ道具" },
  { href: guideUrl("new-qc-seven-tools"), label: "新QC七つ道具" },
  { href: guideUrl("stat-tests"), label: "検定（入口）" },
  { href: guideUrl("regression-anova"), label: "回帰・分散分析（入口）" }
];

export function GuideNav() {
  return (
    <nav className="flex flex-wrap gap-3">
      {items.map((it) => (
        <Link key={it.href} href={it.href} className="text-sm text-blue-700 hover:underline">
          {it.label}
        </Link>
      ))}
    </nav>
  );
}
