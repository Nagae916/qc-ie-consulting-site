import { readdirSync } from "node:fs";
import { mkdir, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { evaluateWithJev } from "./client.mjs";
import { JEV_DROP_THRESHOLD, JEV_MAX_STATE_CHARS, JEV_RETENTION_MAX_CHARS } from "./config.mjs";

const FORCE_KEEP = /(?:error|failed|failure|warning|unresolved|schema|migration|decision|constraint|requirement|AGENTS\.md|git diff|security)/i;
const FORCE_KEEP_TOOLS = /(?:apply_patch|edit|write|read_mcp_resource)/i;
const RECENT_KEEP_COUNT = 4;

export async function createRetentionPacket({ sessionId, trigger, candidates, parseWarnings = [], evaluate = evaluateWithJev }) {
  const initiallyPrepared = candidates.map((candidate, index) => ({
    ...candidate,
    forcedKeep: index >= candidates.length - RECENT_KEEP_COUNT || FORCE_KEEP.test(candidate.result) || FORCE_KEEP_TOOLS.test(candidate.tool),
  }));
  const fittedState = fitState(initiallyPrepared, JEV_MAX_STATE_CHARS);
  const fittedIds = new Set(fittedState.map((item) => item.id));
  const prepared = initiallyPrepared.map((item) => ({
    ...item,
    forcedKeep: item.forcedKeep || !fittedIds.has(item.id),
  }));
  const questions = Object.fromEntries(
    prepared.filter((item) => !item.forcedKeep).map((item, index) => [
      `discard_${index}`,
      {
        type: "noul",
        instructions: `Can the exact result of tool call ${item.id} be safely omitted after native Codex compaction without increasing re-read risk or losing a constraint, unresolved error, architecture fact, schema, path, or exact value needed to finish the current task?`,
        criteria: {
          true: "Safe to omit because the result is stale, duplicated, routine success output, or reproducible lookup noise",
          false: "Keep because exact content may still be needed or uncertainty remains",
        },
      },
    ]),
  );
  const evaluation = Object.keys(questions).length
    ? await evaluate({
      state: {
        goal: "Preserve exact context needed to complete the active coding task",
        toolCalls: fittedState.map(({ id, tool, input, result, forcedKeep }) => ({ id, tool, input, result, forcedKeep })),
      },
      questions,
    })
    : { ok: false, reason: "no_candidates" };

  let answerIndex = 0;
  const decisions = prepared.map((item) => {
    if (item.forcedKeep) return { ...item, decision: "keep", probabilityDiscardable: 0, reason: "forced_keep" };
    const answer = evaluation.ok ? evaluation.result.answers[`discard_${answerIndex}`] : null;
    answerIndex += 1;
    const probability = answer?.probability ?? 0;
    return {
      ...item,
      decision: probability >= JEV_DROP_THRESHOLD ? "drop_candidate" : "keep",
      probabilityDiscardable: probability,
      reason: evaluation.ok ? "jev" : evaluation.reason,
    };
  });

  const retained = decisions.filter((item) => item.decision === "keep");
  const additionalContext = renderRetentionContext(retained, JEV_RETENTION_MAX_CHARS);
  return {
    schemaVersion: 1,
    createdAt: new Date().toISOString(),
    sessionId,
    trigger,
    mode: process.env.JEV_COMPACTION_MODE === "retain" ? "retain" : "shadow",
    parseWarnings,
    evaluationStatus: evaluation.ok ? "completed" : "skipped",
    evaluationReason: evaluation.ok ? null : evaluation.reason,
    metrics: {
      candidateCount: decisions.length,
      keepCount: retained.length,
      dropCandidateCount: decisions.filter((item) => item.decision === "drop_candidate").length,
      forcedKeepCount: decisions.filter((item) => item.forcedKeep).length,
    },
    decisions: decisions.map(({ id, tool, decision, probabilityDiscardable, reason, forcedKeep }) => ({ id, tool, decision, probabilityDiscardable, reason, forcedKeep })),
    additionalContext,
  };
}

export function renderRetentionContext(items, maxChars = JEV_RETENTION_MAX_CHARS) {
  const header = "The following exact tool results were retained before native compaction. Treat them as supplemental evidence; current user instructions still take precedence.\n\n";
  let output = header;
  for (const item of [...items].sort((a, b) => Number(b.forcedKeep) - Number(a.forcedKeep) || b.order - a.order)) {
    const prefix = `## ${item.tool} (${item.id})\nInput: ${item.input}\nResult:\n`;
    const remaining = maxChars - output.length;
    if (remaining <= prefix.length + 24) continue;
    const suffix = "\n[packet truncated]\n\n";
    if (prefix.length + item.result.length + 2 <= remaining) {
      output += `${prefix}${item.result}\n\n`;
    } else if (item.forcedKeep) {
      output += `${prefix}${item.result.slice(0, remaining - prefix.length - suffix.length)}${suffix}`;
    }
  }
  return output === header ? "" : output.trim();
}

export function packetPathFor(cwd, sessionId) {
  const root = findRepositoryRoot(typeof cwd === "string" && cwd ? cwd : process.cwd());
  const safeId = String(sessionId ?? "unknown").replace(/[^a-zA-Z0-9_-]/g, "");
  return path.join(root, ".codex", "runtime", `jev-retention-${safeId || "unknown"}.json`);
}

function findRepositoryRoot(start) {
  let current = path.resolve(start);
  while (true) {
    if (path.basename(current) === ".git") return path.dirname(current);
    try {
      // Keep this module dependency-free and cross-platform. The Git directory is
      // enough to stabilize project-local runtime data when Codex starts below root.
      const entries = readdirSync(current);
      if (entries.includes(".git")) return current;
    } catch {
      return path.resolve(start);
    }
    const parent = path.dirname(current);
    if (parent === current) return path.resolve(start);
    current = parent;
  }
}

export async function writeJsonAtomic(target, value) {
  await mkdir(path.dirname(target), { recursive: true });
  const temporary = `${target}.${process.pid}.tmp`;
  await writeFile(temporary, `${JSON.stringify(value, null, 2)}\n`, { encoding: "utf8", mode: 0o600 });
  await rename(temporary, target);
}

function fitState(items, maxChars) {
  const newestFirst = [...items].reverse();
  const selected = [];
  let used = 0;
  for (const item of newestFirst) {
    const text = JSON.stringify(item);
    if (used + text.length > maxChars && selected.length) continue;
    selected.push(item);
    used += text.length;
  }
  return selected.reverse();
}
