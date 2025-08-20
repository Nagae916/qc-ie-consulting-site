export type BlogPost = {
  id: string;
  title: string;
  date: string;     // "2025-08-18"
  tags: string[];
  excerpt: string;
  body: string;     // 簡易本文（Markdown風のプレーンテキストでOK）
};

export const posts: BlogPost[] = [
  {
    id: "intro-qc-ie",
    title: "QC×IEで成果を出すための最短コース",
    date: "2025-08-15",
    tags: ["入門", "QC", "IE"],
    excerpt: "初回ヒアリング〜早期効果創出〜長期定着までの伴走方針をまとめました。",
    body:
      "現場観察→KPI定義→短期の火消し→データ解析/IE→仕組み化→教育・監査…という流れで、"
      + "再現性のある改善サイクルを構築します。"
  },
  {
    id: "spc-check",
    title: "SPC運用が形骸化しやすい3つのポイント",
    date: "2025-08-10",
    tags: ["SPC", "運用"],
    excerpt: "管理図は描いて終わり？よくある落とし穴と対策。",
    body:
      "①責任の所在が曖昧、②ルール違反時の是正プロセス欠如、③教育と監査の不足。"
      + "役割の明確化とルール設計、例外時の標準化が鍵になります。"
  },
];
