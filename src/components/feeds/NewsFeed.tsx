// src/components/feeds/NoteFeed.tsx
import { useCallback, useEffect, useMemo, useState } from "react";

type NoteItem = {
  id?: string | number;
  title: string;
  link?: string;
  source?: string;
  createdAt?: string | null; // ISO 文字列推奨
};

type RawNote = any;

function toArray<T = unknown>(v: unknown): T[] {
  if (Array.isArray(v)) return v as T[];
  if (v && typeof v === "object" && Array.isArray((v as any).items)) {
    return (v as any).items as T[];
  }
  return [];
}

function hostOf(url?: string) {
  if (!url) return "";
  try {
    const h = new URL(url).hostname;
    return h.startsWith("www.") ? h.slice(4) : h;
  } catch {
    return "";
  }
}

function sanitize(raw: RawNote): NoteItem | null {
  const title = typeof raw?.title === "string" ? raw.title : "";
  if (!title) return null;

  const link =
    (typeof raw?.link === "string" && raw.link) ||
    (typeof raw?.url === "string" && raw.url) ||
    undefined;

  const source =
    (typeof raw?.source === "string" && raw.source) ||
    (typeof raw?.author === "string" && raw.author) ||
    undefined;

  let createdAt: string | null = null;
  const dt = raw?.createdAt ?? raw?.date ?? raw?.pubDate ?? null;
  if (typeof dt === "string") {
    const d = new Date(dt);
    if (!Number.isNaN(d.getTime())) createdAt = d.toISOString();
  }

  return { id: raw?.id ?? link ?? title, title, link, source, createdAt };
}

export default function NoteFeed({
  limit = 10,
  variant = "list",
}: {
  limit?: number;
  variant?: "card" | "list";
}) {
  const [items, setItems] = useState<NoteItem[]>([]);
  const [loading, setLoading] = useState(true);

  // 依存が静的に追跡できるように、リクエストURLをメモ化
  const requestUrl = useMemo(
    () => `/api/notes?limit=${encodeURIComponent(limit)}&_=${Date.now()}`,
    [limit]
  );

  // fetchNotes を useCallback 化し、effect から参照
  const fetchNotes = useCallback(
    async (signal?: AbortSignal) => {
      setLoading(true);
      try {
        const r = await fetch(requestUrl, { cache: "no-store", signal });
        if (!r.ok) {
          setItems([]);
          return;
        }
        const data = await r.json().catch(() => []);
        const list = toArray<RawNote>(data)
          .map(sanitize)
          .filter((x): x is NoteItem => !!x)
          .slice(0, limit);
        setItems(list);
      } catch (e) {
        // fetch 中断は例外として飛ぶので握りつぶしでOK
        setItems([]);
      } finally {
        setLoading(false);
      }
    },
    [limit, requestUrl]
  );

  useEffect(() => {
    const ac = new AbortController();
    fetchNotes(ac.signal);
    return () => ac.abort();
  }, [fetchNotes]);

  const Header = (
    <div className="px-5 py-4 border-b border-brand-200 bg-brand-100/60 rounded-t-xl2">
      <h3 className="font-semibold text-brand-900">ノート</h3>
      <p className="text-xs text-gray-600 mt-1">最新のノートを表示します</p>
    </div>
  );

  if (loading) {
    return (
      <div className="rounded-xl2 bg-white shadow-soft border border-brand-200">
        {Header}
        <div className="p-6 text-gray-600">読み込み中...</div>
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="rounded-xl2 bg-white shadow-soft border border-brand-200">
        {Header}
        <div className="p-6 text-gray-600">現在表示できるノートはありません。</div>
      </div>
    );
  }

  if (variant === "card") {
    return (
      <div className="rounded-xl2 bg-white shadow-soft border border-brand-200">
        {Header}
        <div className="p-4 grid grid-cols-1 gap-3">
          {items.map((it, idx) => (
            <a
              key={(it.id as string) ?? it.link ?? `${it.title}-${idx}`}
              href={it.link ?? "#"}
              target={it.link ? "_blank" : undefined}
              rel={it.link ? "noopener noreferrer" : undefined}
              className="block rounded-xl border border-black/10 bg-white p-4 shadow-sm hover:shadow-md transition"
            >
              <p className="font-medium text-gray-900 line-clamp-2">{it.title}</p>
              <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                <span>{it.source || hostOf(it.link)}</span>
                <span>
                  {it.createdAt
                    ? new Date(it.createdAt).toLocaleString("ja-JP", { hour12: false })
                    : ""}
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    );
  }

  // list
  return (
    <div className="rounded-xl2 bg-white shadow-soft border border-brand-200">
      {Header}
      <ul className="divide-y divide-brand-200">
        {items.map((it, idx) => (
          <li
            key={(it.id as string) ?? it.link ?? `${it.title}-${idx}`}
            className="p-4 hover:bg-brand-50/60 transition"
          >
            <a
              href={it.link ?? "#"}
              target={it.link ? "_blank" : undefined}
              rel={it.link ? "noopener noreferrer" : undefined}
              className="block"
            >
              <p className="font-medium text-brand-900">{it.title}</p>
              <p className="text-xs text-gray-500 mt-1">
                {it.source || hostOf(it.link)}
                {it.createdAt
                  ? ` ・ ${new Date(it.createdAt).toLocaleString("ja-JP", { hour12: false })}`
                  : ""}
              </p>
            </a>
          </li>
        ))}
      </ul>
