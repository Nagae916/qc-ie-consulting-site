export type ContentClassification =
  | "learning-route"
  | "guide"
  | "tool"
  | "reference"
  | "duplicate-candidate";

type ClassifiableContent = {
  slug?: string | null | undefined;
  path?: string | null | undefined;
  href?: string | null | undefined;
};

export const classificationLabels: Record<ContentClassification, string> = {
  "learning-route": "学習方針",
  guide: "ガイド",
  tool: "演習・ツール",
  reference: "参考資料",
  "duplicate-candidate": "重複/統合候補",
};

const learningRouteSlugs = new Set([
  "learning-map",
  "how-to-study",
  "first-exam-roadmap",
  "second-exam-roadmap",
  "data-science-stat-roadmap",
  "ds-certification-roadmap",
]);

const toolSlugs = new Set([
  "answer-structure-builder",
  "issue-decomposition-matrix",
  "practice",
  "practice-ii-2",
  "practice-equipment-loss-reduction",
  "practice-productivity-improvement",
  "practice-defect-reduction",
  "practice-inventory-reduction",
  "problem-matrix",
  "ds-certification-practice",
]);

const referenceSlugs = new Set([
  "whitepaper-update-board",
  "white-paper-board",
]);

const guideSlugs = new Set([
  "past-exam-trend-map",
  "keywords",
  "keyword-priority-100",
  "keyword-answer-uses",
  "whitepaper-keyword-map",
  "past-exam-question-patterns",
  "answer-structure-guide",
  "anova",
  "ancova",
  "mmrm",
  "s-and-op",
  "data-driven",
  "erp",
  "mes",
  "wms",
  "tms",
  "modal-shift",
  "physical-internet",
  "quality-fraud-prevention",
  "engineering-ethics",
  "oee",
  "jit",
  "heijunka",
  "mixed-model-production",
  "setup-time-reduction",
  "smed",
  "mrp",
  "decoupling-point",
  "bullwhip-effect",
  "demand-driven",
  "inventory-optimization",
  "inventory-turnover",
  "service-level",
  "abc-analysis",
  "sku-management",
  "vmi",
  "unit-load",
  "clo",
  "digital-twin",
  "rpa",
  "traceability",
  "governance",
  "internal-audit",
  "quality-kpi",
  "process-approach",
  "risk-based-thinking",
  "capa",
  "standardization",
  "change-management",
  "bom",
  "bop",
  "dfm-dfa",
  "design-review",
  "fmea",
  "fta",
  "qc-seven-tools",
  "new-qc-seven-tools",
  "control-chart",
  "process-capability",
  "design-of-experiments",
  "quality-engineering",
  "ve-va",
  "cost-management",
  "npv",
  "lcc",
  "lca",
  "energy-intensity",
  "carbon-neutrality",
  "circular-economy",
  "green-procurement",
  "kgi",
  "balanced-scorecard",
  "csr",
  "industry-5-0",
  "data-governance",
  "edi",
  "rfid",
  "plm",
  "engineering-chain",
  "concurrent-engineering",
  "keyword-themes",
  "theme-supply-constraint",
  "theme-dx-data",
  "theme-logistics",
  "theme-quality-qms",
  "theme-resilience",
  "theme-carbon-neutral",
  "frequent-keywords-map",
  "qms-reconstruction",
  "scm",
  "toc",
  "kpi-management",
  "dx",
  "demand-supply-adjustment",
  "lead-time-reduction",
  "resilience",
  "bcp",
  "logistics-2024",
]);

const duplicateCandidateSlugs = new Set([
  "psi-management",
  "psi",
  "chi-square",
  "chi-square-test",
  "histogram",
  "histogram-and-distribution",
  "linear-regression",
  "simple-linear-regression",
]);

function normalizeSlug(value?: string | null): string {
  return String(value ?? "")
    .trim()
    .toLowerCase();
}

export function slugFromPath(path?: string | null): string {
  const normalized = normalizeSlug(path).replace(/\\/g, "/");
  const withoutExt = normalized.replace(/\.(mdx|md|tsx|ts)$/, "");
  const parts = withoutExt.split("/").filter(Boolean);
  return parts[parts.length - 1] ?? "";
}

export function classifyContent(input: ClassifiableContent): ContentClassification {
  const slug = normalizeSlug(input.slug) || slugFromPath(input.href) || slugFromPath(input.path);

  if (learningRouteSlugs.has(slug)) return "learning-route";
  if (toolSlugs.has(slug)) return "tool";
  if (referenceSlugs.has(slug)) return "reference";
  if (guideSlugs.has(slug)) return "guide";
  if (duplicateCandidateSlugs.has(slug)) return "duplicate-candidate";
  return "guide";
}

export function isGuideContent(input: ClassifiableContent): boolean {
  return classifyContent(input) === "guide";
}
