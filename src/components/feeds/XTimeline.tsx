// src/components/feeds/XTimeline.tsx
'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { feedApiPath } from '../../lib/routes';

type ChromeOption = 'noheader' | 'nofooter' | 'noborders' | 'transparent' | 'noscrollbar';
type FallbackItem = { title: string; link: string; pubDate: string | null };

type Props = {
  username: string;                       // '@' あり/なし OK
  limit?: number;                         // 既定 5
  height?: number | string;
  width?: number | string;
  theme?: 'light' | 'dark';
  chrome?: ChromeOption[] | string;
  className?: string;
  minHeight?: number;                     // 既定 600
  /** 表示モード：auto=まずwidget,失敗時fallback / widget=常にウィジェット / fallback=常に軽量表示 */
  mode?: 'auto' | 'widget' | 'fallback';
  /** SSR/ISRから渡す軽量リスト（あればフォールバック時に即表示） */
  items?: FallbackItem[];
  /** 任意：デバッグログ */
  debug?: boolean;
};

export default function XTimeline({
  username,
  limit = 5,
  height,
  width,
  theme = 'light',
  chrome,
  className,
  minHeight = 600,
  mode,
  items,
  debug = false,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  // SSRの items があれば初期値に採用（フォールバック即表示）
  const [fallback, setFallback] = useState<FallbackItem[] | null>(items ?? null);
  const [nonce, setNonce] = useState(0); // 再試行用

  const envMode = (process.env.NEXT_PUBLIC_X_EMBED_MODE as 'auto' | 'widget' | 'fallback' | undefined) ?? undefined;
  const effectiveMode: 'auto' | 'widget' | 'fallback' = mode ?? envMode ?? 'auto';

  // 依存を安定化
  const chromeKey = useMemo(() => (Array.isArray(chrome) ? chrome.join(' ') : chrome) ?? '', [chrome]);
  const screenName = useMemo(() => username.replace(/^@/, ''), [username]);
  const profileUrl = useMemo(() => `https://x.com/${screenName}`, [screenName]);

  const log = useCallback((...a: any[]) => { if (debug) console.log('[XTimeline]', ...a); }, [debug]);

  // フォールバックをAPIから取得
  const loadFallback = useCallback(async () => {
    try {
      // SSRから渡された items があればそれを優先して表示
      if (items && items.length) {
        setFallback(items.slice(0, limit));
        log('use SSR items as fallback:', items.length);
        return;
      }
      const url = feedApiPath('x', limit);
      const r = await fetch(url);
      if (!r.ok) throw new Error('fallback fetch failed');
      const data: any[] = await r.json().catch(() => []);
      const mapped: FallbackItem[] = (Array.isArray(data) ? data : [])
        .map((it) => ({
          title: String(it?.title || ''),
          link: String(it?.link || ''),
          pubDate:
            typeof it?.pubDate === 'string'
              ? it.pubDate
              : typeof (it as any)?.isoDate === 'string'
              ? (it as any).isoDate
              : null,
        }))
        .filter((x) => x.title && x.link)
        .slice(0, limit);
      setFallback(mapped);
      log('fallback items:', mapped.length);
    } catch (e) {
      setFallback([]);
      log('fallback failed', e);
    }
  }, [items, limit, log]);

  useEffect(() => {
    let cancelled = false;
    let timer: number | undefined;

    // 常に軽量表示
    if (effectiveMode === 'fallback') {
      log('mode=fallback → always fallback');
      loadFallback();
      return () => { /* noop */ };
    }

    const ensureWidgets = async () => {
      const src = 'https://platform.twitter.com/widgets.js';
      const twttr = (window as any).twttr;
      if (twttr?.widgets?.createTimeline) return;

      await new Promise<void>((resolve) => {
        const existing = document.querySelector(`script[src="${src}"]`) as HTMLScriptElement | null;
        if (existing) {
          if ((window as any).twttr) resolve();
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
      try {
        await ensureWidgets();

        // auto のときは4秒でタイムアウト → フォールバック
        if (effectiveMode === 'auto') {
          timer = window.setTimeout(() => {
            if (!cancelled) {
              log('widget timeout → fallback');
              loadFallback();
            }
          }, 4000);
        }

        const twttr = (window as any).twttr;
        if (cancelled || !ref.current || !twttr?.widgets?.createTimeline) return;

        ref.current.innerHTML = '';

        const opts: any = { tweetLimit: limit, theme };
        if (height != null) opts.height = height;
        if (width != null) opts.width = width;
        if (chromeKey) opts.chrome = chromeKey;

        log('createTimeline', { mode: effectiveMode, opts });
        await twttr.widgets.createTimeline({ sourceType: 'profile', screenName }, ref.current, opts);

        if (!cancelled) {
          if (timer) clearTimeout(timer);
          setFallback(null); // ウィジェット表示に切替
          log('widget rendered');
        }
      } catch (e) {
        log('widget error', e);
        if (!cancelled) {
          if (timer) clearTimeout(timer);
          if (effectiveMode === 'auto') loadFallback();
        }
      }
    };

    renderWidget();
    return () => { cancelled = true; if (timer) clearTimeout(timer); };
  }, [screenName, limit, height, width, theme, chromeKey, effectiveMode, nonce, loadFallback, log]);

  // フォールバック表示
  if (fallback) {
    return (
      <div className={className} style={{ minHeight }}>
        {fallback.length === 0 ? (
          <div className="text-sm text-gray-600 p-3">
            <p>Xの埋め込みが利用できない環境のため、軽量表示に切り替えています。</p>
            <div className="mt-2 flex items-center gap-3">
              <a href={profileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-700 underline">
                プロフィールを開く
              </a>
              <button
                type="button"
                onClick={() => setNonce((v) => v + 1)}
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
                      {new Date(t.pubDate).toLocaleString('ja-JP', { hour12: false })}
                    </span>
                  )}
                </li>
              ))}
            </ul>
            <div className="mt-3">
              <a href={profileUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-700 underline">
                もっと見る（Xで開く）
              </a>
            </div>
          </div>
        )}
      </div>
    );
  }

  // 公式ウィジェット表示
  return <div ref={ref} className={className} style={{ minHeight }} />;
}
