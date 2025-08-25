// scripts/check-routes.js
// "/guide/" を含むコードがあれば終了コード1で落とす（content/内は対象外）
import { execSync } from "node:child_process";

const grep = `git grep -nE '["\\']\\/guide\\/' -- \
  ':!content/**' ':!**/*.md' || true`;
const out = execSync(grep, { encoding: "utf8" }).trim();

if (out) {
  console.error(
    "\n❌ 旧URL '/guide/' の直書きを検出しました。\n" +
      "   → src/lib/routes.ts の guideUrl()/guidesQcTop を使ってください。\n\n" +
      out +
      "\n"
  );
  process.exit(1);
}
console.log("✅ route check passed");
