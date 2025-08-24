// pages/_app.tsx
import type { AppProps } from "next/app";
import "../styles/globals.css"; // ← ここだけに集約（src/index.css は使わない）

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
