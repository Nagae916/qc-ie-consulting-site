// scripts/guard-mdx.js
// 目的: content/**/*.mdx の「タグ内にバックスラッシュ」がないかを検出して失敗させる
// 依存なし（Node標準のみ）

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const TARGET_DIR = path.join(ROOT, 'content');

const bad = [];
const tagWithBackslash = /<[^>\r\n]*\\[^>\r\n]*>/g; // タグ内に \ がある

function walk(dir) {
  for (const name of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, name.name);
    if (name.isDirectory()) walk(p);
    else if (name.isFile() && p.endsWith('.mdx')) checkFile(p);
  }
}

function checkFile(file) {
  const txt = fs.readFileSync(file, 'utf8');
  const lines = txt.split(/\r?\n/);
  lines.forEach((line, i) => {
    if (tagWithBackslash.test(line)) {
      bad.push({ file, line: i + 1, text: line.trim() });
    }
  });
}

if (fs.existsSync(TARGET_DIR)) walk(TARGET_DIR);

if (bad.length) {
  console.error('\n[guard-mdx] ❌ タグ内にバックスラッシュが含まれています（MDX/Acorn落ちの原因）:');
  for (const b of bad) {
    console.error(`  - ${path.relative(ROOT, b.file)}:${b.line}  ${b.text}`);
  }
  console.error('\n対策: その行の HTML/JSX をやめて、Markdown＋数式($...$ / $$...$$)に書き直してください。');
  process.exit(1);
} else {
  console.log('[guard-mdx] ✅ 問題なし');
}
