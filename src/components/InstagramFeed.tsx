// src/components/InstagramFeed.tsx
import { useEffect, useState } from "react";

type Post = {
  id: string;
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  media_url: string;
  thumbnail_url?: string; // VIDEO用にあることが多い
  permalink: string;
  caption?: string;
};

type ApiResponse = {
  data: Post[];
  error?: string;
};

const LIMIT = 3; // ← 表示数は今のまま（必要ならここだけ変更）

export default function InstagramFeed() {
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        // 既存のAPIルートに合わせてください（以前の構成：/api/instagram?limit=3）
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

  if (err) {
    return <p className="text-sm text-red-600">Instagramの読み込みエラー：{err}</p>;
  }
  if (!posts) {
    return <p className="text-sm text-gray-500">読み込み中...</p>;
  }

  return (
    <div className="grid grid-cols-3 gap-3">
      {posts.slice(0, LIMIT).map((p) => (
        <a
          key={p.id}
          href={p.permalink}
          target="_blank"
          rel="noopener noreferrer"
          className="group block rounded-xl border border-brand-200 bg-white shadow-soft overflow-hidden"
          aria-label="Instagram post"
        >
          {/* 
            ■ 重要：全体表示（非トリミング）
            - aspect-square で正方形枠を維持
            - img は object-contain で全体を収める
            - 背景を白 or 淡色にして“余白”が出ても綺麗に
          */}
          <div className="relative w-full aspect-square bg-white flex items-center justify-center">
            <img
              src={
                p.media_type === "VIDEO"
                  ? p.thumbnail_url || p.media_url
                  : p.media_url
              }
              alt={p.caption ? p.caption.slice(0, 70) : "Instagram"}
              className="max-w-full max-h-full object-contain"
              loading="lazy"
              decoding="async"
            />
          </div>

          {/* キャプション一行（任意） */}
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
