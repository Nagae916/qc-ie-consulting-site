'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const GUIDES_DIR = path.join(ROOT, 'content', 'guides');

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(full);
    return /\.(md|mdx)$/i.test(entry.name) ? [full] : [];
  });
}

function inspectTextFormat(buffer) {
  const hasBom = buffer.length >= 3 && buffer[0] === 0xef && buffer[1] === 0xbb && buffer[2] === 0xbf;
  const text = buffer.toString('utf8');
  return {
    hasBom,
    hasCarriageReturn: text.includes('\r'),
    hasFinalNewline: text.endsWith('\n'),
  };
}

function main() {
  const errors = [];
  const files = walk(GUIDES_DIR);
  for (const file of files) {
    const format = inspectTextFormat(fs.readFileSync(file));
    const problems = [];
    if (format.hasBom) problems.push('UTF-8 BOM');
    if (format.hasCarriageReturn) problems.push('CR/CRLF');
    if (!format.hasFinalNewline) problems.push('missing final LF');
    if (problems.length) errors.push(`${path.relative(ROOT, file)}: ${problems.join(', ')}`);
  }

  if (errors.length) {
    console.error(`Source format check failed for ${errors.length} document(s):`);
    for (const error of errors) console.error(`- ${error}`);
    process.exit(1);
  }
  console.log(`Source format OK: ${files.length} guide document(s) are UTF-8 without BOM and LF-only.`);
}

if (require.main === module) main();

module.exports = { inspectTextFormat };
