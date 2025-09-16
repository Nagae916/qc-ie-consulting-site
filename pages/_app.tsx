// pages/_app.tsx
import type { AppProps } from "next/app";

// 全ページ共通スタイル
import "katex/dist/katex.min.css";  // 数式（KaTeX）
import "../styles/globals.css";     // 既存のグローバル
import "@/styles/guide.css";        // ガイド統一様式（QAカード等） ← ここだけ置き換え

import ErrorBoundary from "@/components/common/ErrorBoundary";

export default function MyApp({ Component, pageProps }: AppProps) {
  // ページ側で getLayout を定義していれば、それを優先（未定義ならそのまま描画）
  const getLayout =
    // @ts-expect-error: ページの任意プロパティ
    Component.getLayout ?? ((page: any) => page);

  return <ErrorBoundary>{getLayout(<Component {...pageProps} />)}</ErrorBoundary>;
}
