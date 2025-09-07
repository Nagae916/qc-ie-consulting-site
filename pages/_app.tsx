// pages/_app.tsx
import type { AppProps } from "next/app";

// 全ページ共通スタイル
import "katex/dist/katex.min.css";  // 数式（KaTeX）
import "../styles/globals.css";     // 既存のグローバル
import "../styles/guide.css";       // ★ 追加：ガイド統一様式（QAカード等）

import ErrorBoundary from "@/components/common/ErrorBoundary";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ErrorBoundary>
      <Component {...pageProps} />
    </ErrorBoundary>
  );
}
