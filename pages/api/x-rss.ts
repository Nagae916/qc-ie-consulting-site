// pages/api/x-rss.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import Parser from 'rss-parser';

type TweetItem = { title: string; link: string; pubDate: string | null };

// --- 設定（環境変数で上書き可） ---
const ENV_NITTER = (process.env.NITTER_ORIGINS || '')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

const NITTER_ORIGINS = [
  ...ENV_NITTER,
  'https://nitter.net',
  'https://nitter.privacydev.net',
  'https://nitter.poast.org',
  'https://nitter.lacontrevoie.fr',
];

const RSSHUB_MIRRORS = [
  'https://rsshub.app',
  'https://rsshub.moeyy.cn',
];

const TWITRSS = 'https://twitrss.me/twitter_user_to_rss';

// --- 共通ユーティリティ ---
const parser = new Parser({
  headers: { 'User-Agent': 'qc-ie-labo/1.0 (+https://example.com)' },
});

function mapItems(arr: any[]): TweetItem[] {
  return arr
    .map((it: any) => ({
      title: String(it.title || '').replace(/\s+/g, ' ').trim(),
      link: String(it.link || '').trim(),
      pubDate: it.isoDate
        ? new Date(it.isoDate).toISOString()
        : it.pubDate
        ? new Date(it.pubDate).toISOString()
        : null,
    }))
    .filter((x: TweetItem) => x.title && x.link);
}

function dedupe(items: TweetItem[]): TweetItem[] {
  const seen = new Set<string>();
  const out: TweetItem[] = [];
  for (const it of items) {
    const key = it.link || `t:${it.title}`;
    if (!seen.has(key)) {
      seen.add(key);
      out.push(it);
    }
  }
  return out;
}

async function fetchWithTimeout(url: string, ms = 8000, init?: RequestInit) {
  const ac = new AbortController();
  const t = setTimeout(() => ac.abort(), ms);
  try {
    return await fetch(url, { ...init, signal: ac.signal, cache: 'no-store' });
  } finally {
    clearTimeout(t);
  }
}

async function parseRss(url: string) {
  const feed = await parser.parseURL(url);
  return feed.items || [];
}

// --- ① Nitter RSS（複数ミラー） ---
async function tryNitterRss(user: string, limit: number): Promise<TweetItem[] | null> {
  for (const origin of NITTER_ORIGINS) {
    try {
      const url = `${origin}/${encodeURIComponent(user)}/rss`;
      const items = mapItems(await parseRss(url));
      if (items.length) return items.slice(0, limit);
    } catch {
      // 次のミラーへ
    }
  }
  return null;
}

// --- ② TwitRSS ---
async function tryTwitRss(user: string, limit: number): Promise<TweetItem[] | null> {
  try {
    const url = `${TWITRSS}/?user=${encodeURIComponent(user)}`;
    const items = mapItems(await parseRss(url));
    return items.slice(0, limit);
  } catch {
    return null;
  }
}

// --- ③ RSSHub（複数ミラー） ---
async function tryRssHub(user: string, limit: number): Promise<TweetItem[] | null> {
  for (const base of RSSHUB_MIRRORS) {
    try {
      const url = `${base}/twitter/user/${encodeURIComponent(user)}`;
      const items = mapItems(await parseRss(url));
      if (items.length) return items.slice(0, limit);
    } catch {
      // 次のミラーへ
    }
  }
  return null;
}

// --- ④ Nitter HTML直読み（最低限のパースでstatusリンク＆本文） ---
function stripHtml(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div|li)>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

async function tryNitterHtml(user: string, limit: number): Promise<TweetItem[] | null> {
  for (const origin of NITTER_ORIGINS) {
    try {
      const url = `${origin}/${encodeURIComponent(user)}`;
      const r = await fetchWithTimeout(url, 8000, {
        headers: { 'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Safari/537.36' },
      });
      if (!r.ok) continue;
      const html = await r.text();

      // 各 tweet ブロックから本文と status リンクを粗く抜き出す
      const out: TweetItem[] = [];
      const re = /<a\s+href="\/([^/"]+)\/status\/(\d+)[^"]*".*?<\/a>[\s\S]*?class="tweet-content[^"]*">([\s\S]*?)<\/div>/gi;
      let m: RegExpExecArray | null;
      const seen = new Set<string>();
      while ((m = re.exec(html)) && out.length < limit) {
        const screenName = m[1];
        const statusId = m[2];
        const raw = m[3];
        const link = `https://twitter.com/${screenName}/status/${statusId}`;
        if (seen.has(link)) continue;
        seen.add(link);
        const title = stripHtml(raw).replace(/\s+/g, ' ').slice(0, 140);
        if (title) out.push({ title, link, pubDate: null });
      }
      if (out.length) return out;
    } catch {
      // 次のミラーへ
    }
  }
  return null;
}

// --- ⑤ r.jina.ai 経由のプレーンテキストを簡易パース ---
async function tryJinaProxy(user: string, limit: number): Promise<TweetItem[] | null> {
  for (const origin of NITTER_ORIGINS) {
    try {
      const url = `https://r.jina.ai/http://${origin.replace(/^https?:\/\//, '')}/${encodeURIComponent(user)}`;
      const r = await fetchWithTimeout(url, 8000);
      if (!r.ok) continue;
      const txt = await r.text();
      // status リンク行を拾う
      const lines = txt.split('\n').filter(l => l.includes('/status/'));
      const out: TweetItem[] = [];
      const seen = new Set<string>();
      for (const line of lines) {
        const m = line.match(/https?:\/\/(?:mobile\.)?twitter\.com\/[^/\s]+\/status\/\d+/) ||
                  line.match(/https?:\/\/(?:www\.)?nitter\.net\/[^/\s]+\/status\/\d+/);
        if (!m) continue;
        let link = m[0];
        // nitter のままなら twitter 本家URLに変換
        link = link.replace(/https?:\/\/(?:www\.)?nitter\.net/, 'https://twitter.com');
        if (seen.has(link)) continue;
        seen.add(link);
        const title = line.replace(/\s+/g, ' ').trim().slice(0, 140);
        out.push({ title, link, pubDate: null });
        if (out.length >= limit) break;
      }
      if (out.length) return out;
    } catch {
      // 次のミラーへ
    }
  }
  return null;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TweetItem[]>
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json([]);
  }

  try {
    const userRaw = Array.isArray(req.query.user) ? req.query.user[0] : req.query.user;
    const limitRaw = Array.isArray(req.query.limit) ? req.query.limit[0] : req.query.limit;
    const user = String(userRaw ?? '').replace(/^@/, '').trim();
    const limit = Math.max(1, Math.min(50, Number(limitRaw) || 3));

    if (!user) {
      res.setHeader('Cache-Control', 'no-store');
      return res.status(200).json([]);
    }

    let items: TweetItem[] | null = null;

    items = items ?? (await tryNitterRss(user, limit));
    items = items ?? (await tryTwitRss(user, limit));
    items = items ?? (await tryRssHub(user, limit));
    items = items ?? (await tryNitterHtml(user, limit));
    items = items ?? (await tryJinaProxy(user, limit));

    // 万一すべて失敗した場合でも「空白」を避ける
    if (!items || items.length === 0) {
      const profile = `https://twitter.com/${user}`;
      items = [
        { title: `${user} の投稿を見る`, link: profile, pubDate: null },
        { title: `${user} のプロフィール`, link: profile, pubDate: null },
        { title: `${user} の最新ポスト`, link: profile, pubDate: null },
      ];
      res.setHeader('Cache-Control', 'no-store');
      return res.status(200).json(items);
    }

    items = dedupe(items).slice(0, limit);
    res.setHeader('Cache-Control', 's-maxage=1800, stale-while-revalidate=3600');
    return res.status(200).json(items);
  } catch {
    res.setHeader('Cache-Control', 'no-store');
    // 最後の砦：プロフィール3件で空白回避
    const userRaw = Array.isArray(req.query.user) ? req.query.user[0] : req.query.user;
    const user = String(userRaw ?? '').replace(/^@/, '').trim();
    const profile = user ? `https://twitter.com/${user}` : 'https://twitter.com';
    return res.status(200).json([
      { title: `${user || 'X'} の投稿を見る`, link: profile, pubDate: null },
      { title: `${user || 'X'} のプロフィール`, link: profile, pubDate: null },
      { title: `${user || 'X'} の最新ポスト`, link: profile, pubDate: null },
    ]);
  }
}
