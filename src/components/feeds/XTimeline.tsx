// src/components/feeds/XTimeline.tsx
import { useEffect, useRef } from 'react';

declare global {
  interface Window { twttr?: any }
}

type ChromeOption = 'noheader' | 'nofooter' | 'noborders' | 'transparent' | 'noscrollbar';

type Props = {
  username: string;                // '@' あり/なしOK
  limit?: number;                  // 最新N件
  height?: number | string;        // 例: 600 or '600'
  width?: number | string;
  theme?: 'light' | 'dark';
  chrome?: ChromeOption[] | string; // 例: ['noheader','nofooter']
  className?: string;
};

export default function XTimeline({
  username,
  limit = 5,
  height,
  width,
  theme = 'light',
  chrome,
  className,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;

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

    const render = async () => {
      await ensureWidgets();
      if (cancelled || !ref.current || !window.twttr?.widgets?.createTimeline) return;

      const screenName = username.replace(/^@/, '');
      ref.current.innerHTML = '';

      const chromeOpt = Array.isArray(chrome) ? chrome.join(' ') : chrome;
      const opts: any = { tweetLimit: limit, theme };
      if (height != null) opts.height = height;
      if (width != null) opts.width = width;
      if (chromeOpt) opts.chrome = chromeOpt;

      window.twttr.widgets.createTimeline(
        { sourceType: 'profile', screenName },
        ref.current,
        opts
      );
    };

    render();
    return () => { cancelled = true; };
  }, [username, limit, height, width, theme, Array.isArray(chrome) ? chrome.join(' ') : chrome]);

  return <div ref={ref} className={className} />;
}
