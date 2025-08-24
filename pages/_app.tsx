import type { AppProps } from "next/app";
import "@/index.css"; // 既存の src/index.css をグローバル読み込み
export default function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
