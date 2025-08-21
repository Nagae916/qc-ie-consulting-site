// src/components/InstagramFeed.tsx
import React, { useEffect, useState } from "react";

type IgItem = {
  id: string;
  caption?: string;
  media_type?: string;
  media_url?: string;
  thumbnail_url?: string;
  permalink?: string;
  timestamp?: string;
};

type ApiResponse = {
  data?: IgItem[];
  error?: string;
};

const LIMIT = 3;

export default function InstagramFeed() {
  const [items, setItems] = useState<IgItem[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`/api/instagram?limit=${LIMIT}`, { cache: "no-store" });
        const json: ApiResponse = await res.json();
        if (!res.ok || json.error) throw new Error(json.error || `HTTP ${res.status}`);
        setItems(json.data || []);
      } catch (e: any) {
        setErr(e.message || "Instagramの取得に失敗しました");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div>読み込み中…</div>;
  if (err) return <div style={{ color: "#b91c1c" }}>Instagramの読み込みでエラー: {err}</div>;
  if (!items.length) return <div>表示できる投稿がありません。</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {items.map((it) => {
        const img = it.media_url || it.thumbnail_url;
        return (
          <a
            key={it.id}
            href={it.permalink}
            target="_blank"
            rel="noreferrer"
            className="block rounded-2xl overflow-hidden shadow-sm bg-white
                       transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
            style={{ border: "1px solid #e5e7eb" }}
          >
            {img ? (
              <div className="w-full aspect-[1/1] relative overflow-hidden">
                <img
                  src={img}
                  alt={it.caption || "Instagram post"}
                  className="absolute inset-0 w-full h-full object-cover
                             transition-transform duration-200 hover:scale-[1.03]"
                />
              </div>
            ) : (
              <div className="w-full aspect-[1/1] flex items-center justify-center bg-green-50 text-green-900">
                画像なし
              </div>
            )}
            <div className="p-3 text-sm text-gray-700 line-clamp-2">{it.caption || ""}</div>
          </a>
        );
      })}
    </div>
  );
}
