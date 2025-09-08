// src/components/guide/BaseChart.tsx
'use client';
import React, { useEffect, useMemo, useRef } from 'react';
import { Chart, ChartConfiguration } from 'chart.js/auto';

type Props = {
  /** Chart.js の設定（type / data / options を含む） */
  config: ChartConfiguration;
  /** キャンバスの見た目高さ（px）。既定 280 */
  height?: number;
  /** 任意のクラス */
  className?: string;
};

/**
 * Chart.js を“素のまま”描画する薄いラッパ。
 * - 設定（config）が変わるたびに安全に再生成
 * - 依存配列に複雑式を置かない（ESLint 警告の恒久解消）
 * - ぼやけ防止のため canvas の height 属性も付与
 */
export default function BaseChart({ config, height = 280, className }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartRef = useRef<Chart | null>(null);

  // 依存を単純化（親側で useMemo 済みならそのままでもOK）
  const memoConfig = useMemo(() => config, [config]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // 既存インスタンスがあれば破棄
    chartRef.current?.destroy();

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 再生成
    chartRef.current = new Chart(ctx, memoConfig);

    return () => {
      chartRef.current?.destroy();
      chartRef.current = null;
    };
  }, [memoConfig]);

  // width は CSS で100%、height は属性＆CSSの両方を付与（描画の安定化）
  return <canvas ref={canvasRef} className={className} height={height} style={{ width: '100%', height }} />;
}
