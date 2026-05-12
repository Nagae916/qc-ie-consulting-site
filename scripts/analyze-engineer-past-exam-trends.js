const fs = require('fs');
const path = require('path');

const DATA_PATH = 'public/data/engineer/past-exam-questions.json';
const REPORT_PATH = 'docs/engineer-past-exam-trend-analysis.md';

function readData() {
  return JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
}

function asArray(value) {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === 'string' && value.trim()) return [value.trim()];
  return [];
}

function addCount(map, key, amount = 1) {
  if (!key) return;
  map.set(key, (map.get(key) || 0) + amount);
}

function countBy(items, getter) {
  const map = new Map();
  for (const item of items) {
    const values = asArray(getter(item));
    for (const value of values) addCount(map, value);
  }
  return map;
}

function crossCount(items, rowGetter, valueGetter) {
  const rows = new Map();
  for (const item of items) {
    const row = rowGetter(item) || '未設定';
    if (!rows.has(row)) rows.set(row, new Map());
    const map = rows.get(row);
    for (const value of asArray(valueGetter(item))) addCount(map, value);
  }
  return rows;
}

function sortedEntries(map) {
  return [...map.entries()].sort((a, b) => b[1] - a[1] || String(a[0]).localeCompare(String(b[0]), 'ja'));
}

function topLabels(map, limit = 5) {
  return sortedEntries(map)
    .slice(0, limit)
    .map(([label, count]) => `${label}(${count})`)
    .join('、');
}

function markdownTable(headers, rows) {
  return [
    `| ${headers.join(' | ')} |`,
    `| ${headers.map(() => '---').join(' | ')} |`,
    ...rows.map((row) => `| ${row.map((cell) => String(cell ?? '').replace(/\n/g, '<br>')).join(' | ')} |`),
  ].join('\n');
}

function rankedTable(headers, entries, limit) {
  return markdownTable(headers, entries.slice(0, limit).map(([label, count], index) => [index + 1, label, count]));
}

function themeValues(q) {
  return [
    ...asArray(q.themeTags),
    ...asArray(q.tags),
    ...asArray(q.themes),
  ];
}

function keywordValues(q) {
  return [
    ...asArray(q.methodTags),
    ...asArray(q.relatedKeywords),
    ...asArray(q.keywords),
    ...asArray(q.lawTags),
  ];
}

function fieldCodeLabel(code) {
  if (code === 'common') return '共通';
  if (code === '1501') return '生産・物流マネジメント';
  if (code === '1502') return 'サービスマネジメント';
  return '未設定';
}

function coverageRows(questions) {
  const subjects = sortedEntries(countBy(questions, (q) => q.subjectType));
  const fields = sortedEntries(countBy(questions, (q) => q.fieldCode));
  return { subjects, fields };
}

function crossSummaryRows(cross, limit = 5) {
  return [...cross.entries()]
    .sort((a, b) => String(a[0]).localeCompare(String(b[0]), 'ja'))
    .map(([row, map]) => [row, topLabels(map, limit)]);
}

function subjectNarrative(subjectCounts, patternCross) {
  const count = (subject) => subjectCounts.get(subject) || 0;
  const patterns = (subject) => topLabels(patternCross.get(subject) || new Map(), 3);
  return [
    `- 必須科目Ⅰ: ${count('必須科目Ⅰ')}件。${patterns('必須科目Ⅰ')}が中心で、社会課題を経営工学上の課題に変換し、倫理・持続可能性まで展開する設問として扱う。`,
    `- 選択科目Ⅱ-1: ${count('選択科目Ⅱ-1')}件。${patterns('選択科目Ⅱ-1')}が中心で、定義、特徴、留意点、活用場面を短く説明できることが重要になる。`,
    `- 選択科目Ⅱ-2: ${count('選択科目Ⅱ-2')}件。${patterns('選択科目Ⅱ-2')}が中心で、業務手順、管理項目、関係者調整、効果確認を実務の流れとして整理する必要がある。`,
    `- 選択科目Ⅲ: ${count('選択科目Ⅲ')}件。${patterns('選択科目Ⅲ')}が中心で、専門領域の課題抽出、解決策、リスク、将来展望を一貫して組み立てる。`,
  ].join('\n');
}

function buildReport(data) {
  const questions = data.questions || [];
  const yearCounts = sortedEntries(countBy(questions, (q) => String(q.year))).sort((a, b) => Number(a[0]) - Number(b[0]));
  const subjectCounts = countBy(questions, (q) => q.subjectType);
  const fieldCodeCounts = countBy(questions, (q) => q.fieldCode);
  const fieldCounts = countBy(questions, (q) => q.field);
  const themeCounts = countBy(questions, themeValues);
  const keywordCounts = countBy(questions, keywordValues);
  const patternCounts = countBy(questions, (q) => q.questionPattern || q.questionPatterns);
  const competencyCounts = countBy(questions, (q) => q.assessedCompetencies);
  const answerFrameCounts = countBy(questions, (q) => q.answerFrameType);
  const skeletonCounts = countBy(questions, (q) => q.skeletonTemplateId);
  const yearTheme = crossCount(questions, (q) => q.eraYear || q.year, themeValues);
  const subjectTheme = crossCount(questions, (q) => q.subjectType, themeValues);
  const fieldTheme = crossCount(questions, (q) => q.fieldCode, themeValues);
  const subjectPattern = crossCount(questions, (q) => q.subjectType, (q) => q.questionPattern || q.questionPatterns);
  const fieldKeyword = crossCount(questions, (q) => q.fieldCode, keywordValues);
  const { subjects, fields } = coverageRows(questions);

  const fieldComparison = [...fieldTheme.entries()]
    .sort((a, b) => String(a[0]).localeCompare(String(b[0]), 'ja'))
    .map(([code, themeMap]) => {
      const keywordMap = fieldKeyword.get(code) || new Map();
      const trend =
        code === '1501'
          ? '生産、物流、SCM、品質、工程改善に接続しやすい。'
          : code === '1502'
            ? 'サービス品質、顧客接点、業務プロセス、KPI管理に接続しやすい。'
            : '部門横断の社会課題、倫理、持続可能性に接続しやすい。';
      return [code, topLabels(themeMap, 5), topLabels(keywordMap, 5), trend];
    });

  const now = new Date().toISOString().slice(0, 10);
  return `# 技術士 経営工学 過去問トレンド分析レポート

最終更新日: ${now}

## 1. 分析対象

- 対象年度: 令和元年度〜令和7年度
- 対象部門: 技術士第二次試験 経営工学部門
- 対象件数: ${questions.length}件
- 対象科目: 必須科目Ⅰ、選択科目Ⅱ-1、選択科目Ⅱ-2、選択科目Ⅲ
- 対象分野: 共通、1501 生産・物流マネジメント、1502 サービスマネジメント
- データソース: ${data.source?.label || 'public/data/engineer/past-exam-questions.json'}
- 公式過去問題ページ: ${data.source?.url || ''}

## 2. カバレッジ概要

- expected: 126
- actual: ${questions.length}
- missing: ${126 - questions.length}
- 詳細: [engineer-past-exam-data-coverage.md](./engineer-past-exam-data-coverage.md)

### 科目区分別件数

${markdownTable(['科目区分', '件数'], subjects)}

### fieldCode別件数

${markdownTable(['fieldCode', '分野', '件数'], fields.map(([code, count]) => [code, fieldCodeLabel(code), count]))}

## 3. 年度別件数

${markdownTable(['年度', '件数'], yearCounts)}

## 4. 科目区分別件数

${markdownTable(['科目区分', '件数'], subjects)}

## 5. 分野別件数

${markdownTable(['分野', '件数'], sortedEntries(fieldCounts))}

## 6. 頻出テーマランキング

${rankedTable(['順位', 'テーマ', '件数'], sortedEntries(themeCounts), 20)}

## 7. 頻出キーワードランキング

${rankedTable(['順位', 'キーワード', '件数'], sortedEntries(keywordCounts), 30)}

## 8. 設問形式ランキング

${rankedTable(['順位', '設問形式', '件数'], sortedEntries(patternCounts), 20)}

## 9. コンピテンシー別件数

${markdownTable(['コンピテンシー', '件数'], sortedEntries(competencyCounts))}

## 10. 答案骨子タイプ別件数

${markdownTable(['answerFrameType', '件数'], sortedEntries(answerFrameCounts))}

## 11. skeletonTemplateId別件数

${markdownTable(['skeletonTemplateId', '件数'], sortedEntries(skeletonCounts))}

## 12. 科目区分ごとの傾向

${subjectNarrative(subjectCounts, subjectPattern)}

### 科目区分×テーマ

${markdownTable(['科目区分', '上位テーマ'], crossSummaryRows(subjectTheme, 6))}

### 科目区分×設問形式

${markdownTable(['科目区分', '上位設問形式'], crossSummaryRows(subjectPattern, 5))}

## 13. 1501 / 1502 の傾向差

${markdownTable(['fieldCode', '主なテーマ', '主なキーワード', '傾向'], fieldComparison)}

### fieldCode×テーマ

${markdownTable(['fieldCode', '上位テーマ'], crossSummaryRows(fieldTheme, 6))}

### fieldCode×関連キーワード

${markdownTable(['fieldCode', '上位キーワード'], crossSummaryRows(fieldKeyword, 8))}

## 14. 年度×テーマのクロス集計

${markdownTable(['年度', '上位テーマ'], crossSummaryRows(yearTheme, 6))}

## 15. トレンドマップに反映すべき示唆

- 優先して学ぶべきテーマ: ${topLabels(themeCounts, 8)}
- 優先して個別ページを整備すべきキーワード: ${topLabels(keywordCounts, 10)}
- 答案骨子で重視すべき設問形式: ${topLabels(patternCounts, 5)}
- キーワード100の見直し候補: 実データで頻度が高いテーマ・キーワードは S/A/B ランクの説明へ反映し、頻度が低い語は「答案補強語」「将来対応語」として扱う。
- 今後不足しやすい分析観点: 問題本文の詳細構文、設問ごとの配点、年度別の社会背景、公式PDF本文との精密照合は継続レビュー対象とする。

## 16. 注意事項

- 本分析は \`public/data/engineer/past-exam-questions.json\` のメタデータに基づく。
- 公式過去問本文の全文転載ではなく、要約メタデータと公式PDFリンクをもとに分析している。
- キーワードやテーマ分類は、今後のレビューにより更新される可能性がある。
`;
}

const data = readData();
const report = buildReport(data);
fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
fs.writeFileSync(REPORT_PATH, report, 'utf8');
console.log(`Wrote ${REPORT_PATH}`);
