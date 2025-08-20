// src/components/InstagramFeed.tsx
import { useEffect, useState } from "react";

type Post = {
  id: string;
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  media_url: string;
  thumbnail_url?: string;
  permalink: string;
  caption?: string;
};

type ApiResponse = {
  data: Post[];
  error?: string;
};

const LIMIT = 3; // 表示数はそのまま

export default function InstagramFeed() {
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`/api/instagram?limit=${LIMIT}`, { cache: "no-store" });
        const json: ApiResponse = await res.json();
        if (!res.ok || json.error) throw new Error(json.error || `HTTP ${res.status}`);
        setPosts(json.data);
      } catch (e: any) {
        setErr(e.message || "Instagramの取得に失敗しました");
      }
    };
    load();
  }, []);

  if (err) return <p className="text-sm text-red-600">Instagramの読み込みエラー：{err}</p>;
  if (!posts) return <p className="text-sm text-gray-500">読み込み中...</p>;

  return (
    <div className="grid grid-cols-3 gap-3">
      {posts.slice(0, LIMIT).map((p) => (
        <a
          key={p.id}
          href={p.permalink}
          target="_blank"
          rel="noopener noreferrer"
          className="
            group block rounded-xl border border-brand-200 bg-white shadow-soft overflow-hidden
            transition-transform duration-300 ease-out
            hover:-translate-y-1 hover:shadow-xl
            focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400
          "
          aria-label="Instagram post"
        >
          {/* サムネ：通常は全体表示（object-contain）。ホバー時のみ軽くズーム */}
          <div className="relative w-full aspect-square bg-white overflow-hidden">
            <img
              src={p.media_type === "VIDEO" ? p.thumbnail_url || p.media_url : p.media_url}
              alt={p.caption ? p.caption.slice(0, 70) : "Instagram"}
              className="
                mx-auto max-w-full max-h-full object-contain
                transition-transform duration-300 ease-out
                group-hover:scale-[1.04]    /* わずかにズーム */
                motion-reduce:transition-none motion-reduce:transform-none
              "
              loading="lazy"
              decoding="async"
            />
          </div>

          {/* キャプション（1行） */}
          {p.caption ? (
            <div className="px-2 py-2">
              <p className="text-xs text-gray-600 line-clamp-1">{p.caption}</p>
            </div>
          ) : null}
        </a>
      ))}
    </div>
  );
}
