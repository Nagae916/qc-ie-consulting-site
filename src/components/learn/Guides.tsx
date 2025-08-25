// src/components/learn/Guides.tsx
export type GuideMeta = {
  id: string;
  title: string;
  description: string;
  tags?: string[];
};

// id は pages/guide/[id].tsx の対応表と一致させること
export const GUIDES: GuideMeta[] = [
  {
    id: "regression-anova",
    title: "回帰分析・分散分析スタディガイド",
    description: "目的に応じて手法を選べるナビ＋用語・理解度チェック付き",
    tags: ["統計", "QC"],
  },
  {
    id: "stat-tests",
    title: "統計手法スタディガイド（t / Z / F / χ² / ANOVA）",
    description: "平均・分散・カテゴリの観点から最適な検定をナビゲート",
    tags: ["検定", "品質管理"],
  },
  {
    id: "qc-seven-tools",
    title: "QC七つ道具",
    description: "現場のデータ整理・可視化・安定化の定番ツール群",
    tags: ["QC", "現場改善"],
  },
  {
    id: "new-qc-seven-tools",
    title: "新QC七つ道具",
    description: "定性情報の整理や計画立案に強い7手法",
    tags: ["IE", "企画設計"],
  },
];
