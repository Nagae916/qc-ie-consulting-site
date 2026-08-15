# 技術士キーワードと通常Knowledgeの統合監査

## 1. 目的

技術士第二次試験の過去問で使われる語を、資格ページ内だけの説明へ閉じず、製造業の実務者も再利用できる通常Knowledgeへ接続する。過去問126問のデータ構造を大規模に変更せず、表記揺れを安定した正本URLへ解決する軽量な対応表を用いる。

本監査では、白書、法令、政策、資料名を通常Knowledgeとして自動生成しない。過去問での出現回数だけで新規ページを作らず、独立した問いに答える価値、4テーマとの関係、既存Knowledgeとの重複、実務利用価値を併せて判断する。

## 2. 判定区分

| 判定 | 意味 |
|---|---|
| `EXISTING_CANONICAL` | 既存ページを正本として維持する |
| `EXISTING_NEEDS_EXPANSION` | 既存正本はあるが、後続タスクで補強余地がある |
| `SECTION_IN_EXISTING_KNOWLEDGE` | 独立ページを増やさず、既存正本内の節として扱う |
| `NEW_KNOWLEDGE_CANDIDATE` | 独立した通常Knowledgeとして価値がある候補 |
| `NO_STANDALONE_PAGE` | 文脈依存または上位概念で説明できるため、単独ページを作らない |

## 3. 対象概念の監査

### 生産・IE

| 概念 | 現行126問での出現 | 判定 | 正本・対応 |
|---|---:|---|---|
| MIP／混合整数計画 | 0 | `SECTION_IN_EXISTING_KNOWLEDGE` | `/guides/engineer/linear-programming` を補強 |
| GT／グループテクノロジー | 0 | `NEW_KNOWLEDGE_CANDIDATE` | `/guides/engineer/group-technology` を新設 |
| SMED | 0 | `EXISTING_CANONICAL` | `/guides/engineer/smed` |
| APS | 0 | `SECTION_IN_EXISTING_KNOWLEDGE` | `/guides/engineer/scheduling` を補強 |
| MES | 1 | `EXISTING_CANONICAL` | `/guides/engineer/mes` |
| TOC／DBR | 1 | `EXISTING_CANONICAL` | `/guides/engineer/toc` |
| ポストポーンメント | 0 | `SECTION_IN_EXISTING_KNOWLEDGE` | `/guides/engineer/scm` を補強 |
| 統合ロットモデル | 0 | `NO_STANDALONE_PAGE` | ロットサイズ、EOQ、SCMを問題条件に応じて組み合わせる |
| 離散事象シミュレーション | 0 | `EXISTING_NEEDS_EXPANSION` | `/guides/engineer/simulation`。今回は変更しない |

### 品質・評価

| 概念 | 現行126問での出現 | 判定 | 正本・対応 |
|---|---:|---|---|
| QFD | 0 | `EXISTING_NEEDS_EXPANSION` | `/guides/engineer/qfd`。今回は変更しない |
| KPI | 75 | `EXISTING_CANONICAL` | `/guides/engineer/kpi-management` |
| KGI | 関連語 | `EXISTING_NEEDS_EXPANSION` | `/guides/engineer/kgi` |
| ロジックモデル | 0 | `SECTION_IN_EXISTING_KNOWLEDGE` | KPIマネジメント内で因果と指標を接続 |
| 代用特性 | 0 | `SECTION_IN_EXISTING_KNOWLEDGE` | 品質規格設計の測定・判定文脈で扱う |
| 測定妥当性 | 0 | `SECTION_IN_EXISTING_KNOWLEDGE` | `/guides/qc/how-to-set-quality-standards` と測定誤差で扱う |
| 測定負担 | 0 | `NO_STANDALONE_PAGE` | 測定設計の制約として扱う |
| 指標の目的化 | 0 | `SECTION_IN_EXISTING_KNOWLEDGE` | KPIマネジメントの留意点として扱う |

### マネジメント

| 概念 | 現行126問での出現 | 判定 | 正本・対応 |
|---|---:|---|---|
| 技術者倫理 | 14 | `EXISTING_CANONICAL` | `/guides/engineer/engineering-ethics` |
| 社会の持続可能性 | 41 | `NO_STANDALONE_PAGE` | 環境・倫理・4テーマを横断する観点として扱う |
| リスク管理 | 11 | `EXISTING_CANONICAL` | `/guides/engineer/risk-management` |
| データ辞書 | 0 | `SECTION_IN_EXISTING_KNOWLEDGE` | `/guides/engineer/data-governance` |
| 感度分析 | 0 | `SECTION_IN_EXISTING_KNOWLEDGE` | NPV、LCC、最適化の前提確認として扱う |
| 段階導入 | 1 | `NO_STANDALONE_PAGE` | PoC、投資評価、変更管理の実行原則として扱う |
| 力量管理 | 27 | `NEW_KNOWLEDGE_CANDIDATE` | QMS、人材育成、標準化を横断する候補。今回は作らない |
| 標準化 | 16 | `EXISTING_CANONICAL` | `/guides/engineer/standardization` |
| 業務フロー分析 | 14 | `NEW_KNOWLEDGE_CANDIDATE` | 改善とデータ設計を横断する候補。今回は作らない |

出現数が0の概念は、現行126問の頻出語であることを意味しない。将来の実答案レビューで参照される可能性がある概念として、通常Knowledgeの正本候補を先に整理したものである。

## 4. 今回の実装範囲

- GTは、類似部品、部品ファミリー、工程経路、セル、標準化を一つの問いとして説明できるため、新規の通常Knowledgeとした。
- MIPは線形計画法の整数条件として理解するのが自然なため、既存の線形計画法へ統合した。
- APSはスケジューリングの有限能力計画として理解するのが自然なため、既存のスケジューリングへ統合した。
- ポストポーンメントは在庫配置とデカップリングポイントを含むSCM設計の一部として統合した。
- ロジックモデルはKGI、CSF、KPIの因果を点検する方法としてKPIマネジメントへ統合した。
- QFD、KGI、離散事象シミュレーションは既存正本を維持し、今回の範囲では拡張しない。

## 5. 軽量な対応表

`knowledge-term-map` は、次の安定情報だけを持つ。

- 正規語と表示名
- 表記揺れ・略語
- taxonomy
- 関連する4テーマ
- 通常Knowledgeの正本URL
- 内容が分かるリンク名
- 関連語

過去問での出現数と答案型別件数は、126問のデータから分析時に算出する。対応表へ複製しないことで、過去問追加時の件数ずれを防ぐ。過去問データ内の語を一括置換せず、表示・リンクの境界で別名を正本へ解決する。

## 6. 内部リンク方針

1. 過去問カードのタグを対応表で解決し、該当する通常Knowledgeがある場合だけ「理解を深める」導線を出す。
2. 一つのカードでKnowledgeリンクを主役にせず、答案型の次に置く補助導線とする。
3. リンク文言は「詳しく見る」ではなく、何を理解できるかを示す。
4. 通常Knowledgeから試験ページへの逆リンクは、複数問題で明確に使われる場合など、読者価値がある箇所だけに限定する。
5. 2026年度実答案レビューでは、答案中の概念をこの対応表で正本へ結び、定義本文を答案ページへ複製しない。

## 7. 重複候補の現状

| 候補 | 検索意図と役割 | 本文文字重複率 | inbound links | canonical / sitemap | 正本候補 |
|---|---|---:|---:|---|---|
| `psi` / `psi-management` | 短い試験学習入門 / 販売・生産・在庫をつなぐ実務解説 | 11.7% | 0 / 0 | 両方とも自己canonical・掲載 | `psi-management` |
| `scm` / `supply-chain-management` | 全体最適の詳説 / SCMの短い入門 | 7.0% | 48 / 0 | 両方とも自己canonical・掲載 | `scm` |
| `s-and-op` / `sop` | 経営工学Knowledge / 短い学習ガイド | 7.6% | 19 / 0 | 両方とも自己canonical・掲載 | `s-and-op` |
| `lcc` / `life-cycle-cost` | LCCの詳説 / ライフサイクル費用の短い入門 | 9.6% | 11 / 0 | 両方とも自己canonical・掲載 | `lcc` |
| `value-engineering` / `ve-va` | VE単独の入門 / VE・VAを含む詳説 | 9.7% | 0 / 3 | 両方とも自己canonical・掲載 | 将来統合時は `ve-va` |

アクセスデータがないため、今回URL削除、redirect、canonical変更、sitemap除外は行わない。統合時は検索クエリ、流入、被リンク、内容差を再確認し、301移行を別タスクで設計する。

## 8. 後続候補

- 力量管理、業務フロー分析を、通常Knowledgeとして独立させる価値の再評価
- QFD、KGI、離散事象シミュレーションの既存ページ品質レビュー
- 2026年度実答案レビューからの正本Knowledgeリンク
- 代用特性、測定妥当性、測定負担を品質規格設計の中でどう整理するかのレビュー

## 9. Protected Defaults

ブランド、4テーマ、メインターゲット、既存URL、Pages Router、MDX・静的生成中心の技術方針は変更していない。技術士は引き続き「学びを深める」の副導線であり、通常Knowledgeを正本とする。
