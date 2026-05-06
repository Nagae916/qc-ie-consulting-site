export type InsightCategory =
  | "whitepaper"
  | "law"
  | "standard"
  | "logistics"
  | "dx"
  | "quality"
  | "statistics";

export type InsightItem = {
  title: string;
  source: string;
  category: InsightCategory;
  href: string;
  date?: string;
  summary: string;
};

export const insightItems: InsightItem[] = [
  {
    title: "ものづくり白書",
    source: "経済産業省",
    category: "whitepaper",
    href: "https://www.meti.go.jp/report/whitepaper/mono/",
    summary: "製造業の構造変化、人材、サプライチェーン、GX・DXなど、経営工学や技術士答案の背景整理に使いやすい一次情報です。",
  },
  {
    title: "中小企業白書",
    source: "中小企業庁",
    category: "whitepaper",
    href: "https://www.chusho.meti.go.jp/pamflet/hakusyo/",
    summary: "中小企業の経営課題、価格転嫁、人材確保、生産性向上を整理できます。実務改善や答案の社会背景に接続しやすい資料です。",
  },
  {
    title: "DX白書",
    source: "情報処理推進機構",
    category: "dx",
    href: "https://www.ipa.go.jp/digital/chousa/dx-trend/",
    summary: "DX推進、人材、データ活用、組織変革を確認できます。製造業DXやデータサイエンス学習の文脈整理に役立ちます。",
  },
  {
    title: "物流2024年問題",
    source: "国土交通省",
    category: "logistics",
    href: "https://www.mlit.go.jp/seisakutokatsu/freight/seisakutokatsu_tk4_000026.html",
    summary: "物流効率化、荷待ち削減、商慣行見直しなど、生産・物流マネジメントと技術士答案に直結するテーマです。",
  },
  {
    title: "下請法・価格転嫁",
    source: "公正取引委員会",
    category: "law",
    href: "https://www.jftc.go.jp/",
    summary: "取引適正化、価格転嫁、サプライチェーン全体の持続性を考えるための入口です。調達・品質保証にも関係します。",
  },
  {
    title: "ISO/QMS・標準化",
    source: "日本産業標準調査会",
    category: "standard",
    href: "https://www.jisc.go.jp/",
    summary: "標準化、品質マネジメント、規格適合の観点を確認できます。QMS改善や内部監査の考え方につなげます。",
  },
  {
    title: "データサイエンス教育・統計リテラシー",
    source: "文部科学省",
    category: "statistics",
    href: "https://www.mext.go.jp/",
    summary: "数理・データサイエンス・AI教育の方向性を確認できます。統計学習を実務の意思決定力へつなげる背景資料です。",
  },
];
