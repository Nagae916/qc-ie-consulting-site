// scripts/check-duplicate-urls.js
// 修正点: 参照パスを "../.contentlayer/generated" に
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
if (dup === 0) console.log("No duplicate guide urls ✅");
process.exit(dup ? 1 : 0);
