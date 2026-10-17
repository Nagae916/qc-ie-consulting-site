'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync, spawnSync } = require('node:child_process');
const { walk, checkFile } = require('./check-frontmatter.js');
const { normalizeGuideStatus } = require('../src/lib/frontmatter-normalization.ts');

const root = path.resolve(__dirname, '..');
const output = path.join(root, '.site-ops', 'dashboard.html');
const source = fs.readFileSync(path.join(__dirname, 'site-dashboard-template.html'), 'utf8');

const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (character) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
})[character]);
const percent = (part, total) => total ? Math.round(1000 * part / total) / 10 : 0;
const file = (relative) => fs.readFileSync(path.join(root, relative), 'utf8');

const guideFiles = walk(path.join(root, 'content', 'guides'));
const guides = guideFiles.map((filepath) => {
  const data = checkFile(filepath).data;
  return {
    category: path.relative(path.join(root, 'content', 'guides'), filepath).split(path.sep)[0],
    status: normalizeGuideStatus(data.status),
    themes: Array.isArray(data.themes) ? data.themes : [],
    updatedAt: data.updatedAt,
  };
});
const published = guides.filter((guide) => guide.status === 'published');
const drafts = guides.filter((guide) => guide.status !== 'published');
const withThemes = published.filter((guide) => guide.themes.length > 0).length;
const withUpdateDate = published.filter((guide) => Boolean(guide.updatedAt)).length;
const categories = [
  { key: 'engineer', label: '技術士' },
  { key: 'stat', label: '統計' },
  { key: 'qc', label: 'QC' },
].map(({ key, label }) => ({
  label, count: published.filter((guide) => guide.category === key).length,
}));
const themeSegment = file('src/data/n-ie-lab.ts')
  .split('export const themes: ThemeDefinition[] = [')[1]
  ?.split('export const homeToolHrefs')[0];
if (!themeSegment) throw new Error('Cannot find registered themes.');
const themes = [...themeSegment.matchAll(/^\s+slug:\s*"(quality|production|data|improvement)",/gm)].length;
const caseSegment = file('src/data/cases.ts').split('export const caseStudies: CaseStudy[] = [')[1]?.split('export const getCaseStudy')[0];
if (!caseSegment) throw new Error('Cannot find registered cases.');
const cases = [...caseSegment.matchAll(/^    slug: "[^"]+",/gm)].length;
const tools = fs.readdirSync(path.join(root, 'pages', 'tools'))
  .filter((name) => name.endsWith('.tsx') && name !== 'index.tsx').length;
const commit = execFileSync('git', ['rev-parse', '--short', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim();
const branch = execFileSync('git', ['branch', '--show-current'], { cwd: root, encoding: 'utf8' }).trim();
const upstream = spawnSync('git', ['rev-parse', '--abbrev-ref', '--symbolic-full-name', '@{upstream}'], {
  cwd: root, encoding: 'utf8',
});
const generatedAt = new Intl.DateTimeFormat('ja-JP', {
  dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Tokyo',
}).format(new Date()) + ' JST';

function card(label, value, detail, fill = null, tone = '') {
  const meter = fill === null ? '' : `<div class="meter" aria-label="${escapeHtml(label)}: ${fill}%"><span style="width:${fill}%"></span></div>`;
  return `<div class="card"><div class="label">${escapeHtml(label)}</div><div class="number ${tone}">${escapeHtml(value)}</div><div class="detail">${escapeHtml(detail)}${meter}</div></div>`;
}
function row(id, state, title, note, klass = '') {
  return `<tr><td class="id">${escapeHtml(id)}</td><td><span class="pill ${klass}">${escapeHtml(state)}</span></td><td class="title">${escapeHtml(title)}</td><td class="note-cell">${escapeHtml(note)}</td></tr>`;
}

const cards = [
  card('公開ガイド', published.length, `登録${guides.length}件・下書き等${drafts.length}件`),
  card('4テーマとの明示的な紐付け', `${withThemes} / ${published.length}`, '任意のthemesフィールドを持つ公開ガイド', percent(withThemes, published.length)),
  card('更新日の記録', `${withUpdateDate} / ${published.length}`, 'updatedAtを持つ公開ガイド', percent(withUpdateDate, published.length)),
  card('公開ケース / ツール', `${cases} / ${tools}`, '登録済みケース / ツール個別ページ'),
  card('検索クリック', '未接続', 'Search Consoleの実測が必要', null, 'small neutral'),
  card('流入と閲覧', '未接続', 'GA4等の計測設定を確認', null, 'small neutral'),
  card('相談件数', '未接続', '問い合わせ記録と定義が必要', null, 'small neutral'),
  card('売上', '未接続', '対象範囲と集計期間の定義が必要', null, 'small neutral'),
].join('');
const largest = Math.max(1, ...categories.map((category) => category.count));
const bars = categories.map(({ label, count }) =>
  `<div class="bar-row"><span>${escapeHtml(label)}</span><div class="bar-track"><div class="bar-fill" style="width:${100 * count / largest}%"></div></div><strong>${count}件</strong></div>`
).join('');
const checks = [
  ['中心テーマ', `${themes}件 / 定義済み`],
  ['ケース', `${cases}件 / ルートあり`],
  ['個別ツール', `${tools}ページ`],
  ['公開データ', `frontmatter ${guides.length}件を読取`],
  ['GitHub CI / 本番稼働', 'この画面では未取得'],
].map(([label, value]) =>
  `<div class="check"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></div>`
).join('');
const tracking = upstream.status === 0 ? `追跡先: ${upstream.stdout.trim()}` : `追跡先なし: ${branch}`;
const tasks = [
  row('OPS-01', 'done', '運営指標の棚卸しと画面試作', 'ソースからガイド・ケース・ツール件数を集計', 'done'),
  row('OPS-02', '要確認', '開発ブランチのGitHub反映を確認', `${tracking}。現在のローカル先端: ${commit}。remote先端は未照合`, 'review'),
  row('OPS-03', 'todo', 'Search Console / GA4 の計測先を確認', 'プロパティと閲覧権限を確認後、直近28日を接続'),
  row('OPS-04', '提案', 'テーマ・更新日の付与順を決める', '既存の人気記事から優先し、全件の一括変更は避ける', 'review'),
  row('OPS-05', 'todo', '相談と売上の定義を決める', '集計単位を決め、数値の重複や誤計上を防ぐ'),
].join('');
const questions = [
  row('Q-01', '要確認', 'Search Console / GA4 は設定済みか', 'アクセス数は取得するまで空欄とする'),
  row('Q-02', '要確認', '相談件数と売上は何を含めるか', '運営対象・集計期間を決めるまで空欄とする'),
  row('Q-03', '判断待ち', 'Luna / Jevの自動振分を採用するか', '記事の利点と制約を確認してから方針を決める', 'review'),
].join('');

const fields = {
  generatedAt, commit, published: published.length,
  cards, bars, checks, tasks, questions,
};
const html = source.replace(/{{(\w+)}}/g, (whole, key) => {
  if (!(key in fields)) throw new Error(`Missing template field: ${key}`);
  return ['cards', 'bars', 'checks', 'tasks', 'questions'].includes(key)
    ? fields[key] : escapeHtml(fields[key]);
});
if (html.includes('{{')) throw new Error('Unresolved dashboard template field.');
fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, html, 'utf8');
console.log(`Dashboard ready: ${output}`);
console.log(`Guides: published=${published.length} draftOrOther=${drafts.length}; guidesWithThemes=${withThemes}; updatedAt=${withUpdateDate}; cases=${cases}; tools=${tools}`);
