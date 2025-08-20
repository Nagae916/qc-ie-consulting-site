// src/components/InstagramFeed.tsx
import { useEffect, useState } from "react";

type Post = {
  id: string;
  permalink: string;
  caption?: string;
  timestamp: string;

  // サーバー(api/instagram.js)で正規化済みの表示用URL
  imgSrc?: string;

  // 旧レスポンス用の保険（サーバーが古い場合でも表示できるように）
  media_type?: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  media_url?: string;
  thumbnail_url?: string;
  children?: { data?: Array<{ media_type: string; media_url?: string; thumbnail_url?: string }> };
};

export default function InstagramFeed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  // クライアント側でも一応 img を決められるようにしておく（保険）
  const resolveImg = (p: Post): string | undefined => {
    if (p.imgSrc) return p.imgSrc;
    if (p.media_type === "IMAGE") return p.media_url;
    if (p.media_type === "VIDEO") return p.thumbnail_url ?? p.media_url;
    if (p.media_type === "CAROUSEL_ALBUM")
      return p.children?.data?.[0]?.media_url ?? p.children?.data?.[0]?.thumbnail_url;
    return undefined;
  };

  useEffect(() => {
    fetch("/api/instagram")
      .then((r) => r.json())
      .then((data: Post[]) => {
        const normalized = (data ?? []).map((p) => ({
          ...p,
          imgSrc: p.imgSrc ?? resolveImg(p),
        }));
        setPosts(normalized);
      })
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* ← これが見えればコンポーネントが正しく読み込まれています */}
      <p className="text-xs text-gray-400 mb-2">INSTAGRAM FEED COMPONENT LOADED</p>

      {loading && <div>Instagramを読み込み中…</div>}
      {!loading && !posts.length && <div>投稿が見つかりませんでした。</div>}

      {!loading && !!posts.length && (
        <div className="grid gap-4 md:grid-cols-3">
          {posts.map((p) => {
            const img = p.imgSrc ?? resolveImg(p);
            return (
              <a
                key={p.id}
                href={p.permalink}
                target="_blank"
                rel="noreferrer"
                className="block rounded-2xl overflow-hidden shadow hover:shadow-lg transition"
              >
                {img ? (
                  <img
                    src={img}
                    alt={p.caption ?? "Instagram post"}
                    className="w-full h-64 object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-64 bg-gray-200 flex items-center justify-center text-gray-500">
                    画像なし
                  </div>
                )}
                <div className="p-3 text-sm text-gray-600 line-clamp-2">
                  {p.caption ?? "Instagram Post"}
                </div>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
