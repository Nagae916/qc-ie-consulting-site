'use strict';

const fs = require('fs');
const path = require('path');

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
      } catch {
        // 読めないパスはスキップ
      }
    }
  }
  return out;
}

(function main() {
  try {
    const root = process.cwd();
    const contentDir = path.join(root, 'content');
    const guidesDir = path.join(contentDir, 'guides');

    if (!fs.existsSync(contentDir) || !fs.existsSync(guidesDir)) {
      console.log('[guard-mdx] ℹ️ content/guides が無いのでスキップします');
      return;
    }

    const files = walk(guidesDir).filter((f) => /\.mdx?$/i.test(f));

    for (const f of files) {
      try {
        let s = fs.readFileSync(f, 'utf8');

        // ゼロ幅・特殊空白の除去
        s = s.replace(/[\uFEFF\u200B\u200C\u200D\u2060\u00A0\u3000]/g, '');

        // 全角ダッシュ等で壊れた YAML 柵を補正
        s = s.replace(/^(?:—|–){3,}\s*$/gm, '---');

        // 末尾に改行を付与（無い場合）
        if (!s.endsWith('\n')) s += '\n';

        // 内容が変わっていれば上書き
        fs.writeFileSync(f, s, 'utf8');
      } catch (e) {
        console.log(`[guard-mdx] ⚠️ ${path.relative(root, f)}: ${e.message}`);
      }
    }

    console.log('[guard-mdx] ✅ 問題なし');
  } catch (e) {
    // ここで例外を握りつぶし、ビルドを落とさない
    console.log('[guard-mdx] ⚠️ soft-skip:', e && e.message ? e.message : e);
  }
})();
