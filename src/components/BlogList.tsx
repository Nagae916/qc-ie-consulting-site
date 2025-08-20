import { posts } from "../data/blog";

export default function BlogList() {
  return (
    <div className="rounded-xl2 bg-white shadow-soft border border-brand-200">
      <div className="px-5 py-4 border-b border-brand-200 bg-brand-100/60 rounded-t-xl2">
        <h3 className="font-semibold text-brand-900">ブログ</h3>
        <p className="text-xs text-gray-600 mt-1">
          簡易な社内ブログ。必要に応じてCMS等に差し替え可能です。
        </p>
      </div>
      <ul className="divide-y divide-brand-200">
        {posts
          .sort((a, b) => b.date.localeCompare(a.date))
          .slice(0, 5)
          .map((p) => (
            <li key={p.id} className="p-4">
              <h4 className="font-semibold text-brand-900">{p.title}</h4>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(p.date).toLocaleDateString("ja-JP")} ・ {p.tags.join(" / ")}
              </p>
              <p className="text-sm text-gray-700 mt-2">{p.excerpt}</p>
              {/* 簡易「続きを読む」 */}
              <details className="mt-2">
                <summary className="text-sm text-brand-700 cursor-pointer select-none">
                  続きを読む
                </summary>
                <p className="text-sm text-gray-700 mt-2 whitespace-pre-wrap">{p.body}</p>
              </details>
            </li>
          ))}
      </ul>
    </div>
  );
}
