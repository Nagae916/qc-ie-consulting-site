'use strict';

const fs = require('fs');
const path = require('path');

const FIX = process.argv.includes('--fix');

function walk(dir) {
  const out = [];
  const stack = [dir];
  while (stack.length) {
    const d = stack.pop();
    if (!fs.existsSync(d)) continue;
    for (const name of fs.readdirSync(d)) {
      const p = path.join(d, name);
      try {
        const st = fs.statSync(p);
        if (st.isDirectory()) stack.push(p);
        else out.push(p);
      } catch (error) {
        throw new Error(`Cannot inspect ${p}: ${error.message}`);
      }
    }
  }
  return out;
}

function normalizeMdxSafety(source) {
  let normalized = source.replace(/[\uFEFF\u200B\u200C\u200D\u2060\u00A0\u3000]/g, '');
  normalized = normalized.replace(/^(?:—|–){3,}\s*$/gm, '---');
  if (!normalized.endsWith('\n')) normalized += '\n';
  return normalized;
}

function main() {
  const root = process.cwd();
  const guidesDir = path.join(root, 'content', 'guides');

  if (!fs.existsSync(guidesDir)) {
    throw new Error('content/guides is missing');
  }

  const files = walk(guidesDir).filter((file) => /\.mdx?$/i.test(file));
  const changed = [];

  for (const file of files) {
    const source = fs.readFileSync(file, 'utf8');
    const normalized = normalizeMdxSafety(source);
    if (normalized === source) continue;

    changed.push(path.relative(root, file));
    if (FIX) fs.writeFileSync(file, normalized, 'utf8');
  }

  if (changed.length > 0 && !FIX) {
    console.error(`[guard-mdx] ${changed.length} file(s) need explicit repair:`);
    for (const file of changed) console.error(`- ${file}`);
    console.error('[guard-mdx] Run npm run fix:mdx-safety to apply the repairs.');
    process.exit(1);
  }

  const action = FIX ? 'repaired' : 'checked without writes';
  console.log(`[guard-mdx] ${files.length} document(s) ${action}; changed=${changed.length}`);
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    console.error(`[guard-mdx] ${error.message}`);
    process.exit(1);
  }
}

module.exports = { normalizeMdxSafety };
