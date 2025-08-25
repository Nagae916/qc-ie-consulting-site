import { useEffect, useRef } from "react";

type Props = {
  username: string;            // 例: "n_ieqclab"
  height?: number;             // 例: 600
  theme?: "light" | "dark";    // 既定: "light"
};

export default function XTimeline({ username, height = 600, theme = "light" }: Props) {
  const anchorRef = useRef<HTMLAnchorElement | null>(null);

  useEffect(() => {
    // widgets.jsを一度だけ読み込み
    const src = "https://platform.twitter.com/widgets.js";
    const exist = document.querySelector<HTMLScriptElement>(`script[src="${src}"]`);
    if (!exist) {
      const s = document.createElement("script");
      s.async = true;
      s.src = src;
      document.body.appendChild(s);
      s.onload = () => (window as any).twttr?.widgets?.load();
    } else {
      (window as any).twttr?.widgets?.load();
    }
  }, []);

  return (
    <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
      <a
        ref={anchorRef}
        className="twitter-timeline"
        data-height={height}
        data-theme={theme}
        href={`https://twitter.com/${username}?ref_src=twsrc%5Etfw`}
      >
        X Timeline @{username}
      </a>
    </div>
  );
}
