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
  "first-exam-roadmap",
  "data-science-stat-roadmap",
]);

const toolSlugs = new Set([
  "answer-structure-builder",
  "issue-decomposition-matrix",
  "past-exam-trend-map",
  "problem-matrix",
]);

const referenceSlugs = new Set([
  "whitepaper-update-board",
  "white-paper-board",
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
  if (duplicateCandidateSlugs.has(slug)) return "duplicate-candidate";
  return "guide";
}

export function isGuideContent(input: ClassifiableContent): boolean {
  return classifyContent(input) === "guide";
}
