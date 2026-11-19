import assert from 'node:assert/strict';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';

const output = new URL('../public/images/learning/', import.meta.url);
const spec = { low: 9.40, high: 10.60, midpoint: 10.00 };
const model = { centered: 10.00, shifted: 10.30, sigmaWithin: 0.15 };
const x = mm => Math.round(166 + 200 * (mm - spec.midpoint));
const yAxis = 132;
const sigmaPixels = x(spec.midpoint + model.sigmaWithin) - x(spec.midpoint);
const fmt = n => n.toFixed(2);
const points = (mean, from = 22) => {
  const pts = [];
  for (let px = from; px <= 340; px += 6) {
    const z = (px - x(mean)) / sigmaPixels;
    pts.push(`${px},${(yAxis - 77 * Math.exp(-z * z / 2)).toFixed(1)}`);
  }
  return pts.join(' ');
};
const high = x(spec.high);
const curve = (mean, stroke, dashed = '') => `<polyline points="${points(mean)}" fill="none" stroke="${stroke}" stroke-width="2.5"${dashed ? ` stroke-dasharray="${dashed}"` : ''}/>`;
const stem = (px, stroke) => `<path d="M${px} 49V${yAxis}" stroke="${stroke}" stroke-dasharray="3 4"/>`;
const baseline = `<path d="M18 132H345" stroke="#334155" stroke-width="1.5"/>`;
const template = (plot, describe) => `<svg xmlns="http://www.w3.org/2000/svg" width="360" height="178" viewBox="0 0 360 178">
  <title>${describe}</title>
  <text x="22" y="17" font-family="sans-serif" font-size="13" fill="#334155">確率密度（模式図）</text>
  <g stroke="#64748b" stroke-dasharray="5 4" stroke-width="1.5">
    <path d="M${x(spec.low)} 47V132M${high} 47V132"/>
  </g>
  ${plot}
  ${baseline}
  <g font-family="sans-serif" font-size="13" fill="#0f172a" text-anchor="middle">
    <text x="${x(spec.low)}" y="150">${fmt(spec.low)}</text>
    <text x="${high}" y="150">${fmt(spec.high)}</text>
    <text x="${x(spec.low)}" y="168">規格下限</text>
    <text x="${high}" y="168">規格上限</text>
  </g>
  <text x="165" y="167" text-anchor="middle" font-family="sans-serif" font-size="13" fill="#334155">直径（mm）</text>
</svg>
`;
const label = (mean, color) => `<text x="${x(mean)}" y="42" text-anchor="middle" font-family="sans-serif" font-size="13" font-weight="bold" fill="${color}">${fmt(mean)}</text>`;
const distribution = template([
  '<defs><pattern id="tail" width="4" height="4" patternUnits="userSpaceOnUse"><path d="M0 4L4 0" stroke="#b91c1c" stroke-width="1.2"/></pattern></defs>',
  `<polygon points="${high},${yAxis} ${points(model.shifted, high)} 340,${yAxis}" fill="url(#tail)"/>`,
  stem(x(model.shifted), '#0f766e'), curve(model.shifted, '#0f766e'), label(model.shifted, '#115e59'),
  '<path d="M320 97L300 126" fill="none" stroke="#991b1b"/>',
  '<text x="333" y="91" text-anchor="end" font-family="sans-serif" font-size="13" font-weight="bold" fill="#991b1b">規格外</text>',
].join('\n  '), '安定した工程の分布が規格上限を越える例');
const comparison = template([
  stem(x(model.centered), '#475569'), stem(x(model.shifted), '#0f766e'),
  curve(model.centered, '#475569', '6 4'), curve(model.shifted, '#0f766e'),
  label(model.centered, '#334155'), label(model.shifted, '#115e59'),
].join('\n  '), '同じばらつきで平均だけがずれた二つの工程');

const cp = (spec.high - spec.low) / (6 * model.sigmaWithin);
const cpk = mean => Math.min(spec.high - mean, mean - spec.low) / (3 * model.sigmaWithin);
assert.equal(fmt(cp), '1.33');
assert.equal(fmt(cpk(model.centered)), '1.33');
assert.equal(fmt(cpk(model.shifted)), '0.67');
assert.equal((model.sigmaWithin * 1.128).toFixed(4), '0.1692');

const check = process.argv.includes('--check');
if (!check) mkdirSync(output, { recursive: true });
for (const [file, svg] of [['capability-spec-tail.svg', distribution], ['cp-cpk-center-shift.svg', comparison]]) {
  const target = new URL(file, output);
  if (check) assert.equal(readFileSync(target, 'utf8').replace(/\r\n/g, '\n'), svg, file);
  else writeFileSync(target, svg, 'utf8');
}
console.log('Capability model: same Cp (1.33), Cpk 1.33 -> 0.67; SVG assets ' + (check ? 'verified.' : 'generated.'));
