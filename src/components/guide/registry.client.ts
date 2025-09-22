// src/components/guide/registry.client.ts
'use client';

import type React from 'react';
import dynamic from 'next/dynamic';

/**
 * asDefault:
 * - default / named の差異を吸収して、必ず { default: Component } 形式で返す互換ヘルパ
 * - まず default を優先し、無ければ named 指定、最後にモジュール全体を保険として返す
 */
const asDefault = async <T extends Record<string, any>>(
  modPromise: Promise<T>,
  named?: keyof T
): Promise<{ default: React.ComponentType<any> }> => {
  const m = await modPromise;
  return {
    default: (m as any).default ?? (named ? (m as any)[named] : undefined) ?? (m as any),
  };
};

/**
 * 動的ウィジェットのレジストリ
 * - MDX 側は <Quiz/>, <ControlChart/>, <AvailabilitySimulator/>, <OCSimulator/>, <ChiSquareGuide/> と **タグだけ**を書く
 * - ここに列挙したキー名と MDX タグ名を一致させる
 * - dynamic import は SSR 無効（{ ssr:false }）
 */
export const GUIDE_COMPONENTS = {
  // ファイルパスをコメントで明記し、人的ミスを予防

  // /src/components/guide/Quiz.tsx（named export: Quiz）
  Quiz: dynamic(() => asDefault(import('./Quiz'), 'Quiz'), { ssr: false }),

  // /src/components/guide/ControlChart.tsx（default export想定）
  ControlChart: dynamic(() => asDefault(import('./ControlChart')), { ssr: false }),

  // /src/components/guide/AvailabilitySimulator.tsx（default）
  AvailabilitySimulator: dynamic(() => asDefault(import('./AvailabilitySimulator')), { ssr: false }),

  // /src/components/guide/OCSimulator.tsx（default）
  OCSimulator: dynamic(() => asDefault(import('./OCSimulator')), { ssr: false }),

  // /src/components/guide/ChiSquareGuide.tsx（default）
  ChiSquareGuide: dynamic(() => asDefault(import('./ChiSquareGuide')), { ssr: false }),
} as const;

/** MDX に渡すための緩い辞書型（default/named 差異は asDefault で吸収） */
export type GuideComponentMap = Record<string, React.ComponentType<any>>;

/** 必要に応じて利用：レジストリのキー型 */
export type GuideComponentKeys = keyof typeof GUIDE_COMPONENTS;
