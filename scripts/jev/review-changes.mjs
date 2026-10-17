import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { evaluateWithJev, hasJevCredentials } from "./client.mjs";
import { collectChangedFiles } from "./git-diff.mjs";

const REVIEW_THRESHOLD = 0.7;
const BLOCKING_SCORE = 2;
const MAX_FILES = 20;

export const reviewQuestions = {
  correctness: { type: "noul", instructions: "Does the patch directly support a realistic incorrect runtime result? Ignore style and unsupported speculation." },
  security: { type: "noul", instructions: "Does the patch introduce or weaken authorization, injection protection, secret handling, or another security boundary?" },
  reliability: { type: "noul", instructions: "Can the changed path realistically crash, race, leak resources, hang, lose work, or recover incorrectly?" },
  compatibility: { type: "noul", instructions: "Can the patch break an existing URL, caller, public behavior, persisted format, schema, or protocol?" },
  testGap: { type: "noul", instructions: "Does important changed behavior lack targeted test or validation evidence in the supplied changedTests?" },
  category: {
    type: "choice",
    instructions: "What is the primary purpose of this change?",
    criteria: {
      behavior: "Adds or changes runtime behavior",
      interface: "Changes an API, type, schema, URL, or exchanged data",
      infrastructure: "Changes build, CI, automation, deployment, or development tooling",
      content: "Changes editorial or educational content without runtime behavior",
      refactor: "Restructures implementation without intended behavior change",
      routine: "Small routine change",
    },
  },
  severity: {
    type: "score",
    instructions: "Rate the highest plausible production impact supported directly by this patch.",
    criteria: [
      "No meaningful impact or no supported issue",
      "Minor or narrowly limited impact",
      "Significant correctness, reliability, compatibility, or security impact",
      "Critical security, data loss, or widespread outage impact",
    ],
  },
};

export async function reviewChangedFiles({ cwd = process.cwd(), base = "origin/main", dryRun = false } = {}) {
  const collectedFiles = collectChangedFiles({ cwd, base });
  const files = [...collectedFiles].sort((a, b) => reviewPriority(a.path) - reviewPriority(b.path)).slice(0, MAX_FILES);
  const changedTests = compactChangedTests(files);
  const createdAt = new Date().toISOString();

  if (dryRun || !hasJevCredentials()) {
    return {
      schemaVersion: 1,
      mode: "shadow",
      status: dryRun ? "dry_run" : "skipped",
      reason: dryRun ? "network_call_disabled" : "credentials_missing",
      createdAt,
      base,
      evaluatedFileCount: files.length,
      omittedFileCount: Math.max(0, collectedFiles.length - files.length),
      files: files.map(({ path, truncated, isTest }) => ({ path, truncated, isTest })),
      findings: [],
    };
  }

  const reviewed = await mapWithConcurrency(files, 3, async (file) => ({
    file,
    evaluation: await evaluateWithJev({
      state: { file, changedTests },
      questions: reviewQuestions,
    }),
  }));
  const findings = [];
  const errors = [];
  for (const { file, evaluation } of reviewed) {
    if (!evaluation.ok) {
      errors.push({ file: file.path, reason: evaluation.reason, error: evaluation.error });
      continue;
    }
    const answers = evaluation.result.answers;
    const probabilities = Object.fromEntries(
      ["correctness", "security", "reliability", "compatibility", "testGap"].map((key) => [key, answers[key].probability]),
    );
    findings.push({
      file: file.path,
      category: answers.category.choice,
      severity: answers.severity.score,
      probabilities,
      reviewRequired: answers.severity.score >= BLOCKING_SCORE || Object.values(probabilities).some((value) => value >= REVIEW_THRESHOLD),
      usage: evaluation.result.usage,
    });
  }

  return {
    schemaVersion: 1,
    mode: "shadow",
    status: errors.length ? "partial" : "completed",
    createdAt,
    base,
    evaluatedFileCount: files.length,
    omittedFileCount: Math.max(0, collectedFiles.length - files.length),
    findings,
    errors,
  };
}

export function renderReviewMarkdown(report) {
  const lines = [
    "# Jev review (Shadow Mode)",
    "",
    `- Status: ${report.status}`,
    `- Created: ${report.createdAt}`,
    `- Base: ${report.base}`,
    `- Files evaluated: ${report.evaluatedFileCount ?? 0}`,
    `- Files omitted by cap: ${report.omittedFileCount ?? 0}`,
    "- Enforcement: advisory only; this report never blocks merge",
    "",
  ];
  if (report.reason) lines.push(`- Reason: ${report.reason}`, "");
  if (!report.findings?.length) return `${lines.join("\n")}No evaluated findings.\n`;

  lines.push("| File | Category | Severity | Highest signal | Human review |", "|---|---|---:|---:|---|");
  for (const finding of report.findings) {
    const [signal, highest] = Object.entries(finding.probabilities).sort((a, b) => b[1] - a[1])[0];
    lines.push(`| ${finding.file} | ${finding.category} | ${finding.severity.toFixed(2)} | ${signal} ${highest.toFixed(3)} | ${finding.reviewRequired ? "yes" : "no"} |`);
  }
  lines.push("", "Probabilities are triage signals, not proof of a defect.", "");
  return lines.join("\n");
}

function compactChangedTests(files, maxChars = 12000) {
  const tests = [];
  let used = 0;
  for (const { path: filePath, patch } of files.filter((file) => file.isTest)) {
    const remaining = maxChars - used;
    if (remaining <= 0) break;
    const compactPatch = patch.slice(0, remaining);
    tests.push({ path: filePath, patch: compactPatch });
    used += compactPatch.length;
  }
  return tests;
}

function reviewPriority(filePath) {
  if (/^(?:scripts\/jev\/|\.codex\/hooks\/)/.test(filePath)) return 0;
  if (/^(?:package\.json|\.codex\/hooks\.json|\.github\/)/.test(filePath)) return 1;
  if (/^(?:docs\/|README\.md|AGENTS\.md)/.test(filePath)) return 2;
  if (/lock|generated/i.test(filePath)) return 4;
  return 3;
}

async function mapWithConcurrency(items, concurrency, mapper) {
  const results = new Array(items.length);
  let nextIndex = 0;
  async function worker() {
    while (nextIndex < items.length) {
      const index = nextIndex;
      nextIndex += 1;
      results[index] = await mapper(items[index], index);
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, () => worker()));
  return results;
}

async function runCli() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const baseIndex = args.indexOf("--base");
  const base = baseIndex >= 0 && args[baseIndex + 1] ? args[baseIndex + 1] : "origin/main";
  const report = await reviewChangedFiles({ base, dryRun });
  const reportDir = path.join(process.cwd(), ".jev", "reports");
  await mkdir(reportDir, { recursive: true });
  await Promise.all([
    writeFile(path.join(reportDir, "latest.json"), `${JSON.stringify(report, null, 2)}\n`, "utf8"),
    writeFile(path.join(reportDir, "latest.md"), renderReviewMarkdown(report), "utf8"),
  ]);
  process.stdout.write(`${renderReviewMarkdown(report)}Report: .jev/reports/latest.md\n`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runCli().catch((error) => {
    process.stderr.write(`[Jev review] fail-open: ${error.message}\n`);
    process.exitCode = 0;
  });
}
