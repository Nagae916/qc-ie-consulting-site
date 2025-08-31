// src/components/feeds/XTimeline.tsx
import { useEffect, useRef, useState } from 'react';

declare global {
  interface Window { twttr?: any }
}

type ChromeOption = 'noheader' | 'nofooter' | 'noborders' | 'transparent' | 'noscrollbar';

type Props = {
  username: string;                // '@' あり/なしOK
  limit?: number;                  // 最新N件（既定 5）
  height?: number | string;        // 例: 600
  width?: number | string;
  theme?: 'light' | 'dark';
  chrome?: ChromeOption[] | string;
  className?: string;
  // フォールバック有効/無効（既定 true）
  fallbackEnabled?: boolean;
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
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [fallback, setFallback] = useState<FallbackItem[] | null>(null);
  const [loading, setLoading] = useState(true);

  // Nitter RSS フォールバック取得
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

        // ここまで来たら埋め込み成功
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
  }, [username, limit, height, width, theme, Array.isArray(chrome) ? chrome.join(' ') : chrome, fallbackEnabled]);

  // フォールバック表示
  if (fallback) {
    return (
      <div className={className}>
        {fallback.length === 0 ? (
          <div className="text-sm text-gray-500 p-3">
            Xの埋め込みを表示できませんでした。ネットワーク/CSP/ブロッカー設定をご確認ください。
          </div>
        ) : (
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
        )}
      </div>
    );
  }

  // 公式ウィジェットが描画される場所
  return <div ref={ref} className={className} />;
}
