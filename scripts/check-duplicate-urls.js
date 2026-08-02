// scripts/check-duplicate-urls.js
// URL重複（/guides/<exam>/<slug>）を検出して失敗させる
async function main() {
  const { allGuides } = await import("../.contentlayer/generated/index.mjs");

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
    return;
  }

  process.exitCode = 1;
}

main().catch((error) => {
  console.error("Duplicate URL check failed:", error);
  process.exitCode = 1;
});
