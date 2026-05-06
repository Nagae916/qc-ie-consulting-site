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
  whenToUse?: string;
  steps?: string[];
  outcome?: string;
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
    whenToUse: "抜取検査の判定条件とリスクを説明したいとき。",
    steps: ["n と c を変える", "AQL/RQLで合格確率を見る", "生産者・消費者リスクを説明する"],
    outcome: "検査設計の妥当性やリスク説明に使えます。",
    status: "usable",
    category: "品質管理",
  },
  {
    title: "可用性シミュレーター",
    href: "/tools/availability-simulator",
    summary: "MTBF・MTTRから稼働率を計算し、改善施策の優先度を体感。",
    whenToUse: "設備停止や保全改善の効果を数値で比較したいとき。",
    steps: ["MTBFを入力する", "MTTRを入力する", "稼働率の変化を見る"],
    outcome: "保全施策の優先順位や改善効果の説明に使えます。",
    status: "usable",
    category: "品質管理",
  },
  {
    title: "管理図ツール",
    href: "/tools/control-chart",
    summary: "Xbar-R、np、p、u管理図の考え方をサンプルデータで確認。",
    whenToUse: "工程が安定しているか、異常の兆候がないかを確認したいとき。",
    steps: ["管理図の種類を選ぶ", "点のばらつきを見る", "管理限界との関係を確認する"],
    outcome: "工程監視や異常原因調査の入口として使えます。",
    status: "usable",
    category: "品質管理",
  },
  {
    title: "カイ二乗ツール",
    href: "/tools/chi-square",
    summary: "クロス集計から期待度数、自由度、p値までを順に確認。",
    whenToUse: "カテゴリ同士の関係や偏りを検定したいとき。",
    steps: ["クロス集計を確認する", "期待度数を見る", "p値と結論を読む"],
    outcome: "不良分類やアンケート結果の関係性説明に使えます。",
    status: "usable",
    category: "統計",
  },
  {
    title: "単回帰分析ツール",
    href: "/tools/simple-linear-regression",
    summary: "散布図と回帰直線を見ながら、傾き・切片・決定係数を確認。",
    whenToUse: "2つの数値の関係性や予測式を説明したいとき。",
    steps: ["散布図を見る", "回帰直線を確認する", "決定係数で説明力を見る"],
    outcome: "要因と結果の関係を改善仮説へ接続できます。",
    status: "usable",
    category: "統計",
  },
  {
    title: "答案骨子ビルダー",
    href: "/guides/engineer/answer-structure-builder",
    summary: "課題、解決策、リスク、倫理・持続可能性を技術士答案の骨子に整理。",
    whenToUse: "問題文を読んだあと、答案の構成を崩さず組み立てたいとき。",
    steps: ["設問要求を整理する", "課題と解決策を入力する", "リスク・倫理・効果を確認する"],
    outcome: "答案の見出し、論点、抜け漏れ確認に使えます。",
    status: "usable",
    category: "技術士",
  },
  {
    title: "課題分解マトリクス",
    href: "/guides/engineer/issue-decomposition-matrix",
    summary: "複数の観点から課題を比較し、最重要課題の選定を練習。",
    whenToUse: "技術士二次で、課題を複数挙げて最重要課題を選ぶ練習をしたいとき。",
    steps: ["観点を選ぶ", "課題候補を比較する", "重要度と根拠を整理する"],
    outcome: "課題抽出の説得力と、選定理由の一貫性を高められます。",
    status: "usable",
    category: "技術士",
  },
  {
    title: "過去問トレンドマップ",
    href: "/guides/engineer/past-exam-trend-map",
    summary: "技術士 経営工学の過去問をテーマ、年度、設問パターンで確認。",
    whenToUse: "出題傾向を把握し、重点的に練習するテーマを決めたいとき。",
    steps: ["年度とテーマを見る", "設問パターンを確認する", "演習テーマを選ぶ"],
    outcome: "学習計画や答案練習の優先順位づけに使えます。",
    status: "usable",
    category: "技術士",
  },
  {
    title: "問題マトリクス",
    href: "/guides/engineer/problem-matrix",
    summary: "出題テーマと論点を表で整理し、演習計画に接続。",
    whenToUse: "テーマ、論点、答案要素を横断して確認したいとき。",
    steps: ["テーマを確認する", "論点の抜けを探す", "演習する問題を決める"],
    outcome: "弱点テーマの発見と、演習順の設計に使えます。",
    status: "usable",
    category: "技術士",
  },
  {
    title: "理解度チェック",
    href: "/tools/quiz",
    summary: "学習した内容を短い問いで確認。",
    whenToUse: "ガイドを読んだあと、理解が残っているかを確認したいとき。",
    steps: ["短い問いに答える", "解説を見る", "苦手なテーマへ戻る"],
    outcome: "復習対象を見つけるために使えます。",
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
