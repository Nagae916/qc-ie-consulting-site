'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { walk, checkFile } = require('./check-frontmatter.js');
const { normalizeGuideStatus } = require('../src/lib/frontmatter-normalization.ts');

const root = path.resolve(__dirname, '..');
const output = path.join(root, '.site-ops', 'dashboard.html');
const template = fs.readFileSync(path.join(__dirname, 'site-dashboard-template.html'), 'utf8');
const readJson = (relativePath) => JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'));
const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (character) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
})[character]);
const displayValue = (value, suffix = '') => value === null || value === undefined ? '未取得' : `${value}${suffix}`;

const guideFiles = walk(path.join(root, 'content', 'guides'));
const guides = guideFiles.map((filepath) => {
  const data = checkFile(filepath).data;
  return {
    status: normalizeGuideStatus(data.status),
    category: path.relative(path.join(root, 'content', 'guides'), filepath).split(path.sep)[0],
  };
});
const publishedGuides = guides.filter((guide) => guide.status === 'published');
const editorial = readJson('docs/operations/EDITORIAL_LEDGER.json');
const localMetricsPath = path.join(root, '.site-ops', 'business-metrics.local.json');
const metricsSource = fs.existsSync(localMetricsPath)
  ? '.site-ops/business-metrics.local.json'
  : 'docs/operations/BUSINESS_METRICS_LEDGER.json';
const metrics = fs.existsSync(localMetricsPath)
  ? JSON.parse(fs.readFileSync(localMetricsPath, 'utf8'))
  : readJson(metricsSource);

const sumKnown = (key) => {
  const values = metrics.records.map((record) => record[key]).filter((value) => typeof value === 'number');
  return values.length ? values.reduce((total, value) => total + value, 0) : null;
};
const countStatus = (status) => editorial.items.filter((item) => item.status === status).length;
const branch = execFileSync('git', ['branch', '--show-current'], { cwd: root, encoding: 'utf8' }).trim();
const commit = execFileSync('git', ['rev-parse', '--short', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim();
const generatedAt = `${new Intl.DateTimeFormat('ja-JP', {
  dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Tokyo',
}).format(new Date())} JST`;

const card = (label, value, detail, tone = '') =>
  `<article class="card"><p class="label">${escapeHtml(label)}</p><p class="value ${tone}">${escapeHtml(value)}</p><p class="detail">${escapeHtml(detail)}</p></article>`;
const statusLabel = (status) => ({
  backlog: '未着手', brief: '企画済み', draft: '草稿', 'fact-check': '確認中',
  'owner-approved': '承認済み', scheduled: '公開待ち', published: '公開済み', measured: '計測済み',
})[status] ?? status;

const assetCards = [
  card('公開ガイド', publishedGuides.length, `登録${guides.length}件`),
  card('4週間の原稿行', editorial.items.length, `企画済み${countStatus('brief')}件・公開済み${countStatus('published')}件`),
  card('Search Console', 'データ蓄積待ち', '所有権確認・sitemap送信は2026-10-19に完了', 'small'),
  card('GA4', '未確認', 'コード上の計測実装なし。接続先・権限を要確認', 'small muted'),
].join('');
const businessCards = [
  card('サイト流入', displayValue(sumKnown('siteVisits')), `出典: ${metricsSource}`),
  card('サンプル利用', displayValue(sumKnown('sampleUses')), '未取得を0に変換しない'),
  card('商品リンククリック', displayValue(sumKnown('productLinkClicks')), '購入成功とは別指標'),
  card('販売件数', displayValue(sumKnown('salesCount')), '販売開始前。実績を推測しない'),
  card('売上', displayValue(sumKnown('grossRevenueJpy'), '円'), '総売上。受取額とは別'),
  card('想定費用', displayValue(sumKnown('estimatedCostJpy'), '円'), '予算・試算'),
  card('実課金', displayValue(sumKnown('actualChargedJpy'), '円'), '請求明細で確認した値のみ'),
  card('工数', displayValue(sumKnown('workMinutes'), '分'), '記録済み実工数'),
].join('');

const editorialRows = editorial.items.map((item) => `<tr>
  <td><code>${escapeHtml(item.contentId)}</code></td>
  <td>${escapeHtml(item.medium)}</td>
  <td><span class="status">${escapeHtml(statusLabel(item.status))}</span></td>
  <td>${escapeHtml(item.theme)}</td>
  <td><a href="${escapeHtml(item.parentArticleUrl)}">親記事</a></td>
  <td>${escapeHtml(displayValue(item.actualEffortMinutes, '分'))}</td>
</tr>`).join('');
const metricRows = metrics.records.map((record) => `<tr>
  <td>${escapeHtml(record.period)}</td>
  <td>${escapeHtml(displayValue(record.impressions))}</td>
  <td>${escapeHtml(displayValue(record.siteVisits))}</td>
  <td>${escapeHtml(displayValue(record.sampleUses))}</td>
  <td>${escapeHtml(displayValue(record.productLinkClicks))}</td>
  <td>${escapeHtml(displayValue(record.salesCount))}</td>
  <td>${escapeHtml(record.source)}</td>
</tr>`).join('');

const fields = {
  generatedAt,
  branch,
  commit,
  metricsSource,
  assetCards,
  businessCards,
  editorialRows,
  metricRows,
};
const rawHtmlFields = new Set(['assetCards', 'businessCards', 'editorialRows', 'metricRows']);
const html = template.replace(/{{(\w+)}}/g, (whole, key) => {
  if (!(key in fields)) throw new Error(`Missing dashboard field: ${key}`);
  return rawHtmlFields.has(key) ? fields[key] : escapeHtml(fields[key]);
});
if (html.includes('{{')) throw new Error('Unresolved dashboard field.');

fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, html, 'utf8');
console.log(`Dashboard ready: ${output}`);
console.log(`Guides: published=${publishedGuides.length}; editorial=${editorial.items.length}; metrics=${metrics.records.length}; source=${metricsSource}`);
