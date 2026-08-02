// scripts/check-routes.js
// 旧ガイドURLを含むコードがあれば終了コード1で落とす（content/内は対象外）
const { spawnSync } = require("node:child_process");

const result = spawnSync(
  "git",
  [
    "grep",
    "-nE",
    "[\"']/guide/",
    "--",
    ":!content/**",
    ":!**/*.md",
    ":!scripts/check-routes.js",
  ],
  { encoding: "utf8", shell: false }
);

if (result.error) {
  console.error("route check failed:", result.error.message);
  process.exit(1);
}

if (result.status !== 0 && result.status !== 1) {
  console.error("route check failed:", result.stderr.trim());
  process.exit(result.status ?? 1);
}

const out = result.stdout.trim();

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
