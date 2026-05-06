export type SiteSectionKey = "learning" | "guides" | "tools" | "references";

export type SiteSection = {
  key: SiteSectionKey;
  title: string;
  description: string;
  href: string;
  examples: string[];
};

export const siteSections: SiteSection[] = [
  {
    key: "learning",
    title: "学習方針",
    description: "何をどの順で学び、試験や実務へどう接続するかを確認する入口です。",
    href: "/learn",
    examples: ["経営工学 学習マップ", "技術士第一次試験ロードマップ", "統計学習ロードマップ"],
  },
  {
    key: "guides",
    title: "ガイド",
    description: "個別テーマを学ぶ学習コンテンツです。用語、手法、考え方を1テーマずつ整理します。",
    href: "/guides",
    examples: ["記述統計", "データ型と尺度", "実験計画法", "OC曲線"],
  },
  {
    key: "tools",
    title: "演習・ツール",
    description: "入力、選択、可視化を使って考える教材や、答案作成・分析支援の入口です。",
    href: "/tools",
    examples: ["答案骨子ビルダー", "課題分解マトリクス", "過去問トレンドマップ", "統計・QC教材"],
  },
  {
    key: "references",
    title: "参考資料",
    description: "白書、法令、過去問データ、参考リンク、年度別トピックを整理する入口です。",
    href: "/references",
    examples: ["ものづくり白書", "物流2024年問題", "過去問データ", "年度別主要トピック"],
  },
];

