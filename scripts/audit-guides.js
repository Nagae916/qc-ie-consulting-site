// scripts/audit-guides.js
const { allGuides } = require("../.contentlayer/generated");

const norm = (s) => String(s ?? "").toLowerCase();
const pathExamOf = (file) => {
  const p = norm(file);
  if (p.includes("/guides/qc/")) return "qc";
  if (p.includes("/guides/stat/")) return "stat";
  if (p.includes("/guides/engineer/")) return "engineer";
  return null;
};

let issues = 0;

// 1) exam/slug 重複
const byPair = new Map();
for (const g of allGuides) {
  if (g.status === "draft") continue;
  const exam = norm(g.exam);
  const slug = norm(g.slug);
  if (!exam || !slug) continue;
  const key = `${exam}/${slug}`;
  if (!byPair.has(key)) byPair.set(key, []);
  byPair.get(key).push(g._raw.sourceFilePath);
}
for (const [key, files] of byPair) {
  if (files.length > 1) {
    issues++;
    console.log("[DUP:exam/slug]", key, "=>", files);
  }
}

// 2) 物理パスと computed exam の不一致
for (const g of allGuides) {
  if (g.status === "draft") continue;
  const computed = norm(g.exam);
  const fromPath = pathExamOf(g._raw.sourceFilePath);
  if (fromPath && fromPath !== computed) {
    issues++;
    console.log("[MISMATCH:exam]", {
      file: g._raw.sourceFilePath,
      fromPath,
      computed,
      slug: g.slug,
      url: g.url,
    });
  }
}

if (!issues) {
  console.log("Audit passed ✅ (no duplicates, no exam mismatches)");
}
process.exit(issues ? 1 : 0);
