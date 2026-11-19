import assert from "node:assert/strict";
import test from "node:test";

import {
  CONTROL_CHART_REFERENCE_LIMITS,
  CONTROL_CHART_SCENARIOS,
  calculateIndividualsLimits,
  getSignalIndices,
} from "../src/lib/control-chart-learning.ts";

test("安定時データから個別値管理図の基準を求める", () => {
  const limits = calculateIndividualsLimits(CONTROL_CHART_SCENARIOS.stable.values);
  assert.equal(limits.centerLine, 50);
  assert.ok(Math.abs(limits.averageMovingRange - 0.2) < 1e-12);
  assert.ok(Math.abs(limits.upperControlLimit - 50.53191489361702) < 1e-12);
  assert.ok(Math.abs(limits.lowerControlLimit - 49.46808510638298) < 1e-12);
});

test("安定状態には管理限界外の点がない", () => {
  assert.deepEqual(getSignalIndices(CONTROL_CHART_SCENARIOS.stable.values), []);
});

test("平均移動とばらつき増大を安定時の同じ限界で判定する", () => {
  assert.deepEqual(getSignalIndices(CONTROL_CHART_SCENARIOS.shift.values), [8, 9, 10, 11]);
  assert.deepEqual(getSignalIndices(CONTROL_CHART_SCENARIOS.variation.values), [6, 7, 8, 9, 10, 11]);
  assert.equal(CONTROL_CHART_REFERENCE_LIMITS.centerLine, 50);
});

test("2点未満では管理限界を計算しない", () => {
  assert.throws(() => calculateIndividualsLimits([50]), /2点以上/);
});
