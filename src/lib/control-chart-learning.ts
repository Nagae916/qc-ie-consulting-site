export type ControlChartScenarioId = "stable" | "shift" | "variation";

export type ControlChartLimits = {
  centerLine: number;
  averageMovingRange: number;
  upperControlLimit: number;
  lowerControlLimit: number;
};

export type ControlChartScenario = {
  id: ControlChartScenarioId;
  label: string;
  description: string;
  values: readonly number[];
};

export const CONTROL_CHART_SCENARIOS: Record<ControlChartScenarioId, ControlChartScenario> = {
  stable: {
    id: "stable",
    label: "安定した状態",
    description: "点は中心線の周りで小さく変動し、管理限界を超えていません。",
    values: [50.0, 50.1, 49.9, 50.2, 50.0, 49.8, 50.1, 50.0, 49.9, 50.2, 50.0, 49.8],
  },
  shift: {
    id: "shift",
    label: "平均が移動",
    description: "後半の測定値が上側へ移動し、安定時の上方管理限界を超えます。",
    values: [50.0, 50.1, 49.9, 50.2, 50.0, 49.8, 50.2, 50.4, 50.6, 50.8, 50.9, 51.0],
  },
  variation: {
    id: "variation",
    label: "ばらつきが増大",
    description: "後半の振れ幅が大きくなり、上下の管理限界を超える点が現れます。",
    values: [50.0, 50.1, 49.9, 50.2, 50.0, 49.8, 49.3, 50.7, 49.1, 50.9, 49.2, 50.8],
  },
};

export function calculateIndividualsLimits(values: readonly number[]): ControlChartLimits {
  if (values.length < 2) throw new Error("個別値管理図の管理限界には2点以上の値が必要です。");

  const centerLine = values.reduce((sum, value) => sum + value, 0) / values.length;
  const movingRanges = values.slice(1).map((value, index) => Math.abs(value - values[index]!));
  const averageMovingRange = movingRanges.reduce((sum, value) => sum + value, 0) / movingRanges.length;
  const estimatedSigma = averageMovingRange / 1.128;

  return {
    centerLine,
    averageMovingRange,
    upperControlLimit: centerLine + 3 * estimatedSigma,
    lowerControlLimit: centerLine - 3 * estimatedSigma,
  };
}

export const CONTROL_CHART_REFERENCE_LIMITS = calculateIndividualsLimits(
  CONTROL_CHART_SCENARIOS.stable.values,
);

export function getSignalIndices(
  values: readonly number[],
  limits: ControlChartLimits = CONTROL_CHART_REFERENCE_LIMITS,
): number[] {
  return values.flatMap((value, index) =>
    value > limits.upperControlLimit || value < limits.lowerControlLimit ? [index] : [],
  );
}
