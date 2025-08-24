// pages/_app.tsx
import type { AppProps } from 'next/app';
import '../styles/globals.css'; // ← ここでグローバルCSSを読み込む

export default function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
