// scripts/check-duplicate-urls.js
// URL重複（/guides/<exam>/<slug>）を検出して失敗させる
const { allGuides } = require("../.contentlayer/generated");

const map = new Map();
for (const g of allGuides) {
  if (g.status === "draft") continue;
  const u = g.url;
  if (!map.has(u)) map.set(u, []);
  map.get(u).push(g._raw.sourceFilePath);
}

let dup = 0;
for (const [u, files] of map.entries()) {
  if (files.length > 1) {
    dup++;
    console.log("[DUP:url]", u, "=>", files);
  }
}

if (dup === 0) {
  console.log("No duplicate guide urls ✅");
  process.exit(0);
} else {
  process.exit(1);
}
