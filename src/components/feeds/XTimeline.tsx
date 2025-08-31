// src/components/feeds/XTimeline.tsx
import { useEffect, useRef } from "react";

declare global {
  interface Window { twttr?: any }
}

export default function XTimeline({
  username,
  limit = 5,
}: {
  username: string; // @付き/無しどちらでもOK
  limit?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const load = async () => {
      if (!window.twttr) {
        await new Promise<void>((resolve) => {
          const s = document.createElement("script");
          s.src = "https://platform.twitter.com/widgets.js";
          s.async = true;
          s.onload = () => resolve();
          document.body.appendChild(s);
        });
      }
      const screenName = username.replace(/^@/, "");
      if (ref.current && window.twttr?.widgets?.createTimeline) {
        ref.current.innerHTML = "";
        window.twttr.widgets.createTimeline(
          { sourceType: "profile", screenName },
          ref.current,
          { tweetLimit: limit, chrome: "noheader nofooter", theme: "light" }
        );
      }
    };
    load();
  }, [username, limit]);

  return <div ref={ref} />;
}
