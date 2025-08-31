// pages/index.tsx
import Link from "next/link";
import dynamic from "next/dynamic";
import type { GetStaticProps } from "next";
import { allGuides, type Guide } from "contentlayer/generated";

/** ========= 基本設定 ========= */
type ExamKey = "qc" | "stat" | "engineer";

const EXAM_LABEL: Record<ExamKey, string> = {
  qc: "品質管理",
  stat: "統計",
  engineer: "技術士",
};

const EXAM_DESC: Record<ExamKey, string> = {
  qc: "現場改善・QC手法の要点をコンパクトに。QC七つ道具／新QC七つ道具など。",
  stat: "検定・推定・管理図など。品質・R&Dで使う統計を実務目線で整理。",
  engineer: "学習計画や要点整理を中心に、効率よく得点力を高めるナレッジ。",
};

// カラールール（QC=薄いオレンジ / 統計=青 / 技術士=緑）
const COLORS = {
  qc: { badgeDot: "text-[#D26B00]", headerBg: "bg-[#FFE5CC]", button: "bg-[#F28C28] hover:bg-[#e87f18] text-white" },
  stat: { badgeDot: "text-[#0058B0]", headerBg: "bg-[#CCE5FF]", button: "bg-[#2D75D3] hover:bg-[#1f62b5] text-white" },
  engineer: { badgeDot: "text-[#0F7A35]", headerBg: "bg-[#CCF5CC]", button: "bg-[#1E9E50] hover:bg-[#198543] text-white" },
} as const;

/** ========= フィード（SSR無効化で安全に） ========= */
const NewsFeed = dynamic(() => import("@/components/feeds/NewsFeed"), { ssr: false });
const Bloglist = dynamic(() => import("@/components/feeds/Bloglist"), { ssr: false });
const NoteFeed = dynamic(() => import("@/components/feeds/NoteFeed"), { ssr: false });
const XTimeline = dynamic(() => import("@/components/feeds/XTimeline"), { ssr: false });
const InstagramFeed = dynamic(() => import("@/components/feeds/InstagramFeed"), { ssr: false });

/** ========= ユーティリティ ========= */
const asExamKey = (v: Guide["exam"]): ExamKey | null =>
  v === "qc" || v === "stat" || v === "engineer" ? v : null;

// 並び替えキー（updatedAt → date）
const sortKey = (g: Guide) =>
  Date.parse(String((g as any).updatedAt ?? "")) ||
  Date.parse(String((g as any).date ?? "")) ||
  0;

/** ========= Props ========= */
type Props = {
  latestByExam: { qc: Guide[]; stat: Guide[]; engineer: Guide[] };
  latestAll: Guide[]; // 全体更新：最新10件
};

/** ========= ページ本体 ========= */
export default function Home({ latestByExam, latestAll }: Props) {
  // カテゴリカード（各カテゴリの更新2件付き）
  const CategoryCard = ({ exam }: { exam: ExamKey }) => {
    const color = COLORS[exam];
    const items = latestByExam[exam];

    return (
      <section className="rounded-2xl border border-black/5 bg-white shadow-sm overflow-hidden">
        {/* ヘッダー色帯 */}
        <div className={`${color.headerBg} px-6 py-4`}>
          <div className="flex items-center gap-2 text-sm text-black/70">
            <span className={`${color.badgeDot}`}>●</span>
            <span>{EXAM_LABEL[exam]}</span>
          </div>
          <h3 className="mt-1 text-xl font-bold text-black">
            {exam === "qc" ? "QC ガイド" : exam === "stat" ? "統計ガイド" : "技術士ガイド"}
          </h3>
          <p className="mt-1 text-sm text-black/70">{EXAM_DESC[exam]}</p>
          <div className="mt-3">
            <Link
              href={`/guides/${exam}`}
              className={`inline-flex items-center rounded-lg px-4 py-2 text-sm font-semibold ${color.button}`}
            >
              {exam === "qc" ? "QCのガイドを見る" : exam === "stat" ? "統計のガイドを見る" : "技術士のガイドを見る"}
            </Link>
          </div>
        </div>

        {/* 各カテゴリ 更新履歴（最新2件） */}
        <div className="px-6 py-5">
          <div className="rounded-xl border border-black/10 bg-white">
            <div className="border-b border-blac
