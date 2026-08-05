# N-IE Lab

N-IE Labは、品質、生産、データ、改善のつながりを経営工学の視点から読み解く、製造業の実務者向けサイトです。Next.js、TypeScript、Contentlayer2、MDXで構成し、Vercelで静的生成を中心に配信します。

## 必要な環境

- Node.js 18以上、21未満
- npm
- PowerShell

## セットアップ

```powershell
npm.cmd install
npm.cmd run dev
```

開発サーバーは通常 `http://localhost:3000` で起動します。

## 主な確認コマンド

```powershell
npm.cmd run typecheck
npm.cmd run lint
npm.cmd run build
```

追加の検証コマンドは `package.json` の `check:*` と `lint:*` を参照してください。自動テスト用の専用スクリプトは現時点ではありません。

## コンテンツ

- ガイド: `content/guides/{exam}/`
- 公開ページ: `pages/`
- 共通部品: `src/components/`
- サイト設定・表示データ: `src/data/`
- プロジェクト方針: `docs/project/`

MDX本文にimportを書かず、動的なガイド部品は既存のコンポーネントレジストリへ登録します。公開URLの変更や既存記事の削除は、`docs/project/URL_MIGRATION_POLICY.md` と `docs/project/CHANGE_POLICY.md` に従います。

## デプロイ

本番は既存のVercelプロジェクトと `n-ie-qclab.com` を維持します。環境変数の値やAPIキーはリポジトリへ保存せず、必要な場合はVercel側で管理します。
