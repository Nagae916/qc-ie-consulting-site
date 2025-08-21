"use client";
import { useEffect, useState } from "react";

type Post = {
  id: string;
  caption: string;
  permalink: string;
  imageUrl: string | null;
  mediaType: string;
};

type ApiResponse = {
  data?: Post[];
  error?: string;
};

const LIMIT = 3;

export default function InstagramFeed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let abort = false;

    const load = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/instagram?limit=${LIMIT}`, { cache: "no-store" });
        const json: ApiResponse = await res.json();
        if (!res.ok || json.error) throw new Error(json.error || `HTTP ${res.status}`);
        if (!abort) setPosts(json.data || []);
      } catch (e: any) {
        if (!abort) setErr(e?.message || "Instagramの取得に失敗しました");
      } finally {
        if (!abort) setLoading(false);
      }
    };
    load();
    return () => {
      abort = true;
    };
  }, []);

  if (err) {
    return <div className="text-red-600 text-sm">Instagramの読み込みでエラー: {err}</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-emerald-900">Instagram 最新投稿</h3>
        <span className="text-emerald-700/70 text-sm">自動更新</span>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {(loading ? Array.from({ length: LIMIT }) : posts).map((p: any, i: number) => {
          const imageUrl = p?.imageUrl || null;
          const caption = p?.caption || "";
          const permalink = p?.permalink || "#";

          return (
            <a
              key={p?.id || `skeleton-${i}`}
              href={permalink}
              target="_blank"
              rel="noreferrer noopener"
              className="group block rounded-2xl bg-white/90 shadow-sm ring-1 ring-emerald-900/5 p-3 transition
                         hover:shadow-emerald-300/30 hover:-translate-y-0.5 hover:shadow-lg focus:outline-none"
            >
              <div
                className={`rounded-xl overflow-hidden aspect-[4/5] bg-emerald-50
                           ring-1 ring-emerald-900/5 relative`}
              >
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={caption?.slice(0, 80) || "instagram"}
                    className="w-full h-full object-cover
                               transition-transform duration-300 ease-out
                               group-hover:scale-[1.03] group-hover:brightness-[1.02]"
                    loading="lazy"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-emerald-900/40">
                    画像なし
                  </div>
                )}
              </div>

              <div className="px-1 pt-3 text-sm text-emerald-900/80 line-clamp-2">
                {caption || "（キャプションなし）"}
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
