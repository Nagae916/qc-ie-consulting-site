// scripts/audit-guides.js
// 目的：
// - exam/slug 重複の検出（ビルド前に落とす）
// - 物理パス由来カテゴリと computed exam の不一致検出
// - "stats" / "pe" などルーティングと不整合な exam を検出し、修正指示を出す
// - URL 形状の監査（/guides/<exam>/<slug> の一貫性）
const { allGuides } = require("../.contentlayer/generated");

// ルーターが期待する正規カテゴリ（pages 側）
const ROUTE_EXAMS = /** @type {const} */ (["qc", "stat", "engineer"]);
/** @typedef {"qc"|"stat"|"engineer"} RouteExam */

const norm = (s) => String(s ?? "").trim().toLowerCase();

// 物理パスからカテゴリ推定（最優先）
const pathExamOf = (file /* string */) => {
  const p = norm(file);
  if (p.includes("/guides/qc/")) return "qc";
  if (p.includes("/guides/stat/")) return "stat";
  if (p.includes("/guides/engineer/")) return "engineer";
  return null;
};

// Contentlayer の computed g.exam（例: "stats", "pe"）をルーター正規形へ寄せる
const toRouteExam = (examRaw /* string */) => {
  const e = norm(examRaw);
  if (e === "qc") return "qc";
  if (e === "stat" || e === "stats" || e === "statistics") return "stat";
  if (e === "engineer" || e === "pe" || e === "eng") return "engineer";
  return null;
};

let issues = 0;

// ========== 1) exam/slug 重複（ルーター正規形ベース） ==========
const byPair = new Map();
for (const g of allGuides) {
  if (g.status === "draft") continue;
  const examRoute = toRouteExam(g.exam);
  const slug = norm(g.slug);
  if (!examRoute || !slug) continue;
  const key = `${examRoute}/${slug}`;
  if (!byPair.has(key)) byPair.set(key, []);
  byPair.get(key).push(g._raw.sourceFilePath);
}

for (const [key, files] of byPair.entries()) {
  if (files.length > 1) {
    issues++;
    console.log("[DUP:exam/slug]", key, "=>", files);
  }
}

// ========== 2) 物理パス vs computed exam（正規形に寄せて比較） ==========
for (const g of allGuides) {
  if (g.status === "draft") continue;

  const fromPath = pathExamOf(g._raw.sourceFilePath);
  const examRoute = toRouteExam(g.exam);

  // 物理パスでカテゴリが判定できるのに、computed とズレている
  if (fromPath && examRoute && fromPath !== examRoute) {
    issues++;
    console.log("[MISMATCH:exam]", {
      file: g._raw.sourceFilePath,
      fromPath,          // 物理パスからの判断（qc/stat/engineer）
      computed: g.exam,  // Contentlayer computed（qc/stats/pe …）
      suggested: examRoute,
      slug: g.slug,
      url: g.url,
      fix: "frontmatter exam を物理パスに合わせる or contentlayer.config.ts 側の正規化ロジックを見直す",
    });
  }
}

// ========== 3) exam 値の不整合（ルーターと不整合な語彙を検出） ==========
// 例: "stats" や "pe" が残っていると、/guides/stats/... の URL が生成される可能性
for (const g of allGuides) {
  if (g.status === "draft") continue;

  const examRoute = toRouteExam(g.exam);
  if (!examRoute) {
    issues++;
    console.log("[INVALID:exam]", {
      file: g._raw.sourceFilePath,
      exam: g.exam,
      fix: `exam は ${ROUTE_EXAMS.join(" / ")} のいずれかに統一してください（例: stats→stat, pe→engineer）`,
    });
  }

  // URL 形状の監査：/guides/<examRaw>/<slug>
  const slug = norm(g.slug);
  const examRaw = norm(g.exam);
  const expectedUrlRaw = `/guides/${examRaw}/${slug}`;
  if (g.url !== expectedUrlRaw) {
    // Contentlayer 側で url を独自計算している場合のズレを警告
    console.log("[WARN:url-shape]", {
      file: g._raw.sourceFilePath,
      actual: g.url,
      expectedBasedOnComputed: expectedUrlRaw,
      note: "contentlayer.config.ts の url 計算ロジックと computed exam/slug を確認してください",
    });
  }

  // さらに、実際にルーターが受け付ける形（正規形）での期待URLもヒント表示
  if (examRoute) {
    const expectedRouteUrl = `/guides/${examRoute}/${slug}`;
    // computed exam と route exam が異なる（例: stats→stat）なら通知
    if (examRaw !== examRoute) {
      console.log("[HINT:route-url]", {
        file: g._raw.sourceFilePath,
        routeExpected: expectedRouteUrl,
        reason: `pages 側は ${ROUTE_EXAMS.join(" / ")} でルーティング。contentlayer 側も同じ語彙に正規化推奨`,
      });
    }
  }
}

if (!issues) {
  console.log("Audit passed ✅ (no duplicates, no exam mismatches)");
}
process.exit(issues ? 1 : 0);
