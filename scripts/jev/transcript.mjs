import { JEV_MAX_CANDIDATES } from "./config.mjs";

const CALL_TYPES = new Set(["function_call", "custom_tool_call", "tool_call"]);
const RESULT_TYPES = new Set(["function_call_output", "custom_tool_call_output", "tool_result"]);

export function parseTranscriptJsonl(raw, { maxCandidates = JEV_MAX_CANDIDATES } = {}) {
  const warnings = [];
  const records = [];
  for (const [index, line] of raw.split(/\r?\n/).entries()) {
    if (!line.trim()) continue;
    try {
      records.push({ index, value: JSON.parse(line) });
    } catch {
      warnings.push(`line_${index + 1}_invalid_json`);
    }
  }

  const calls = new Map();
  const results = new Map();
  for (const record of records) walk(record.value, (node) => collectNode(node, record.index, calls, results));

  const candidates = [];
  for (const [callId, call] of calls) {
    const result = results.get(callId);
    if (!result) continue;
    candidates.push({
      id: callId,
      tool: call.name || "unknown",
      input: normalizeValue(call.arguments ?? call.input, 1800),
      result: normalizeValue(result.output ?? result.content ?? result.result, 7000),
      order: Math.max(call.order, result.order),
    });
  }
  candidates.sort((a, b) => a.order - b.order);
  return { candidates: candidates.slice(-maxCandidates), warnings };
}

function collectNode(node, order, calls, results) {
  if (!node || typeof node !== "object" || Array.isArray(node)) return;
  const type = typeof node.type === "string" ? node.type : "";
  const callId = node.call_id ?? node.tool_use_id ?? node.id;
  if (typeof callId !== "string") return;
  if (CALL_TYPES.has(type)) {
    calls.set(callId, { ...node, order });
  } else if (RESULT_TYPES.has(type)) {
    results.set(callId, { ...node, order });
  }
}

function walk(value, visit, seen = new WeakSet()) {
  if (!value || typeof value !== "object" || seen.has(value)) return;
  seen.add(value);
  visit(value);
  for (const child of Array.isArray(value) ? value : Object.values(value)) walk(child, visit, seen);
}

function normalizeValue(value, limit) {
  let text;
  if (typeof value === "string") text = value;
  else {
    try {
      text = JSON.stringify(value);
    } catch {
      text = String(value);
    }
  }
  return text.length > limit ? `${text.slice(0, limit)}\n[truncated]` : text;
}
