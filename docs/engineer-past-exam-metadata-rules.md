# 技術士 経営工学部門 過去問メタデータ登録ルール

## 1. 基本方針

- 日本技術士会の過去問題PDFを丸ごと転載・再配布しない
- 公式PDFリンク、年度、科目、設問番号、要約、設問パターン、テーマタグ、手法タグ、政策・法令タグを管理する
- 問題文全文は公開表示しない
- 要約はオリジナルに言い換え、学習用メタデータとして扱う
- 将来的に例題生成・答案骨子作成に接続できる形にする

## 2. 必須フィールド

各問題には以下を必ず入れる。

- id
- year
- eraYear
- subjectType
- field
- questionNumber
- officialPdfUrl
- officialSourceLabel
- summary
- questionPattern
- requiredActions
- themeTags
- methodTags
- policyTags
- lawTags
- answerFrameType
- skeletonTemplateId

## 3. id の命名規則

id は以下の形式に統一する。

例：

- r06-i-01
- r06-ii1-plm-01
- r06-ii2-sm-01
- r06-iii-plm-01

ルール：

- r06 = 令和6年度
- i = 必須科目Ⅰ
- ii1 = 選択科目Ⅱ-1
- ii2 = 選択科目Ⅱ-2
- iii = 選択科目Ⅲ
- plm = 生産・物流マネジメント
- sm = サービスマネジメント
- 最後は設問番号

## 4. subjectType の表記

以下に統一する。

- 必須科目Ⅰ
- 選択科目Ⅱ-1
- 選択科目Ⅱ-2
- 選択科目Ⅲ

## 5. field の表記

以下に統一する。

- 共通
- 生産・物流マネジメント
- サービスマネジメント

## 6. questionPattern の分類

以下から選ぶ。

- 課題抽出型
- 手順説明型
- 留意点型
- 用語説明型
- 比較評価型
- リスク対応型
- 将来展望型

判断基準：

- 課題抽出型：課題を複数抽出し、解決策や対応策を問う
- 手順説明型：手法や業務の進め方を問う
- 留意点型：実施上の注意点・工夫点を問う
- 用語説明型：概念・手法・特徴を問う
- 比較評価型：複数案の比較、評価、選定を問う
- リスク対応型：リスク、トラブル、対策を問う
- 将来展望型：今後の方向性、社会変化への対応を問う

## 7. requiredActions の分類

以下から複数選択できる。

- 課題抽出
- 最重要課題選定
- 解決策提示
- 手順説明
- 留意点整理
- リスク抽出
- リスク対策
- 比較評価
- 用語説明
- 技術者倫理
- 社会の持続可能性

## 8. answerFrameType

以下に統一する。

- 必須科目Ⅰ型
- 選択科目Ⅱ-1型
- 選択科目Ⅱ-2型
- 選択科目Ⅲ型

## 9. skeletonTemplateId

以下に統一する。

- required-i-standard
- elective-ii-1-short
- elective-ii-2-procedure
- elective-iii-analysis

## 10. タグの方針

### themeTags

出題テーマや社会課題を表す。

例：

- DX
- 物流効率化
- QMS再構築
- 人材育成
- サプライチェーン強靭化
- 生産性向上
- 品質不正防止
- 価格転嫁
- 脱炭素

### methodTags

経営工学・品質管理・生産管理の手法を表す。

例：

- QCD
- KPI管理
- 管理図
- FMEA
- ECRS
- TOC
- 在庫管理
- S&OP
- 標準化
- 業務フロー分析
- 内部監査
- 是正処置

### policyTags

白書・政策・公的動向を表す。

例：

- ものづくり白書
- 労働経済白書
- 国土交通白書
- DX白書
- 環境白書
- 経済安全保障
- 人材育成
- サプライチェーン強靭化

### lawTags

法令・制度改定を表す。

例：

- 物流2024年問題
- 改正物流効率化法
- 下請法
- 価格転嫁
- 働き方改革関連法
- カーボンニュートラル
- 情報セキュリティ

## 11. summary の書き方

- 問題文全文をそのまま転載しない
- 80〜160字程度を目安に要約する
- 「何を背景に」「何について」「何を求める問題か」が分かるようにする
- 設問の要求動作が分かるようにする

良い例：

製造業を取り巻く人材不足やDX推進を背景に、経営工学の観点から課題を抽出し、最重要課題、解決策、リスク、倫理・持続可能性までを問う問題。

悪い例：

問題文をそのまま長くコピーする。

## 12. 既存データ見直しチェック

`public/data/engineer/past-exam-questions.json` を更新するときは、以下を確認する。

- 必須フィールドがすべてあるか
- id 命名規則に合っているか
- subjectType / field / answerFrameType / skeletonTemplateId の表記ゆれがないか
- questionPattern が分類に合っているか
- requiredActions が十分に入っているか
- themeTags / methodTags / policyTags / lawTags が過不足ないか
- summary が問題文全文の転載になっていないか
- officialPdfUrl が入っているか

## 今回やらないこと

- 追加で20問登録する
- 全年度対応する
- PDF自動取得
- OCR
- 問題文全文掲載
- 例題自動生成
- AnswerStructureBuilderへの自動入力
