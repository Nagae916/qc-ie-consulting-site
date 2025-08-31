// src/components/feeds/XTimeline.tsx
import { useEffect, useRef, useState } from 'react';

declare global {
  interface Window { twttr?: any }
}

type ChromeOption = 'noheader' | 'nofooter' | 'noborders' | 'transparent' | 'noscrollbar';

type Props = {
  username: string;                // '@' あり/なしOK
  limit?: number;                  // 既定 5
  height?: number | string;        // 例: 600
  width?: number | string;
  theme?: 'light' | 'dark';
  chrome?: ChromeOption[] | string;
  className?: string;
  fallbackEnabled?: boolean;       // 既定 true
  minHeight?: number;              // 既定 600（見た目安定用）
};

type FallbackItem = { title: string; link: string; pubDate: string | null };

export default function XTimeline({
  username,
  limit = 5,
  height,
  width,
  theme = 'light',
  chrome,
  className,
  fallbackEnabled = true,
  minHeight = 600,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [fallback, setFallback] = useState<FallbackItem[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [nonce, setNonce] = useState(0); // 再試行用

  const loadFallback = async () => {
    try {
      const u = username.replace(/^@/, '');
      const r = await fetch(`/api/x-rss?user=${encodeURIComponent(u)}&limit=${limit}&_=${Date.now()}`, { cache: 'no-store' });
      const data: FallbackItem[] = await r.json();
      setFallback(data);
    } catch {
      setFallback([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    let timer: number | undefined;

    const ensureWidgets = async () => {
      const src = 'https://platform.twitter.com/widgets.js';
      if (window.twttr?.widgets?.createTimeline) return;
      await new Promise<void>((resolve) => {
        const existing = document.querySelector(`script[src="${src}"]`) as HTMLScriptElement | null;
        if (existing) {
          if (window.twttr) resolve();
          else existing.addEventListener('load', () => resolve());
          return;
        }
        const s = document.createElement('script');
        s.src = src;
        s.async = true;
        s.onload = () => resolve();
        document.body.appendChild(s);
      });
    };

    const renderWidget = async () => {
      setLoading(true);
      try {
        await ensureWidgets();

        // タイムアウトでフォールバック
        if (fallbackEnabled) {
          timer = window.setTimeout(() => {
            if (!cancelled && loading) loadFallback();
          }, 4000);
        }

        if (cancelled || !ref.current || !window.twttr?.widgets?.createTimeline) return;

        const screenName = username.replace(/^@/, '');
        ref.current.innerHTML = '';

        const chromeOpt = Array.isArray(chrome) ? chrome.join(' ') : chrome;
        const opts: any = { tweetLimit: limit, theme };
        if (height != null) opts.height = height;
        if (width != null) opts.width = width;
        if (chromeOpt) opts.chrome = chromeOpt;

        await window.twttr.widgets.createTimeline(
          { sourceType: 'profile', screenName },
          ref.current,
          opts
        );

        if (!cancelled) {
          if (timer) clearTimeout(timer);
          setLoading(false);
          setFallback(null);
        }
      } catch {
        if (!cancelled && fallbackEnabled) {
          if (timer) clearTimeout(timer);
          loadFallback();
        } else {
          setLoading(false);
        }
      }
    };

    renderWidget();
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username, limit, height, width, theme, Array.isArray(chrome) ? chrome.join(' ') : chrome, fallbackEnabled, nonce]);

  if (fallback) {
    const profileUrl = `https://twitter.com/${username.replace(/^@/, '')}`;
    return (
      <div className={className} style={{ minHeight }}>
        {fallback.length === 0 ? (
          <div className="text-sm text-gray-600 p-3">
            <p>Xの埋め込みを表示できませんでした（ネットワーク / CSP / ブロッカーの可能性）。</p>
            <div className="mt-2 flex items-center gap-3">
              <a href={profileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-700 underline">
                プロフィールをXで開く
              </a>
              <button
                type="button"
                onClick={() => setNonce(v => v + 1)}
                className="rounded-md border px-2 py-1 text-xs hover:bg-gray-50"
              >
                再試行
              </button>
            </div>
          </div>
        ) : (
          <div className="p-3">
            <ul className="space-y-2">
              {fallback.map((t) => (
                <li key={t.link}>
                  <a href={t.link} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline">
                    {t.title}
                  </a>
                  {t.pubDate && (
                    <span className="ml-2 text-xs text-gray-500">
                      {new Date(t.pubDate).toLocaleString('ja-JP')}
                    </span>
                  )}
                </li>
              ))}
            </ul>
            <div className="mt-3 flex items-center gap-3">
              <a href={profileUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-700 underline">
                もっと見る（Xを開く）
              </a>
              <button
                type="button"
                onClick={() => setNonce(v => v + 1)}
                className="rounded-md border px-2 py-1 text-xs hover:bg-gray-50"
              >
                再試行
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return <div ref={ref} className={className} style={{ minHeight }} />;
}
