export default function Training() {
  const items = [
    {
      title: "SPC演習（演習付き）",
      desc: "管理図・工程能力・異常検知を短期集中で。社内データ演習可。",
    },
    {
      title: "IE基礎",
      desc: "動作/時間研究・ラインバランス。改善テーマに応じて設計。",
    },
  ];

  return (
    <section className="space-y-4">
      <h2 className="text-xl md:text-2xl font-semibold">研修（カスタム前提）</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {items.map((x) => (
          <div key={x.title} className="rounded-xl bg-white p-5 shadow-sm">
            <div className="text-lg font-semibold">{x.title}</div>
            <p className="mt-2 text-gray-600 text-sm">{x.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
