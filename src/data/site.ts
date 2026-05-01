export type LearningPillar = {
  key: string;
  title: string;
  href: string;
  summary: string;
};

export type LabTool = {
  title: string;
  href: string;
  summary: string;
  status: "usable" | "draft";
  category: string;
};

export type SocialChannel = {
  name: string;
  handle: string;
  href: string;
  purpose: string;
};

export const learningPillars: LearningPillar[] = [
  {
    key: "qc",
    title: "品質管理",
    href: "/guides/qc",
    summary: "QC七つ道具、抜取検査、信頼性、日常管理を実務の判断につなげます。",
  },
  {
    key: "stat",
    title: "統計",
    href: "/guides/stat",
    summary: "検定、回帰、分散分析を、現場データの読み方として整理します。",
  },
  {
    key: "engineer",
    title: "技術士",
    href: "/guides/engineer/learning-map",
    summary: "IE、生産管理、保全、論文構成をキャリア形成と試験対策に接続します。",
  },
];

export const labTools: LabTool[] = [
  {
    title: "OC曲線シミュレーター",
    href: "/tools/oc-simulator",
    summary: "サンプルサイズ n と合格判定個数 c を動かし、AQL/RQLでのリスクを確認。",
    status: "usable",
    category: "品質管理",
  },
  {
    title: "可用性シミュレーター",
    href: "/tools/availability-simulator",
    summary: "MTBF・MTTRから稼働率を計算し、改善施策の優先度を体感。",
    status: "usable",
    category: "品質管理",
  },
  {
    title: "管理図ツール",
    href: "/tools/control-chart",
    summary: "Xbar-R、np、p、u管理図の考え方をサンプルデータで確認。",
    status: "usable",
    category: "品質管理",
  },
  {
    title: "カイ二乗ツール",
    href: "/tools/chi-square",
    summary: "クロス集計から期待度数、自由度、p値までを順に確認。",
    status: "usable",
    category: "統計",
  },
  {
    title: "単回帰分析ツール",
    href: "/tools/simple-linear-regression",
    summary: "散布図と回帰直線を見ながら、傾き・切片・決定係数を確認。",
    status: "usable",
    category: "統計",
  },
  {
    title: "理解度チェック",
    href: "/tools/quiz",
    summary: "学習した内容を短い問いで確認。",
    status: "usable",
    category: "学習",
  },
];

export const socialChannels: SocialChannel[] = [
  {
    name: "note",
    handle: "nieqc_0713",
    href: "https://note.com/nieqc_0713",
    purpose: "考え方、経験談、キャリア形成を深く残す場所",
  },
  {
    name: "Instagram",
    handle: "n.ieqclab",
    href: "https://www.instagram.com/n.ieqclab",
    purpose: "図解、短い学習メモ、保存したくなる要点を届ける場所",
  },
  {
    name: "X",
    handle: "n_ieqclab",
    href: "https://twitter.com/n_ieqclab",
    purpose: "日々の気づき、更新通知、公的情報の速報的な整理を流す場所",
  },
];

export const contentIdeas = [
  {
    channel: "note",
    ideas: ["品質管理をキャリアの軸にする考え方", "現場で統計が役に立った/立たなかった事例", "技術士学習の週次ふり返り"],
  },
  {
    channel: "Instagram",
    ideas: ["QC用語1枚図解", "検定の選び方チャート", "技術士キーワードカード"],
  },
  {
    channel: "X",
    ideas: ["公的機関の資料リンクと一言要約", "今日のQC問いかけ", "note/サイト更新の短文告知"],
  },
];
