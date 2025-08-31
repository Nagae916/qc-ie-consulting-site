// pages/api/instagram.ts
import type { NextApiRequest, NextApiResponse } from "next";

type IgItem = {
  id: string;
  caption?: string;
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  media_url: string;
  permalink: string;
  thumbnail_url?: string;
  timestamp: string;
};

type IgGraphError = {
  error?: { message: string; type?: string; code?: number; fbtrace_id?: string };
};

type IgResponse = { data?: IgItem[] } & IgGraphError;

// 返却を items に統一（既存のフロント互換）
type ApiOk = { items: IgItem[] };

const IG_FIELDS =
  "id,caption,media_type,media_url,permalink,thumbnail_url,timestamp";

// --- env を軽くバリデーション（出戻り防止） ---
function readEnv() {
  const userId = (process.env.IG_USER_ID || "").trim();
  const token = (process.env.IG_ACCESS_TOKEN || "").trim();
  const limitEnv = Number(process.env.IG_LIMIT ?? 3);
  const limit =
    Number.isFinite(limitEnv) && limitEnv > 0 && limitEnv <= 12 ? limitEnv : 3;

  const errors: string[] = [];
  if (!userId) errors.push("環境変数 IG_USER_ID が未設定です。");
  if (!token) errors.push("環境変数 IG_ACCESS_TOKEN が未設定です。");
  if (userId && !/^\d{5,}$/.test(userId))
    errors.push("IG_USER_ID は数値ID（例: 1784…）を設定してください。");
  if (token && token.length < 50)
    errors.push("IG_ACCESS_TOKEN が短すぎます（長期トークンを設定してください）。");

  return { userId, token, limit, errors };
}

// --- fetch にタイムアウト（運用で固まらないように） ---
async function fetchWithTimeout(url: string, ms = 8000) {
  const c = new AbortController();
  const t = setTimeout(() => c.abort(), ms);
  try {
    return await fetch(url, { signal: c.signal, cache: "no-store" });
  } finally {
    clearTimeout(t);
  }
}

// --- Graph API のエラー本文を人間可読に ---
function extractGraphError(raw: string): string {
  try {
    const j = JSON.parse(raw) as IgGraphError;
    const e = j?.error;
    if (!e) return raw;
    // code:190 が OAuth token 無効/期限切れ
    const hint =
      e.code === 190 ? "（アクセストークンの期限切れ/無効の可能性）" : "";
    return `Instagram API error: code=${e.code ?? "?"} type=${
      e.type ?? "?"
    } ${e.message}${hint}`;
  } catch {
    return raw;
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiOk>
) {
  const { userId, token, limit, errors } = readEnv();

  // フロントを落とさない：常に 200 / 空配列、詳細はヘッダに
  const safeEnd = (statusHint: string, message?: string) => {
    if (message) res.setHeader("X-IG-Error", message);
    // 10分 CDN キャッシュ（成功/失敗問わず頻繁に叩かない）
    res.setHeader("Cache-Control", "s-maxage=600, stale-while-revalidate=600");
    return res.status(200).json({ items: [] });
  };

  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return safeEnd("405", "Method Not Allowed");
  }

  if (errors.length) {
    return safeEnd("500", errors.join(" "));
  }

  try {
    const qLimitRaw = Array.isArray(req.query.limit)
      ? req.query.limit[0]
      : req.query.limit;
    const qLimitNum = Number(qLimitRaw);
    const finalLimit =
      Number.isFinite(qLimitNum) && qLimitNum > 0 && qLimitNum <= 12
        ? qLimitNum
        : limit;

    const url = new URL(`https://graph.instagram.com/${userId}/media`);
    url.searchParams.set("fields", IG_FIELDS);
    url.searchParams.set("access_token", token);
    url.searchParams.set("limit", String(finalLimit));

    const r = await fetchWithTimeout(url.toString(), 8000);
    const raw = await r.text();

    if (!r.ok) {
      return safeEnd(String(r.status), extractGraphError(raw));
    }

    const json = JSON.parse(raw) as IgResponse;
    const items = (json.data ?? [])
      .filter((m) => m && m.media_url && m.permalink)
      .slice(0, finalLimit)
      .map((m) => ({
        id: String(m.id),
        caption: m.caption ?? "",
        media_type: m.media_type,
        media_url: m.media_url,
        thumbnail_url: m.thumbnail_url ?? m.media_url,
        permalink: m.permalink,
        timestamp: m.timestamp,
      }));

    // 成功時もキャッシュは10分
    res.setHeader("Cache-Control", "s-maxage=600, stale-while-revalidate=600");
    return res.status(200).json({ items });
  } catch (e: any) {
    return safeEnd("502", `Instagram fetch failed: ${e?.message ?? String(e)}`);
  }
}
