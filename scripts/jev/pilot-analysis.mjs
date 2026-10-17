import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

// Offline only. Confidence is attached to a verdict, not a probability of a defect.
export function analyzePilot(rows, threshold) {
  if (!Array.isArray(rows)) throw new Error('Expected an array of assessments');
  if (!Number.isFinite(threshold) || threshold < 0 || threshold > 1) throw new Error('Specify a validated threshold in [0,1]');
  const seen = new Set();
  const strategies = { jev: [], upper: [], cascade: [] };
  const domains = {};
  let skipped = 0;
  let escalations = 0;
  for (const row of rows) {
    if (!row.caseId || seen.has(row.caseId)) throw new Error('Missing or duplicate caseId');
    seen.add(row.caseId);
    if (!['selection', 'heldout'].includes(row.split)) throw new Error('Invalid split');
    if (!['prose', 'math', 'code', 'security'].includes(row.domain)) throw new Error('Invalid domain');
    if (typeof row.gold !== 'boolean') throw new Error('Independent boolean gold required');
    for (const answer of [row.jev, row.upper]) {
      if (answer == null) continue;
      if (typeof answer.valid !== 'boolean') throw new Error('Explicit response validity required');
      if (answer.valid && typeof answer.verdict !== 'boolean') throw new Error('Valid response requires a boolean verdict');
      if (answer.costUsd != null && (!Number.isFinite(answer.costUsd) || answer.costUsd < 0)) throw new Error('Invalid cost');
    }
    if (row.jev?.valid && (!Number.isFinite(row.jev.confidence) || row.jev.confidence < 0 || row.jev.confidence > 1)) throw new Error('Invalid verdict confidence');
    // Selection data must not enter the held-out performance report.
    if (row.split === 'selection') continue;
    if (row.jev == null || row.upper == null) { skipped++; continue; }
    const defer = !row.jev.valid || row.jev.confidence < threshold;
    const selected = defer ? row.upper : row.jev;
    escalations += Number(defer);
    const costsKnown = row.jev.costUsd != null && (!defer || row.upper.costUsd != null);
    const values = {
      jev: { correct: row.jev.valid && row.jev.verdict === row.gold, cost: row.jev.costUsd ?? null },
      upper: { correct: row.upper.valid && row.upper.verdict === row.gold, cost: row.upper.costUsd ?? null },
      cascade: { correct: selected.valid && selected.verdict === row.gold, cost: costsKnown ? row.jev.costUsd + (defer ? row.upper.costUsd : 0) : null },
    };
    domains[row.domain] ??= { jev: [], upper: [], cascade: [] };
    for (const [key, value] of Object.entries(values)) {
      strategies[key].push(value);
      domains[row.domain][key].push(value);
    }
  }
  const summarize = (items) => {
    const count = items.length;
    const correct = items.filter((item) => item.correct).length;
    const known = count > 0 && items.every((item) => item.cost != null);
    const totalCostUsd = known ? items.reduce((sum, item) => sum + item.cost, 0) : null;
    return { count, correct, accuracy: count ? correct / count : null, totalCostUsd, costPerCorrectUsd: known && correct ? totalCostUsd / correct : null };
  };
  return {
    mode: 'offline_replay', threshold,
    measuredPairs: strategies.jev.length, skippedHeldout: skipped,
    escalations, escalationRate: strategies.jev.length ? escalations / strategies.jev.length : null,
    strategies: Object.fromEntries(Object.entries(strategies).map(([key, items]) => [key, summarize(items)])),
    domains: Object.fromEntries(Object.entries(domains).map(([domain, values]) => [domain, Object.fromEntries(Object.entries(values).map(([key, items]) => [key, summarize(items)]))])),
    note: 'Offline replay excludes live sequential latency. Use only independent gold and comparable recorded costs; no measurements are generated.',
  };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  try {
    const [inputPath, thresholdText] = process.argv.slice(2);
    if (!inputPath || thresholdText == null) throw new Error('Usage: node scripts/jev/pilot-analysis.mjs <assessments.json> <validated-threshold>');
    const result = analyzePilot(JSON.parse(await readFile(inputPath, 'utf8')), Number(thresholdText));
    process.stdout.write(JSON.stringify(result, null, 2) + '\n');
  } catch (error) {
    process.stderr.write(error.message + '\n');
    process.exitCode = 1;
  }
}
