// src/components/InstagramFeed.tsx
import { useEffect, useState } from "react";

type Post = {
  id: string;
  permalink: string;
  caption?: string;
  timestamp: string;

  // サーバー側(api/instagram.js)で用意している推奨プロパティ
  imgSrc?: string;

  // 念のためのフォールバック（旧バージョンのAPIレスポンスも表示可）
  media_type?: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  media_url?: string;
  thumbnail_url?: string;
  children?: { data?: Array<{ media_type: string; media_url?: string; thumbnail_url?: string }> };
};

export default function InstagramFeed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  // 画像URLを決定（サーバーから imgSrc が来ない場合の保険）
  const resolveImg = (p: Post): string | undefined => {
    if (p.imgSrc) return p.imgSrc; // サーバー側で正規化済み
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
        // 念のため imgSrc をクライアント側でも補完
        const normalized = (data ?? []).map((p) => ({
          ...p,
          imgSrc: resolveImg(p),
        }));
        setPosts(normalized);
      })
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Instagramを読み込み中…</div>;
  if (!posts.length) return <div>投稿が見つかりませんでした。</div>;

  return (
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
  );
}
