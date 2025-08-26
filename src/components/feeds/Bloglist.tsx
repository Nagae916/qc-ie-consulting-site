// src/components/feeds/BlogList.tsx
import Link from "next/link";
import { posts, type BlogPost } from "@/data/blog";
import { normalizeStringArray } from "@/lib/safe";

export default function BlogList() {
  const list: BlogPost[] = Array.isArray(posts) ? posts : [];

  if (list.length === 0) {
    return <p className="text-sm text-gray-500">ブログ記事は準備中です。</p>;
  }

  return (
    <ul className="space-y-4">
      {list.map((p) => {
        const tags = normalizeStringArray((p as any).tags);

        return (
          <li key={p.id} className="rounded-lg border border-gray-200 p-4 bg-white shadow-sm">
            <div className="flex items-center justify-between">
              <Link href={`/blog/${p.id}`} className="font-medium text-emerald-700 hover:underline">
                {p.title}
              </Link>
              {p.date ? <span className="text-xs text-gray-500">{p.date}</span> : null}
            </div>

            {p.excerpt ? <p className="mt-2 text-sm text-gray-600">{p.excerpt}</p> : null}

            {tags.length > 0 ? (
              <div className="mt-2 flex flex-wrap gap-2">
                {tags.map((t) => (
                  <span key={t} className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded">
                    #{t}
                  </span>
                ))}
              </div>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}
