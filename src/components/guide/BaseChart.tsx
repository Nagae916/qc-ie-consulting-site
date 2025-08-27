'use client';
import { Chart, ChartConfiguration } from 'chart.js/auto';
import React, { useEffect, useRef } from 'react';

type Props = { config: ChartConfiguration; height?: number };

export default function BaseChart({ config, height = 280 }: Props) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    if (chartRef.current) chartRef.current.destroy();
    chartRef.current = new Chart(ref.current.getContext('2d')!, config);
    return () => { chartRef.current?.destroy(); chartRef.current = null; };
  }, [JSON.stringify(config)]); // 設定が変わったら再生成

  return <canvas ref={ref} style={{ width: '100%', height }} />;
}
