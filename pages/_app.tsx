// pages/_app.tsx
import type { AppProps } from "next/app";
import type { NextPage } from "next";
import type { ReactElement, ReactNode } from "react";

// 全ページ共通スタイル（順序重要：ベース → KaTeX → ガイド拡張）
import "@/styles/globals.css";      // Tailwind 等のグローバル
import "katex/dist/katex.min.css";  // 数式（KaTeX）
import "@/styles/guide.css";        // ガイド統一様式（QAカード等）

import ErrorBoundary from "@/components/common/ErrorBoundary";

// ページごとのレイアウト（getLayout）に対応する型
export type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  // ページ側に getLayout があれば優先、なければそのまま描画
  const getLayout = Component.getLayout ?? ((page: ReactElement) => page);

  return <ErrorBoundary>{getLayout(<Component {...pageProps} />)}</ErrorBoundary>;
}
