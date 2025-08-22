// api/note.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import Parser from 'rss-parser';

type NoteItem = {
  title: string;
  link: string;
  isoDate?: string;
  contentSnippet?: string;
};

type Resp = { data?: NoteItem[]; error?: string };

const parser = new Parser();

// あなたの note RSS。変更したい場合は ?user= クエリで上書き可
const DEFAULT_NOTE_RSS = 'https://note.com/nieqc_0713/rss';

export default async function handler(req: NextApiRequest, res: NextApiResponse<Resp>) {
  try {
    const limit = Number(req.query.limit || 6);
    const user = typeof req.query.user === 'string' ? req.query.user : '';
    const rssUrl = user ? `https://note.com/${encodeURIComponent(user)}/rss` : DEFAULT_NOTE_RSS;

    const feed = await parser.parseURL(rssUrl);

    const items: NoteItem[] = (feed.items || []).slice(0, limit).map((it) => ({
      title: it.title ?? '',
      link: it.link ?? '',
      isoDate: it.isoDate,
      contentSnippet: it.contentSnippet
    }));

    res.setHeader('Cache-Control', 'public, s-maxage=1800, stale-while-revalidate=60'); // 30分キャッシュ
    res.status(200).json({ data: items });
  } catch (e: any) {
    res.status(500).json({ error: e?.message || 'NOTE_FETCH_FAILED' });
  }
}
