export type LearningPillar = {
  key: string;
  title: string;
  href: string;
  summary: string;
  topics: string[];
};

export type LabTool = {
  title: string;
  href: string;
  summary: string;
  status: "usable" | "draft";
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
    summary: "QC七つ道具、信頼性、抜取検査、日常管理を実務の判断に結びつける領域。",
    topics: ["QC七つ道具", "OC曲線", "信頼性", "日常管理"],
  },
  {
    key: "stat",
    title: "統計",
    href: "/guides/stat",
    summary: "検定、回帰、分散分析を、現場データの見方と説明力に変える領域。",
    topics: ["検定", "回帰分析", "分散分析", "管理図"],
  },
  {
    key: "engineer",
    title: "技術士",
    href: "/guides/engineer",
    summary: "生産・IE・保全・論文構成を、キャリア形成と試験対策の両方で整理する領域。",
    topics: ["IE", "PSI", "保全", "論文設計"],
  },
];

export const labTools: LabTool[] = [
  {
    title: "OC曲線シミュレーター",
    href: "/tools/oc-simulator",
    summary: "サンプルサイズ n と合格判定個数 c を動かし、AQL/RQLでのリスクを確認。",
    status: "usable",
  },
  {
    title: "可用性シミュレーター",
    href: "/tools/availability-simulator",
    summary: "MTBF・MTTRから稼働率を計算し、改善施策の優先度を体感。",
    status: "usable",
  },
  {
    title: "管理図ツール",
    href: "/tools/control-chart",
    summary: "Xbar-R、np、p、u管理図の考え方をサンプルデータで確認。",
    status: "usable",
  },
  {
    title: "カイ二乗ツール",
    href: "/tools/chi-square",
    summary: "クロス集計から期待度数、自由度、p値までを順に確認。",
    status: "usable",
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
