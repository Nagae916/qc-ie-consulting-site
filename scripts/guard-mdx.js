// scripts/guard-mdx.js
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const TARGET_DIR = path.join(ROOT, 'content');

// ① JSXタグ内のバックスラッシュ: <... \ ...>
const reTagBackslash = /<[^>\r\n]*\\[^>\r\n]*>/g;
// ② MDX式（{ ... }）内のバックスラッシュ: { ... \ ... }
const reExprBackslash = /\{[^}\r\n]*\\[^}\r\n]*\}/g;

const offenders = [];

function walk(dir) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p);
    else if (ent.isFile() && p.endsWith('.mdx')) check(p);
  }
}

function check(file) {
  const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);
  lines.forEach((line, i) => {
    if (reTagBackslash.test(line) || reExprBackslash.test(line)) {
      offenders.push({ file, line: i + 1, text: line.trim() });
    }
  });
}

if (fs.existsSync(TARGET_DIR)) walk(TARGET_DIR);

if (offenders.length) {
  console.error('\n[guard-mdx] ❌ MDX/JSX 内のバックスラッシュが見つかりました:');
  for (const o of offenders) {
    console.error(`  - ${path.relative(ROOT, o.file)}:${o.line}  ${o.text}`);
  }
  console.error('\n対策: HTML/JSXや{...}の中で数式を使わず、Markdownの $...$ / $$...$$ に書き直してください。');
  process.exit(1);
} else {
  console.log('[guard-mdx] ✅ 問題なし');
}
