// pages/_app.tsx
import type { AppProps } from 'next/app'
import '../index.css'  // Tailwind 読み込み

export default function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
