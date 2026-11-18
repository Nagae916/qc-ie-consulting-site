import { useMemo, useState } from "react";

import {
  CONTROL_CHART_REFERENCE_LIMITS,
  CONTROL_CHART_SCENARIOS,
  getSignalIndices,
  type ControlChartScenarioId,
} from "@/lib/control-chart-learning";

const scenarioOrder: ControlChartScenarioId[] = ["stable", "shift", "variation"];
const chart = { width: 720, height: 340, left: 68, right: 28, top: 28, bottom: 54 };

const format = (value: number) => value.toFixed(2);

export default function ControlChartLearningDemo() {
  const [scenarioId, setScenarioId] = useState<ControlChartScenarioId>("stable");
  const scenario = CONTROL_CHART_SCENARIOS[scenarioId];
  const limits = CONTROL_CHART_REFERENCE_LIMITS;
  const signalIndices = useMemo(() => getSignalIndices(scenario.values, limits), [scenario.values, limits]);

  const allValues = [limits.lowerControlLimit, limits.upperControlLimit, ...scenario.values];
  const yMin = Math.min(...allValues) - 0.15;
  const yMax = Math.max(...allValues) + 0.15;
  const plotWidth = chart.width - chart.left - chart.right;
  const plotHeight = chart.height - chart.top - chart.bottom;
  const x = (index: number) => chart.left + (index / (scenario.values.length - 1)) * plotWidth;
  const y = (value: number) => chart.top + ((yMax - value) / (yMax - yMin)) * plotHeight;
  const points = scenario.values.map((value, index) => `${x(index)},${y(value)}`).join(" ");

  const limitLines = [
    { label: "上方管理限界 UCL", value: limits.upperControlLimit, dash: "8 5" },
    { label: "中心線 CL", value: limits.centerLine, dash: "" },
    { label: "下方管理限界 LCL", value: limits.lowerControlLimit, dash: "8 5" },
  ];

  return (
    <div className="rounded-lg border border-slate-300 bg-white p-4 sm:p-5">
      <div className="flex flex-wrap gap-2" aria-label="工程状態を選ぶ">
        {scenarioOrder.map((id) => (
          <button
            key={id}
            type="button"
            aria-pressed={scenarioId === id}
            onClick={() => setScenarioId(id)}
            className={`rounded-md border px-3 py-2 text-sm font-bold focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 ${
              scenarioId === id
                ? "border-teal-700 bg-teal-700 text-white"
                : "border-slate-300 bg-white text-slate-800 hover:border-teal-600"
            }`}
          >
            {CONTROL_CHART_SCENARIOS[id].label}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setScenarioId("stable")}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm font-bold text-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2"
        >
          リセット
        </button>
      </div>

      <div
        className="mt-4 overflow-x-auto focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2"
        role="region"
        aria-label="個別値管理図。横方向にスクロールできます"
        tabIndex={0}
      >
        <svg
          viewBox={`0 0 ${chart.width} ${chart.height}`}
          className="min-w-[620px]"
          role="img"
          aria-labelledby="control-chart-title control-chart-description"
        >
          <title id="control-chart-title">{`${scenario.label}の個別値管理図`}</title>
          <desc id="control-chart-description">
            安定時の仮想データから求めた中心線と上下管理限界を固定し、12回の測定値を時系列で示します。
          </desc>
          <rect x={chart.left} y={chart.top} width={plotWidth} height={plotHeight} fill="#f8fafc" stroke="#cbd5e1" />

          {limitLines.map((line) => (
            <g key={line.label}>
              <line
                x1={chart.left}
                x2={chart.width - chart.right}
                y1={y(line.value)}
                y2={y(line.value)}
                stroke={line.label.includes("CL") && !line.label.includes("UCL") && !line.label.includes("LCL") ? "#0f766e" : "#475569"}
                strokeWidth="2"
                strokeDasharray={line.dash}
              />
              <text x={chart.left + 8} y={y(line.value) - 7} fill="#334155" fontSize="13" fontWeight="700">
                {line.label} {format(line.value)}
              </text>
            </g>
          ))}

          <polyline points={points} fill="none" stroke="#0369a1" strokeWidth="2.5" />
          {scenario.values.map((value, index) => {
            const isSignal = signalIndices.includes(index);
            const px = x(index);
            const py = y(value);
            return isSignal ? (
              <g key={index}>
                <path
                  d={`M ${px} ${py - 7} L ${px + 7} ${py} L ${px} ${py + 7} L ${px - 7} ${py} Z`}
                  fill="#b91c1c"
                  stroke="#7f1d1d"
                  strokeWidth="1.5"
                />
                <text x={px} y={py - 11} textAnchor="middle" fill="#991b1b" fontSize="12" fontWeight="700">信号</text>
              </g>
            ) : (
              <circle key={index} cx={px} cy={py} r="5" fill="#ffffff" stroke="#0369a1" strokeWidth="2.5" />
            );
          })}

          {scenario.values.map((_, index) => (
            <text key={index} x={x(index)} y={chart.height - 27} textAnchor="middle" fill="#475569" fontSize="12">
              {index + 1}
            </text>
          ))}
          <text x={chart.left + plotWidth / 2} y={chart.height - 5} textAnchor="middle" fill="#334155" fontSize="13" fontWeight="700">
            測定順
          </text>
          <text transform={`translate(17 ${chart.top + plotHeight / 2}) rotate(-90)`} textAnchor="middle" fill="#334155" fontSize="13" fontWeight="700">
            測定値（仮想単位）
          </text>
        </svg>
      </div>

      <div className="mt-3 grid gap-2 text-sm leading-6 text-slate-700 sm:grid-cols-3" aria-live="polite">
        <p><strong className="text-slate-950">選択中：</strong>{scenario.label}</p>
        <p><strong className="text-slate-950">管理限界外：</strong>{signalIndices.length}点</p>
        <p><strong className="text-slate-950">基準：</strong>安定時の12点で固定</p>
      </div>
      <p className="mt-2 text-sm leading-6 text-slate-600">{scenario.description} 限界超過は原因調査を始めるシグナルであり、原因や不良を確定するものではありません。</p>
    </div>
  );
}
