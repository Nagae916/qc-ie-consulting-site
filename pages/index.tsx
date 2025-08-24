// pages/index.tsx
import Link from "next/link";

export default function Home() {
  return (
    <main style={{ padding: 24 }}>
      <h1>QC × IE LABO</h1>
      <p>トップページ（仮）。</p>
      <p>
        <Link href="/learn">学習コンテンツへ →</Link>
      </p>
    </main>
  );
}
