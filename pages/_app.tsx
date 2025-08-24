import type { AppProps } from "next/app";

// 既存のグローバルCSSを読み込み
// src/index.css をそのまま使うなら↓
import "@/index.css"; // 使えるパスにしてください（例: src/index.css を @ エイリアスで）

export default function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
