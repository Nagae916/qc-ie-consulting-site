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
    .re
