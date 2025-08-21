// /components/InstagramFeed.tsx
import React, { useEffect, useState } from 'react';

type Post = {
  id: string;
  permalink: string;
  caption?: string;
  media_url?: string;
  thumbnail_url?: string;
};

export default function InstagramFeed({ limit = 3 }: { limit?: number }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setErr(null);
      try {
        const res = await fetch(`/api/instagram?limit=${limit}`, { cache: 'no-store' });
        const text = await res.text();
        let json: any;
        try {
          json = JSON.parse(text);
        } catch {
          throw new Error(`Unexpected token: not JSON -> ${text.slice(0, 120)}`);
        }
        if (!res.ok || json.error) {
          throw new Error(json.error || `HTTP ${res.status}`);
        }
        if (mounted) setPosts(json.data);
      } catch (e: any) {
        mounted && setErr(e.message || 'Instagramの取得に失敗しました');
      } finally {
        mounted && setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [limit]);

  if (loading) {
    return <div className="rounded-2xl bg-white p-6 shadow-sm">読み込み中…</div>;
  }
  if (err) {
    return (
      <div className="rounded-2xl bg-white p-6 shadow-sm text-red-600">
        Instagramの読み込みでエラー: {err}
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-emerald-900">Instagram 最新投稿</h3>
        <span className="text-sm text-emerald-700/70">自動更新</span>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {posts.map((p) => {
          const img = p.media_url || p.thumbnail_url; // どちらかが入る設計
          return (
            <a
              key={p.id}
              href={p.permalink}
              target="_blank"
              rel="noreferrer"
              className="group block rounded-2xl border border-emerald-100 bg-emerald-50/40 p-3 transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="relative overflow-hidden rounded-xl bg-emerald-50">
                {img ? (
                  <img
                    src={img}
                    alt={p.caption || 'Instagram投稿'}
                    className="aspect-[1/1] w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                    loading="lazy"
                  />
                ) : (
                  <div className="aspect-[1/1] w-full grid place-items-center text-emerald-700/60">画像なし</div>
                )}
              </div>
              <div className="mt-3 line-clamp-2 text-sm text-emerald-900/80">
                {p.caption?.replace(/\s+/g, ' ').trim() || '（キャプションなし）'}
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
