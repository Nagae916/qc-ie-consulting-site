import { test } from 'node:test';
import assert from 'node:assert/strict';
import { analyzePilot } from '../pilot-analysis.mjs';

// Synthetic policy checks, not model-performance measurements.
const row = (caseId, extra = {}) => ({ caseId, split: 'heldout', domain: 'code', gold: true, jev: { valid: true, verdict: true, confidence: 0.95, costUsd: 0.01 }, upper: { valid: true, verdict: true, costUsd: 0.1 }, ...extra });
test('selection and missing responses do not inflate measured coverage', () => {
  const r = analyzePilot([row('selection', { split: 'selection' }), row('unmeasured', { jev: null }), row('measured')], 0.9);
  assert.equal(r.measuredPairs, 1);
  assert.equal(r.skippedHeldout, 1);
  assert.equal(r.strategies.cascade.totalCostUsd, 0.01);
});
test('invalid first stage defers and invalid fallback counts as error', () => {
  const r = analyzePilot([row('invalid', { jev: { valid: false, costUsd: null }, upper: { valid: false, costUsd: 0.1 } })], 0.9);
  assert.equal(r.escalations, 1);
  assert.equal(r.strategies.cascade.correct, 0);
  assert.equal(r.strategies.cascade.totalCostUsd, null);
});
test('unknown cost stays unknown and confident mistakes remain errors', () => {
  const r = analyzePilot([row('wrong', { jev: { valid: true, verdict: false, confidence: 0.99, costUsd: null } })], 0.9);
  assert.equal(r.strategies.cascade.accuracy, 0);
  assert.equal(r.strategies.cascade.totalCostUsd, null);
});
test('uncertain decisions include both charges and retain domain separation', () => {
  const r = analyzePilot([row('math', { domain: 'math', jev: { valid: true, verdict: false, confidence: 0.6, costUsd: 0.01 } }), row('code')], 0.9);
  assert.equal(r.escalations, 1);
  assert.ok(Math.abs(r.strategies.cascade.totalCostUsd - 0.12) < 1e-9);
  assert.equal(r.domains.math.cascade.accuracy, 1);
  assert.equal(r.domains.code.cascade.count, 1);
});
test('requires a threshold and valid confidence and unique cases', () => {
  assert.throws(() => analyzePilot([], undefined));
  assert.throws(() => analyzePilot([row('bad', { jev: { valid: true, verdict: true, confidence: 2 } })], 0.9));
  assert.throws(() => analyzePilot([row('duplicate'), row('duplicate')], 0.9));
});
