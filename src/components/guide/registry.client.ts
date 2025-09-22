'use client';
import dynamic from 'next/dynamic';

/** default / named どちらでも「default」に揃えて返す互換ヘルパ */
const asDefault = async <T extends Record<string, any>>(
  modPromise: Promise<T>,
  named?: keyof T
) => {
  const m = await modPromise;
  // default優先 → named指定 → モジュール全体（最後は保険）
  return { default: (m as any).default ?? (named ? (m as any)[named] : undefined) ?? m } as {
    default: React.ComponentType<any>;
  };
};

/** 動的ウィジェットのレジストリ（ここだけを更新すればOK） */
export const GUIDE_COMPONENTS = {
  // ファイル名をコメントで明記して人的ミスを予防
  // /src/components/guide/Quiz.tsx（named export: Quiz）
  Quiz: dynamic(() => asDefault(import('./Quiz'), 'Quiz'), { ssr: false }),

  // /src/components/guide/ControlChart.tsx（default想定）
  ControlChart: dynamic(() => asDefault(import('./ControlChart')), { ssr: false }),

  // /src/components/guide/AvailabilitySimulator.tsx（default）
  AvailabilitySimulator: dynamic(() => asDefault(import('./AvailabilitySimulator')), { ssr: false }),

  // /src/components/guide/OCSimulator.tsx（default）
  OCSimulator: dynamic(() => asDefault(import('./OCSimulator')), { ssr: false }),

  // /src/components/guide/ChiSquareGuide.tsx（default）
  ChiSquareGuide: dynamic(() => asDefault(import('./ChiSquareGuide')), { ssr: false }),
} as const;

// 型：MDXに渡すための緩い辞書（型エラーを起こさない）
export type GuideComponentMap = Record<string, React.ComponentType<any>>;
