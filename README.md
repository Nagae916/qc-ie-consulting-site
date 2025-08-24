# QC × IE Consulting — Website (React + Vite + Tailwind)

最小構成の React サイトです。Tailwind と `react-helmet` を同梱。

## セットアップ

```bash
# 1) 依存をインストール
npm i

# 2) 開発サーバ
npm run dev

# 3) 本番ビルド
npm run build && npm run preview
```

## デプロイ（例：Vercel）
- リポジトリを GitHub に push → Vercel で Import するだけで公開可
- 独自ドメインは Vercel の Dashboard から追加
- SSL は自動（Let's Encrypt）

## Instagram 最新3件（本番化）
- `/src/App.tsx` の `InstagramFeed` はプレースホルダーです
- Vercel Functions に `/api/instagram.ts` を置き、長期トークンを `IG_BASIC_TOKEN` で設定してください

```ts
// api/instagram.ts（Vercel）
import type { VercelRequest, VercelResponse } from 'vercel';
export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const token = process.env.IG_BASIC_TOKEN!;
    const r = await fetch(`https://graph.instagram.com/me/media?fields=id,media_url,permalink,caption,timestamp&access_token=${token}&limit=3`);
    const data = await r.json();
    if (!r.ok) return res.status(500).json({ error: data });
    res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate=86400');
    return res.status(200).json(data);
  } catch (e:any) {
    return res.status(500).json({ error: e?.message ?? 'unknown error' });
  }
}
```

## 置き換えポイント
- `https://example.com/` や `og-image.jpg`、`logo.png` を実URLに差し替え
- フッター文言、問い合わせ先メールも実運用値に　
