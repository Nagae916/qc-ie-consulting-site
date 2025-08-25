import Link from "next/link";
import { posts, type BlogPost } from "@/data/blog";

export default function BlogList() {
  if (!posts || posts.length === 0) {
    return (
      <p className="text-sm text-gray-500">
        ブログ記事は準備中です。
      </p>
    );
  }

  return (
    <ul className="space-y-4">
      {posts.map((p: BlogPost) => (
        <li
          key={p.id}
          className="rounded-lg border border-gray-200 p-4 bg-white shadow-sm"
        >
          <div className="flex items-center justify-between">
            <Link
              href={`/blog/${p.id}`}
              className="font-medium text-emerald-700 hover:underline"
            >
              {p.title}
            </Link>
            <span className="text-xs text-gray-500">{p.date}</span>
          </div>
          <p className="mt-2 text-sm text-gray-600">{p.excerpt}</p>
          {p.tags?.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {p.tags.map((t) => (
                <span
                  key={t}
                  className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded"
                >
                  #{t}
                </span>
              ))}
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
