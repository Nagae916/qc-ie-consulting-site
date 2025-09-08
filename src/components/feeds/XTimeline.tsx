// src/components/feeds/XTimeline.tsx
import { useEffect, useRef, useState } from "react";
import { feedApiPath } from "@/lib/routes";

declare global {
  interface Window {
    twttr?: any;
  }
}

type ChromeOption = "noheader" | "nofooter" | "noborders" | "transparent" | "noscrollbar";
type FallbackItem = { title: string; link: string; pubDate: string | null };

type Props = {
  username: string; // '@' あり/なしOK（公式ウィジェットに使用）
  limit?: number; // 既定 5
  height?: number | string;
  width?: number | string;
  theme?: "light" | "dark";
  chrome?: ChromeOption[] | string;
  className?: string;
  minHeight?: number; // 既定 600（見た目安定）
  /** 表示モード：auto=まずwidget,失敗時fallback / widget=常にウィジェット / fallback=常に軽量表示 */
  mode?: "auto" | "widget" | "fallback"; // ← 未指定なら環境変数NEXT_PUBLIC_X_EMBED_MODE→autoの順で適用
  /** 任意：デバッグログ */
  debug?: boolean;
};

export default function XTimeline({
  username,
  limit = 5,
  height,
  width,
  theme = "light",
  chrome,
  className,
  minHeight = 600,
  mode, // デフォルト値はenv優先で後段計算
  debug = false,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [fallback, setFallback] = useState<FallbackItem[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [nonce, setNonce] = useState(0); // 再試行用

  const envMode = (process.env.NEXT_PUBLIC_X_EMBED_MODE as "auto" | "widget" | "fallback" | undefined) ?? undefined;
  const effectiveMode: "auto" | "widget" | "fallback" = mode ?? envMode ?? "auto";

  const log = (...a: any[]) => {
    if (debug) console.log("[XTimeline]", ...a);
  };

  const loadFallback = async () => {
    try {
      // ▼ 集約APIを使用（.env の X_RSS_URL を参照）
      const url = feedApiPath("x", limit);
      const r = await fetch(url); // CDNキャッシュを活かす（no-store禁止、timestampなし）
      if (!r.ok) throw new Error("fallback fetch failed");
      const data: any[] = await r.json().catch(() => []);
      const items: FallbackItem[] = (Array.isArray(data) ? data : [])
        .map((it) => ({
          title: String(it.title || ""),
          link: String(it.link || ""),
          pubDate:
            typeof it.pubDate === "string"
              ? new Date(it.pubDate).toISOString()
              : typeof it.isoDate === "string"
              ? new Date(it.isoDate).toISOString()
              : null,
        }))
        .filter((x) => x.title && x.link)
        .slice(0, limit);
      setFallback(items);
      log("fallback items:", items.length);
    } catch (e) {
      setFallback([]);
      log("fallback failed", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    let timer: number | undefined;

    // 常に軽量表示
    if (effectiveMode === "fallback") {
      log("mode=fallback → always fallback");
      loadFallback();
      return;
    }

    // ウィジェット読み込み
    const ensureWidgets = async () => {
      const src = "https://platform.twitter.com/widgets.js";
      if (window.twttr?.widgets?.createTimeline) return;
      await new Promise<void>((resolve) => {
        const existing = document.querySelector(`script[src="${src}"]`) as HTMLScriptElement | null;
        if (existing) {
          if (window.twttr) resolve();
          else existing.addEventListener("load", () => resolve());
          return;
        }
        const s = document.createElement("script");
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

        // auto のときは4秒でタイムアウト → フォールバック
        if (effectiveMode === "auto") {
          timer = window.setTimeout(() => {
            if (!cancelled && loading) {
              log("widget timeout → fallback");
              loadFallback();
            }
          }, 4000);
        }

        if (cancelled || !ref.current || !window.twttr?.widgets?.createTimeline) return;

        const screenName = username.replace(/^@/, "");
        ref.current.innerHTML = "";

        const chromeOpt = Array.isArray(chrome) ? chrome.join(" ") : chrome;
        const opts: any = { tweetLimit: limit, theme };
        if (height != null) opts.height = height;
        if (width != null) opts.width = width;
        if (chromeOpt) opts.chrome = chromeOpt;

        log("createTimeline", { mode: effectiveMode, opts });
        await window.twttr.widgets.createTimeline({ sourceType: "profile", screenName }, ref.current, opts);

        if (!cancelled) {
          if (timer) clearTimeout(timer);
          setLoading(false);
          setFallback(null);
          log("widget rendered");
        }
      } catch (e) {
        log("widget error", e);
        if (effectiveMode === "auto") {
          if (!cancelled) {
            if (timer) clearTimeout(timer);
            loadFallback();
          }
        } else {
          setLoading(false); // mode=widget の場合は何もしない
        }
      }
    };

    renderWidget();
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    username,
    limit,
    height,
    width,
    theme,
    Array.isArray(chrome) ? chrome.join(" ") : chrome,
    effectiveMode,
    nonce,
  ]);

  // フォールバック表示
  if (fallback) {
    const profileUrl = `https://x.com/${username.replace(/^@/, "")}`;
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
                      {new Date(t.pubDate).toLocaleString("ja-JP", { hour12: false })}
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

  // 公式ウィジェット表示領域
  return <div ref={ref} className={className} style={{ minHeight }} />;
}
