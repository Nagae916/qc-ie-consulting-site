# 技術士 経営工学部門 過去問メタデータ カバレッジ

最終更新日: 2026-05-12

## 目的

`public/data/engineer/past-exam-questions.json` の収載範囲を明確にし、過去問トレンド分析、答案骨子作成、キーワード頻度分析の前提データを確認できるようにする。

このデータでは、日本技術士会の公式過去問題 PDF を丸ごと転載せず、年度、科目、選択科目、問題番号、要約、分類タグ、答案フレーム、公式 PDF URL を管理する。

## 対象範囲

- 対象年度: 令和元年度〜令和7年度
- 対象部門: 15 経営工学部門
- 必須科目: 必須科目Ⅰ
- 選択科目:
  - 1501 生産・物流マネジメント
  - 1502 サービスマネジメント
- 選択科目の対象区分:
  - 選択科目Ⅱ-1
  - 選択科目Ⅱ-2
  - 選択科目Ⅲ

## 期待件数と収載件数

通常構成を前提に、各年度について次の件数を期待値とする。

| 区分 | 年度あたり | 7年度分 |
|---|---:|---:|
| 必須科目Ⅰ | 2 | 14 |
| 選択科目Ⅱ-1 | 8 | 56 |
| 選択科目Ⅱ-2 | 4 | 28 |
| 選択科目Ⅲ | 4 | 28 |
| 合計 | 18 | 126 |

現在の収載件数は 126 件で、期待件数との差分は 0 件である。

## 科目区分別件数

| 区分 | 件数 |
|---|---:|
| 必須科目Ⅰ | 14 |
| 選択科目Ⅱ-1 | 56 |
| 選択科目Ⅱ-2 | 28 |
| 選択科目Ⅲ | 28 |

## 分野別件数

| 分野 | fieldCode | 件数 |
|---|---:|---:|
| 共通 | common | 14 |
| 生産・物流マネジメント | 1501 | 56 |
| サービスマネジメント | 1502 | 56 |

## 選択科目Ⅲの収載状況

選択科目Ⅲは、令和元年度〜令和7年度について、1501 生産・物流マネジメント、1502 サービスマネジメントの `III-1` / `III-2` を収載済みである。

| 年度 | 生産・物流マネジメント | サービスマネジメント |
|---|---:|---:|
| 令和元年度 | 2 | 2 |
| 令和2年度 | 2 | 2 |
| 令和3年度 | 2 | 2 |
| 令和4年度 | 2 | 2 |
| 令和5年度 | 2 | 2 |
| 令和6年度 | 2 | 2 |
| 令和7年度 | 2 | 2 |

## メタデータ必須項目

各レコードでは、以下を必須項目として扱う。

- `id`
- `year`
- `eraYear`
- `subjectType`
- `field`
- `fieldCode`
- `questionNumber`
- `officialPdfUrl`
- `sourcePdfUrl`
- `sourceChecked`
- `officialSourceLabel`
- `summary`
- `questionPattern`
- `requiredActions`
- `themeTags`
- `methodTags`
- `policyTags`
- `lawTags`
- `answerFrameType`
- `skeletonTemplateId`
- `assessedCompetencies`

## 参照した公式ページ

- 日本技術士会 15 経営工学部門 過去問題ページ: https://www.engineer.or.jp/c_categories/index02022235.html

## 参照した公式 PDF

### 必須科目

- 令和7年度 15経営工学部門 必須科目: https://www.engineer.or.jp/c_topics/011/attached/attach_11175_1.pdf
- 令和6年度 15経営工学部門 必須科目: https://www.engineer.or.jp/c_topics/010/attached/attach_10367_1.pdf
- 令和5年度 15経営工学部門 必須科目: https://www.engineer.or.jp/c_topics/009/attached/attach_9645_1.pdf
- 令和4年度 15経営工学部門 必須科目: https://www.engineer.or.jp/c_topics/008/attached/attach_8861_1.pdf
- 令和3年度 15経営工学部門 必須科目: https://www.engineer.or.jp/c_topics/007/attached/attach_7927_1.pdf
- 令和2年度 15経営工学部門 必須科目: https://www.engineer.or.jp/c_topics/007/attached/attach_7389_1.pdf
- 令和元年度 15経営工学部門 必須科目: https://www.engineer.or.jp/c_topics/006/attached/attach_6654_1.pdf

### 1501 生産・物流マネジメント

- 令和7年度: https://www.engineer.or.jp/c_topics/011/attached/attach_11175_2.pdf
- 令和6年度: https://www.engineer.or.jp/c_topics/010/attached/attach_10367_2.pdf
- 令和5年度: https://www.engineer.or.jp/c_topics/009/attached/attach_9645_2.pdf
- 令和4年度: https://www.engineer.or.jp/c_topics/008/attached/attach_8861_2.pdf
- 令和3年度: https://www.engineer.or.jp/c_topics/007/attached/attach_7927_2.pdf
- 令和2年度: https://www.engineer.or.jp/c_topics/007/attached/attach_7389_2.pdf
- 令和元年度: https://www.engineer.or.jp/c_topics/006/attached/attach_6654_2.pdf

### 1502 サービスマネジメント

- 令和7年度: https://www.engineer.or.jp/c_topics/011/attached/attach_11175_3.pdf
- 令和6年度: https://www.engineer.or.jp/c_topics/010/attached/attach_10367_3.pdf
- 令和5年度: https://www.engineer.or.jp/c_topics/009/attached/attach_9645_3.pdf
- 令和4年度: https://www.engineer.or.jp/c_topics/008/attached/attach_8861_3.pdf
- 令和3年度: https://www.engineer.or.jp/c_topics/007/attached/attach_7927_3.pdf
- 令和2年度: https://www.engineer.or.jp/c_topics/007/attached/attach_7389_3.pdf
- 令和元年度: https://www.engineer.or.jp/c_topics/006/attached/attach_6654_3.pdf

## 検証方法

以下の検証スクリプトで、期待件数、欠落、必須フィールド、`fieldCode` を確認する。

```powershell
node scripts/validate-engineer-past-exam-coverage.js
```

検証結果が `expected: 126`, `actual: 126`, `missing: 0`, `incomplete: 0` であれば、現時点の網羅性は満たしている。

## 表示上の注意

公式 PDF の問題文全文は公開ページへ長く転載しない。サイト上では、年度、科目、問題番号、要約、設問形式、関連キーワード、公式 PDF リンクを表示し、問題文の詳細確認は公式 PDF への参照を優先する。
