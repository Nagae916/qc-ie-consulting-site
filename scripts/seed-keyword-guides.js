const fs = require("fs");
const path = require("path");

const root = process.cwd();

const statKeywords = [
  ["descriptive-statistics", "記述統計", "平均・中央値・分散などでデータの全体像をつかむ"],
  ["mean-median-mode", "平均・中央値・最頻値", "代表値の違いを理解し、外れ値に強い見方を選ぶ"],
  ["variance-standard-deviation", "分散と標準偏差", "ばらつきの大きさを定量的に読む"],
  ["histogram", "ヒストグラム", "分布の形、中心、ばらつき、外れ値を確認する"],
  ["boxplot", "箱ひげ図", "中央値・四分位範囲・外れ値を一目で比較する"],
  ["scatterplot", "散布図", "2つの変数の関係性を視覚的に確認する"],
  ["correlation", "相関係数", "変数同士の直線的な関係の強さを読む"],
  ["spurious-correlation", "疑似相関", "相関があっても因果とは限らないことを理解する"],
  ["sampling", "サンプリング", "母集団から偏りなくデータを取る考え方を学ぶ"],
  ["sampling-bias", "サンプリングバイアス", "集め方による偏りを見抜く"],
  ["population-sample", "母集団と標本", "知りたい対象と手元のデータを区別する"],
  ["confidence-interval", "信頼区間", "推定値の不確実性を幅で表す"],
  ["hypothesis-testing", "仮説検定", "差や関係が偶然で説明できるか判断する"],
  ["p-value", "p値", "観測結果がどれくらい珍しいかを読む"],
  ["significance-level", "有意水準", "判断基準としての5%や1%の意味を理解する"],
  ["type-one-two-error", "第一種・第二種の過誤", "誤って差あり/差なしと判断するリスクを理解する"],
  ["test-power", "検出力", "本当に差があるときに見つけられる力を理解する"],
  ["effect-size", "効果量", "統計的有意性だけでなく差の大きさを見る"],
  ["t-test", "t検定", "2群の平均差を判断する"],
  ["paired-t-test", "対応のあるt検定", "同じ対象の前後差を判断する"],
  ["anova", "分散分析", "3群以上の平均差を判断する"],
  ["f-test", "F検定", "分散の違いを判断する"],
  ["chi-square-test", "カイ二乗検定", "カテゴリ同士の関係を判断する"],
  ["linear-regression", "単回帰分析", "1つの要因と結果の関係を直線で見る"],
  ["multiple-regression", "重回帰分析", "複数要因から目的変数を説明する"],
  ["logistic-regression", "ロジスティック回帰", "発生する/しないの確率を説明する"],
  ["multicollinearity", "多重共線性", "説明変数同士が強く関係する問題を理解する"],
  ["r-squared", "決定係数", "回帰モデルの説明力を読む"],
  ["residual-analysis", "残差分析", "モデルで説明しきれないずれを確認する"],
  ["normal-distribution", "正規分布", "多くの統計手法の前提となる分布を理解する"],
  ["binomial-distribution", "二項分布", "成功/失敗の回数を扱う分布を理解する"],
  ["poisson-distribution", "ポアソン分布", "一定範囲での発生回数を扱う"],
  ["central-limit-theorem", "中心極限定理", "標本平均が正規分布に近づく考え方を学ぶ"],
  ["bayes-theorem", "ベイズの定理", "事前情報と観測結果から確率を更新する"],
  ["control-chart-basics", "管理図の基礎", "工程が安定しているかを時系列で見る"],
  ["process-capability", "工程能力", "規格に対して工程のばらつきが十分小さいかを見る"],
  ["cp-cpk", "Cp・Cpk", "工程能力指数を使って工程の余裕を評価する"],
  ["measurement-error", "測定誤差", "測定値に含まれるずれとばらつきを理解する"],
  ["msa", "測定システム解析", "測定者や測定器によるばらつきを評価する"],
  ["outlier", "外れ値", "異常値と自然なばらつきを区別する"],
  ["missing-values", "欠損値", "欠けたデータの扱い方を理解する"],
  ["data-preprocessing", "前処理", "分析前にデータを整える考え方を学ぶ"],
  ["train-test-split", "学習データとテストデータ", "モデル評価でデータを分ける理由を理解する"],
  ["cross-validation", "交差検証", "モデルの汎化性能を安定して評価する"],
  ["overfitting", "過学習", "手元データに合わせすぎる問題を理解する"],
  ["classification-metrics", "分類評価指標", "正解率・適合率・再現率を使い分ける"],
  ["confusion-matrix", "混同行列", "分類モデルの当たり外れを分解して見る"],
  ["roc-auc", "ROC曲線とAUC", "分類モデルのしきい値と識別性能を理解する"],
  ["clustering", "クラスタリング", "似ているデータをグループに分ける"],
  ["principal-component-analysis", "主成分分析", "多くの変数を少ない軸で要約する"],
];

const engineerKeywords = [
  ["ie-overview", "IEの基本", "作業・工程・情報の流れを科学的に改善する考え方"],
  ["work-measurement", "作業測定", "標準時間を設定し改善余地を見つける"],
  ["time-study", "時間研究", "作業時間を観測して標準化につなげる"],
  ["motion-study", "動作研究", "ムダな動作を減らして作業を改善する"],
  ["standard-time", "標準時間", "作業計画や能力計画の基準となる時間を理解する"],
  ["line-balancing", "ラインバランシング", "工程間の負荷をならして流れを良くする"],
  ["bottleneck", "ボトルネック", "全体能力を制約する工程を見つける"],
  ["toc", "制約理論", "制約に着目して全体最適を進める"],
  ["layout-planning", "レイアウト計画", "人・物・情報の流れを考えた配置を設計する"],
  ["material-handling", "マテリアルハンドリング", "運搬・保管・移動を効率化する"],
  ["production-planning", "生産計画", "需要と能力を踏まえて生産量と時期を決める"],
  ["capacity-planning", "能力計画", "必要量に対して設備・人員能力を整える"],
  ["aggregate-planning", "総合生産計画", "中期的な需要と供給能力を調整する"],
  ["mrp", "MRP", "部品表と計画から資材所要量を計算する"],
  ["bom", "部品表（BOM）", "製品を構成する部品と数量を管理する"],
  ["scheduling", "スケジューリング", "作業順序と納期を考えて計画する"],
  ["dispatching-rule", "ディスパッチングルール", "現場で次に処理する仕事の優先順位を決める"],
  ["jit", "JIT", "必要なものを必要な時に必要な量だけ流す"],
  ["kanban", "かんばん方式", "後工程引取りで生産と補充を制御する"],
  ["lot-sizing", "ロットサイズ", "段取りと在庫のバランスで生産単位を決める"],
  ["inventory-management", "在庫管理", "欠品と過剰在庫のバランスを取る"],
  ["safety-stock", "安全在庫", "需要変動やリードタイム変動に備える在庫を設計する"],
  ["eoq", "経済的発注量", "発注費用と保管費用の合計を小さくする"],
  ["abc-analysis", "ABC分析", "重要度に応じて管理水準を変える"],
  ["demand-forecasting", "需要予測", "過去データや市場情報から需要を見積もる"],
  ["sop", "S&OP", "販売計画と生産計画を部門横断で合わせる"],
  ["psi", "PSI管理", "販売・生産・在庫をつなげて全体を見る"],
  ["supply-chain-management", "SCM", "調達から販売までの流れを最適化する"],
  ["logistics", "ロジスティクス", "物流・保管・配送を総合的に設計する"],
  ["warehouse-management", "倉庫管理", "入出庫・保管・ピッキングを効率化する"],
  ["transportation-planning", "輸配送計画", "配送ルートや積載効率を考える"],
  ["service-management", "サービスマネジメント", "サービス品質と顧客価値を管理する"],
  ["service-quality", "サービス品質", "期待と知覚の差から品質を捉える"],
  ["qfd", "品質機能展開", "顧客要求を設計品質へ展開する"],
  ["tqm", "TQM", "全員参加で品質を経営に結びつける"],
  ["kaizen", "改善活動", "小さな改善を継続して成果につなげる"],
  ["pdca", "PDCA", "計画・実行・確認・処置を回す"],
  ["risk-management", "リスクマネジメント", "不確実性を識別し対応策を設計する"],
  ["fmea", "FMEA", "故障モードと影響を事前に評価する"],
  ["reliability-maintenance", "信頼性・保全", "故障しにくさと復旧しやすさを管理する"],
  ["tpm", "TPM", "設備効率を高める全員参加の保全活動"],
  ["life-cycle-cost", "ライフサイクルコスト", "取得から廃棄までの総費用で考える"],
  ["cost-management", "原価管理", "原価構造を理解し改善につなげる"],
  ["value-engineering", "VE", "機能とコストの関係から価値を高める"],
  ["project-management", "プロジェクトマネジメント", "品質・コスト・納期・リスクを統合して進める"],
  ["earned-value-management", "EVM", "進捗とコストを統合して管理する"],
  ["decision-making", "意思決定", "複数案を評価し合理的に選ぶ"],
  ["operations-research", "OR", "数理モデルで最適な意思決定を支援する"],
  ["linear-programming", "線形計画法", "制約条件のもとで目的関数を最適化する"],
  ["simulation", "シミュレーション", "現実の仕組みをモデル化して影響を試す"],
];

function titleToSlug(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function quiz(keyword, area) {
  return `<GuideQuiz
  questions={[
    {
      level: 'basic',
      question: '${keyword}で最初に押さえるべきことはどれですか？',
      choices: ['用語の定義と何に使うか', '細かな例外だけ', '暗記した式だけ'],
      answer: 0,
      explanation: 'まずは定義と使いどころを押さえると、試験問題でも実務でも判断しやすくなります。',
    },
    {
      level: 'standard',
      question: '${keyword}を学ぶときに大切な姿勢はどれですか？',
      choices: ['目的・入力・判断結果をセットで理解する', '名称だけを覚える', '他の手法との違いを見ない'],
      answer: 0,
      explanation: '${area}では、用語単体ではなく、何を入力し、何を判断するための考え方かを説明できることが重要です。',
    },
  ]}
/>`;
}

function mdx({ exam, slug, title, summary, area, status }) {
  const section = exam === "stat" ? "統計" : "技術士";
  const isEngineer = exam === "engineer";
  const adoption = isEngineer
    ? "製造業、物流業、サービス業、公共インフラなどで、品質・コスト・納期・リスクを同時に管理する場面で活用されます。"
    : "製造品質、マーケティング、医療、金融、Webサービスなどで、データに基づく判断やモデル評価に活用されます。";
  const future = isEngineer
    ? "今後は、データ取得、AI、シミュレーション、現場改善を組み合わせ、より早く異常を検知し、全体最適を実現する方向に進みます。"
    : "今後は、統計の基礎に加えて、機械学習、生成AI、因果推論、データ倫理と組み合わせた実務活用が重要になります。";
  return `---
title: "${title}スタディガイド"
exam: "${exam}"
slug: "${slug}"
section: "${section}"
description: "${summary}"
tags: ["${section}", "${title}", "キーワード"]
status: "${status}"
date: "2026-05-01"
updatedAt: "2026-05-01"
---

# ${title}スタディガイド

<div className="guide-hero">
  <p className="guide-kicker">ここだけは押さえよう</p>
  <h2>${title}は、${summary}ための考え方です。</h2>
  <p>このページでは、定義、使う場面、課題、実務での活用、今後の展望までを一気に押さえます。</p>
</div>

## 1. そもそもどんなものなの？

${title}は、${summary}ために使います。
単なる用語として覚えるのではなく、「何を入力し、何を判断し、どのような行動につなげるか」をセットで理解します。

## 2. 大まかな特徴は？使うシーンやメリットは？

<div className="guide-grid">
  <div className="guide-card">
    <h3>特徴</h3>
    <p>対象を構造化し、判断の根拠を明確にしやすい点が特徴です。</p>
  </div>
  <div className="guide-card">
    <h3>使うシーン</h3>
    <p>問題の把握、比較、予測、改善案の検討、効果確認の場面で使います。</p>
  </div>
  <div className="guide-card">
    <h3>メリット</h3>
    <p>経験や勘だけに頼らず、説明可能な判断につなげられます。</p>
  </div>
</div>

## 3. 技術的な課題は？

適用条件を誤ると、見かけ上は正しそうでも実務では使えない判断になります。
データ品質、前提条件、現場制約、運用体制を確認することが重要です。

<div className="guide-callout">
  試験では「使えばよい」ではなく、前提条件、限界、導入時の留意点まで書けると答案の説得力が上がります。
</div>

## 4. 実際に採用、活用されている企業やシーンは？

${adoption}
企業名を暗記するよりも、どの業種・業務プロセスで使われるかを押さえる方が応用しやすくなります。

## 5. 今後の展望は？

${future}
${area}の学習では、単独のキーワードではなく、他の手法やデジタル技術とどう組み合わせるかが重要になります。

## 6. 理解度クイズ

${quiz(title, section)}

## 7. 500字でまとめてみよう

<div className="guide-card">
  <h3>まとめ練習</h3>
  <p>
    ${title}について、定義、特徴、使う場面、課題、今後の展望を含めて500字でまとめてみましょう。
    技術士やデータサイエンスの学習では、説明できる形にすることで理解が定着します。
  </p>
</div>
`;
}

function writeGuide(exam, item, area, status) {
  const [slug, title, summary] = item;
  const file = path.join(root, "content", "guides", exam, `${slug || titleToSlug(title)}.mdx`);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, mdx({ exam, slug, title, summary, area, status }), "utf8");
}

for (const [index, item] of statKeywords.entries()) {
  writeGuide("stat", item, "統計・データサイエンス", index < 8 ? "published" : "draft");
}

for (const [index, item] of engineerKeywords.entries()) {
  writeGuide("engineer", item, "経営工学・技術士", index < 12 ? "published" : "draft");
}

console.log(`Generated ${statKeywords.length} stat guides and ${engineerKeywords.length} engineer guides.`);
console.log("Published keyword guides: 8 stat + 12 engineer. The remaining keyword guides are draft.");
