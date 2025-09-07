// scripts/guard-mdx.js
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const TARGET_DIR = path.join(ROOT, 'content');

const offenders = [];

function scanFile(file) {
  const text = fs.readFileSync(file, 'utf8');

  // --- 1) 単純パターン（同一行内） ---
  const reSameLine = /<[^>\r\n]*\\[^>\r\n]*>|\{[^}\r\n]*\\[^}\r\n]*\}/g;
  const lines = text.split(/\r?\n/);
  lines.forEach((line, i) => {
    if (reSameLine.test(line)) offenders.push({ file, line: i + 1, text: line.trim() });
  });

  // --- 2) 複数行ブロック（簡易ステートマシン） ---
  let inTag = false, inExpr = false;
  let buf = '', startLine = 1, lineNo = 0;

  for (const line of lines) {
    lineNo++;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (!inTag && !inExpr && ch === '<') {
        inTag = true; buf = ''; startLine = lineNo;
      } else if (inTag && ch === '>') {
        if (buf.includes('\\')) offenders.push({ file, line: startLine, text: lines[startLine - 1]?.trim() ?? '' });
        inTag = false; buf = '';
      } else if (!inTag && !inExpr && ch === '{') {
        inExpr = true; buf = ''; startLine = lineNo;
      } else if (inExpr && ch === '}') {
        if (buf.includes('\\')) offenders.push({ file, line: startLine, text: lines[startLine - 1]?.trim() ?? '' });
        inExpr = false; buf = '';
      } else if (
