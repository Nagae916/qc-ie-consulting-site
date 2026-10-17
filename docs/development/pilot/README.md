# 2026-10-09 試行準備

実装状態の確認と、記録・集計の準備のみ。実モデル比較、Jev判定、費用削減の実測はまだ0件。

## 確認した状態

- local HEAD: `8e2bb67129d4583c1c04058ded8a8d1504d7874e`（この準備の追加前）。
- remote main: `98f9d024052a104c6cec98ad722d8581857faaba`。Gitの読取とGitHub連携のbranch検索の双方で `feat/jev-development-tooling` は見つからない。
- Codex CLI 0.155.0: 認証済み。Jev/AI Gatewayのcredentialは未設定。hookは定義あり、信頼・発火は未確認。
- アカウントのmodel cacheに `gpt-6-luna` と `gpt-6-sol` が存在。ただしlive model access試験ではない。`gpt-6.1-sol`も載るが、依頼されたSolを勝手に置き換えない。
- AGENTS.mdと2026-09-26保存版はSHA-256 `68beb4f8c3be912b1e47da554238f68be309e2442aff620282b99f62feeecca3`で一致。今回はAGENTS.mdを変更しない。

公式確認元（2026-10-09閲覧）:
- https://learn.chatgpt.com/docs/models
- https://developers.openai.com/api/docs/models/gpt-6-sol
- https://developers.openai.com/api/docs/models/gpt-6-luna

## 手動試行

`task-runs.csv` は見出しだけのテンプレート。次の実タスクから10〜20件を記録する。通常作業はLuna、設計・安全性・同じ失敗が繰り返す場合はSolを候補とし、実際のmodelと切替理由を残す。従来方式の同種タスクと比較し、条件、コード、AGENTS hashを揃える。切替・AGENTS・Retentionを同時に変えない。

statusは予定/進行/完了/失敗/未実施を区別。空欄は欠測、0は測定したゼロ、cost_basisは実課金/推定/未取得。Plusの利用へAPI単価を当てて実課金と呼ばない。prompt・secret・transcript本文をこの表へ記録しない。

実在する次の候補は `CODEX_IMPLEMENTATION_BRIEF.md` の不足項目: GitHub引渡し、credentialとsmoke、hookの実発火、Routerモデル対応、Windows起動、AGENTS保存コマンド、復元検証、実タスク記録、判定応答の検証、fallback adapter、独立正解の検証課題、ダッシュボード計測表示。候補を実行済みと数えず、依頼された実作業を開始するときにtask IDを付ける。

## Jev二段階評価の準備

`assessments.json` は空の配列。実際に取得した判定だけを追加する。各要素はcaseId（重複不可）、split（selection/heldout）、domain（prose/math/code/security）、独立したgold（boolean）、jevとupperを持つ。未実行のjudgeはnull。judgeはvalid（boolean）、verdict（有効ならboolean）、costUsd（比較可能な評価料金またはnull）を持ち、jevは判定へのconfidenceを持つ。欠陥の確率をconfidenceへ転用しない。model、採点根拠、費用の算定条件は別のrun記録に保存する。

同じ評価課題で上位モデル単独、Jev単独、二段階評価を比較する。閾値はselectionで選び、heldoutを見る前に固定する。pairwise課題は順序反転した判定を同じ意味へ揃えてから記録する。現時点の10〜20タスクは予備試行であり統計的な優位性の証明ではない。

```sh
node scripts/jev/pilot-analysis.mjs docs/development/pilot/assessments.json <検証した閾値>
npm run jev:test
```

集計はoffline replayで、逐次fallbackの実待ち時間やAPI到達性を測らない。selectionは性能集計へ含めず、未実行はskipし、無効応答は誤答扱い。費用不明は0円にしない。テスト内の架空判定は集計ロジックの検査用で、モデル評価の成果に含めない。

開始条件: 実装の対象環境への取得、必要なモデルのlive利用確認、Jev credentialと既存の費用範囲の確認、hook承認。credentialがない間も手動の開発モデル比較は開始可能。Productionや新規課金設定の変更をこの試行へ混ぜない。
