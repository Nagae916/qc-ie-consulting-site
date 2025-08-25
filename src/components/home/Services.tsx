import Link from "next/link";

export default function Services() {
  const cards: { title: string; desc: string }[] = [
    { title: "QC検定", desc: "統計の基礎〜管理図・検定・推定。現場データで演習。" },
    { title: "統計検定", desc: "記述・推測統計／多変量。理解と活用を両立。" },
    { title: "技術士（経営工学）", desc: "論文構成・キーワード整理。演習添削に対応。" },
  ];

  return (
    <section className="space-y-4">
      <h2 className="text-xl md:text-2xl font-semibold">学習サポート</h2>
      <div className="grid gap-4 md:grid-cols-3">
        {cards.map((c) => (
          <div key={c.title} className="rounded-xl bg-white p-5 shadow-sm">
            <div className="text-lg font-semibold">{c.title}</div>
            <p className="mt-2 text-gray-600 text-sm">{c.desc}</p>
          </div>
        ))}
      </div>

      <div>
        <Link
          href="/learn"
          className="inline-block rounded-lg bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700"
        >
          学習コンテンツを開く
        </Link>
      </div>
    </section>
  );
}
