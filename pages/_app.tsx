// pages/_app.tsx
import type { AppProps } from "next/app";
import "katex/dist/katex.min.css";        // ★ 追加：KaTeX のスタイルを全ページに適用
import "../styles/globals.css";
import ErrorBoundary from "@/components/common/ErrorBoundary";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ErrorBoundary>
      <Component {...pageProps} />
    </ErrorBoundary>
  );
}
