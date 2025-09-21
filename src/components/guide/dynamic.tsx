// src/components/guide/dynamic.tsx
import dynamic from "next/dynamic";

// Chart.js を内部で使うものはすべて ssr:false でラップ
export const OCSimulatorClient = dynamic(() => import("./OCSimulator"), {
  ssr: false,
  loading: () => <div className="text-gray-500">OC曲線を読み込み中…</div>,
});

export const AvailabilitySimulatorClient = dynamic(() => import("./AvailabilitySimulator"), {
  ssr: false,
  loading: () => <div className="text-gray-500">可用性シミュレーターを読み込み中…</div>,
});

export const ControlChartClient = dynamic(() => import("./ControlChart"), {
  ssr: false,
  loading: () => <div className="text-gray-500">管理図を読み込み中…</div>,
});

// もし ChiSquareGuide がインタラクティブならこちらも
export const ChiSquareGuideClient = dynamic(() => import("./ChiSquareGuide"), {
  ssr: false,
  loading: () => <div className="text-gray-500">カイ二乗ガイドを読み込み中…</div>,
});
