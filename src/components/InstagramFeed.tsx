'use client';

import React, { useEffect, useState } from 'react';

type InstaPost = {
  id: string;
  permalink: string;
  media_url?: string;
  media_type?: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  thumbnail_url?: string;
  caption?: string;
  timestamp?: string;
};

const LIMIT = 3;

export default function InstagramFeed() {
  const [posts, setPosts] = useState<InstaPost[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`/api/instagram?limit=${LIMIT}`, { cache: 'no-store' });
        const json = await res.json();

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        // API が配列を返す or { data: [] } を返す どちらでも動くように吸収
        const data: InstaPost[] = Array.isArray(json) ? json : json?.data;
        if (!Array.isArray(data)) throw new Error('Unexpected response shape');

        setPosts(data);
      } catch (e: any) {
        setErr(e?.message || 'Instagramの取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <section className="w-full">
      <div className="mb-4 flex items-baseline justify-between">
        <h3 className="text-xl font-semibold text-emerald-900">
          Instagram 最新投稿
        </h3>
        <span className="text-xs text-emerald-800/60">自動更新</span>
      </div>

      {/* ローディング表示 */}
      {loading && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="rounded-2xl bg-white p-3 shadow-sm ring-1 ring-black/5"
            >
              <div className="h-64 w-full animate-pulse rounded-xl bg-emerald-100/50" />
              <div className="mt-3 h-4 w-3/5 animate-pulse rounded bg-emerald-100/60" />
            </div>
          ))}
        </div>
      )}

      {/* エラー表示 */}
      {!loading && err && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 ring-1 ring-red-200">
          {err}
        </p>
      )}

      {/* 投稿グリッド */}
      {!loading && !err && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => {
            // 動画の場合はサムネイルにフォールバック
            const imageUrl =
              post.media_type === 'VIDEO'
                ? (post.thumbnail_url || post.media_url)
                : post.media_url;

            const caption =
              (post.caption || '').replace(/\s+/g, ' ').trim();

            return (
              <a
                key={post.id}
                href={post.permalink}
                target="_blank"
                rel="noreferrer"
                className="group block rounded-2xl bg-white p-3 shadow-sm ring-1 ring-black/5 transition
                           hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative overflow-hidden rounded-xl">
                  {/* サムネ全面表示 + ホバーでわずかにズーム */}
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt="Instagram thumbnail"
                      className="h-64 w-full transform object-cover transition duration-200
                                 group-hover:scale-[1.03]"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="flex h-64 w-full items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                      画像なし
                    </div>
                  )}
                </div>

                {/* キャプション先頭をうっすら表示（長文はカット） */}
                <div className="mt-3 line-clamp-2 text-sm text-emerald-900/80">
                  {caption || 'キャプションなし'}
                </div>
              </a>
            );
          })}
        </div>
      )}
    </section>
  );
}
