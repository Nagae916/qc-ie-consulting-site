// src/App.tsx
import InstagramFeed from "./components/InstagramFeed";

export default function App() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <section className="mb-10">
        <h1 className="text-3xl font-bold mb-6">品質管理 × 経営工学コンサルティング</h1>
        <p className="text-gray-600">
          SPC / DOE / IE を現場に実装し、再現性ある成果を。ISO/IATF準拠。
        </p>
      </section>

      {/* 旧：600x600の静的ダミーカードのセクションは削除してください */}
      {/* 新：動的Instagramフィード */}
      <section className="mt-12">
        <h2 className="text-xl font-semibold mb-4">Instagram 最新投稿</h2>
        <InstagramFeed />
      </section>
    </main>
  );
}
