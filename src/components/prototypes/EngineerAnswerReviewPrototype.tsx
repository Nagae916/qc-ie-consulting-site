import Link from "next/link";
import type { ReactNode } from "react";

type PrototypeVariant = "a" | "b" | "c";

type ReviewPointData = {
  title: string;
  good: string;
  but: string;
  why: string;
  better: string;
};

const originalAnswer = [
  {
    title: "（1）特性要因図の基本構造と4Mの分類項目",
    paragraphs: [
      "①ヒト：作業員の習熟度、教育体制、標準作業書、作業員工数など人的リソースが該当する。",
      "②モノ：生産設備や治工具、部品や保管棚など生産に関わる機器や備品が該当する。",
      "③原材料：生産に投入される原料や中間品、仕掛品などが該当する。",
      "④方法：生産方法や修理方法、ノウハウなどの手法が該当する。",
      "特性要因図は、発生した事象、トラブルを幹として、その要因を上記の4Mに分類し、枝分かれして記述する手法である。これにより、要因をもれなく重複なく拾い上げ、真因の究明を図ることが出来る。",
      "（特性要因図を記載）",
    ],
  },
  {
    title: "（2）飲食店で顧客満足度が低い要因分析",
    paragraphs: [
      "①ヒト：従業員の教育が不十分であり、サービスの質が要求水準を満たしていない。",
      "②モノ：自動調理機器の稼働効率が悪く、提供に時間を要している。",
      "③原材料：食材の鮮度が一定でないため、味にばらつきがある。",
      "④方法：調理方法が従業員の裁量に任されており、調理者によって焼きムラなどが生じる。",
      "以上",
    ],
  },
] as const;

const answerDesign = [
  ["設問への対応", "基本構造・4Mと、飲食店での要因分析を同じ4区分で対応させています。"],
  ["構成", "4Mの具体例を先に示し、その後で特性要因図の説明、適用例へ進んでいます。"],
  ["専門語", "4M、標準作業書、習熟度、稼働効率、要求水準を使い、抽象語だけで終わらせていません。"],
  ["効果確認", "原因候補は挙げていますが、顧客満足度との関係を観察・測定して確かめる段階は書かれていません。"],
] as const;

const reviewPoints: ReviewPointData[] = [
  {
    title: "設問へ直接答える構成",
    good: "基本構造・4Mと飲食店への適用を分け、二つの設問へ対応しています。",
    but: "4Mの例示が先に来るため、特性要因図を何のために使うかが後から分かる構成です。",
    why: "短答では、冒頭の定義が後続の分類と適用例を読む基準になります。",
    better: "最初に手法を一文で定義し、4M、作り方、適用例の順に置きます。",
  },
  {
    title: "原因仮説と真因を分ける",
    good: "教育、設備、食材、調理方法を、顧客満足度へ影響する具体的な候補に変換しています。",
    but: "『真因の究明を図ることが出来る』は、図だけで真因を確定できるようにも読めます。",
    why: "特性要因図は関係者の知見から原因仮説を整理する手法であり、因果を証明する手法ではありません。",
    better: "図で検証対象を絞り、現地観察、聞取り、測定で重要要因を確かめると示します。",
  },
  {
    title: "データで検証する出口を置く",
    good: "教育不足から接客品質、設備稼働から提供時間という因果の方向があります。",
    but: "候補を挙げた後、満足度との関係をどのデータで確かめるかがありません。",
    why: "検証方法がなければ、もっともらしい候補を並べただけで分析が止まります。",
    better: "満足度を味・待ち時間・接客へ層別し、チェックシート、散布図、管理図で確認します。",
  },
  {
    title: "分類の完全性を目的にしない",
    good: "4Mを使って原因候補を広く見ようとしています。",
    but: "原因は複数区分に関係するため、『もれなく重複なく』を形式的に保証することは困難です。",
    why: "分類の美しさより、重要な仮説を取りこぼさず検証できることが実務上重要です。",
    better: "関係者で不足を補い、重複を許容しながらデータで優先順位を付けます。",
  },
];

const answerFrame = [
  ["定義", "特性要因図は、結果と原因仮説の関係を魚骨状に整理する手法と示す。"],
  ["4M", "Man、Machine、Material、Methodの意味を短く説明する。"],
  ["作り方", "特性を魚頭に置き、4Mから『なぜ』を展開すると説明する。"],
  ["飲食店への適用", "接客、調理設備、食材、標準レシピの観点で原因候補を示す。"],
  ["留意点", "図の要因は仮説であり、観察とデータで検証して改善後も再測定する。"],
] as const;

const referenceAnswer = [
  "特性要因図は、解決すべき品質特性と、それに影響すると考えられる要因の関係を魚骨状に体系化し、原因仮説を網羅的に抽出するQC七つ道具である。4Mは、①Man（人：技能、教育、作業負荷）、②Machine（機械：設備、治工具、保全状態）、③Material（材料：食材、部品、仕掛品の品質）、④Method（方法：手順、条件、管理方法）である。",
  "作成時は、右端の魚頭に『顧客満足度が低い』と結果を具体的に記す。そこへ背骨を引き、4Mを大骨として配置する。次に、現地観察、顧客の声及び従業員への聞取りから『なぜ』を繰り返し、中骨、小骨へ具体的要因を展開する。",
  "飲食店では、Manは接客教育不足により応対が不統一、Machineは調理機器の故障や能力不足により提供が遅い、Materialは食材の鮮度や規格のばらつきにより味が安定しない、Methodは標準レシピ、注文伝達及び衛生管理が不徹底、と整理できる。",
  "ただし、図に挙げた要因は仮説であり真因ではない。満足度を味、待ち時間、接客等に層別し、チェックシートで発生頻度を収集する。さらに、待ち時間と満足度の散布図、提供時間の管理図等で影響を検証し、重要要因を改善する。分類の重複を避けるより、関係者で不足要因を補い、データで真因を確定することが留意点である。改善後は同条件で再測定し、効果を確認する。",
] as const;

const relatedKnowledge = [
  {
    title: "QC七つ道具と特性要因図",
    description: "原因候補を体系的に整理する手法の位置付け",
    href: "/guides/qc/qc-seven-tools",
  },
  {
    title: "散布図で二つの変数の関係を見る",
    description: "原因仮説と満足度の関係をデータで確かめる",
    href: "/guides/stat/scatterplot",
  },
  {
    title: "管理図で時間的な安定性を見る",
    description: "提供時間や改善後の状態を継続して判断する",
    href: "/guides/stat/control-chart-basics",
  },
] as const;

const conceptStages = [
  ["01", "特性要因図", "結果と要因を見える化"],
  ["02", "原因候補を整理", "4Mで仮説を広げる"],
  ["03", "仮説", "重要そうな関係を選ぶ"],
  ["04", "データで検証", "層別・散布図・実験"],
  ["05", "真因を判断", "観察結果と照合する"],
  ["06", "改善", "再測定して効果を確かめる"],
] as const;

export function EngineerAnswerReviewPrototype({ variant }: { variant: PrototypeVariant }) {
  if (variant === "a") return <EditorialLab />;
  if (variant === "b") return <GuidedWorkbook />;
  return <EditorialLabPlus />;
}

function PrototypeSwitcher({ active }: { active: PrototypeVariant }) {
  return (
    <nav aria-label="デザイン案の切替" className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-bold">
      <span className="text-slate-500">DESIGN PROTOTYPE</span>
      <Link className={active === "a" ? "text-teal-800 underline underline-offset-4" : "text-slate-500 hover:text-teal-700"} href="/prototypes/engineer-answer-review?variant=a">
        A Editorial Lab
      </Link>
      <Link className={active === "b" ? "text-teal-800 underline underline-offset-4" : "text-slate-500 hover:text-teal-700"} href="/prototypes/engineer-answer-review?variant=b">
        B Guided Workbook
      </Link>
      <Link className={active === "c" ? "text-teal-800 underline underline-offset-4" : "text-slate-500 hover:text-teal-700"} href="/prototypes/engineer-answer-review?variant=c">
        C Editorial Lab A+
      </Link>
    </nav>
  );
}

function EditorialLab() {
  const contents = [
    ["01", "問題をつかむ", "editorial-01"],
    ["02", "実際にどう書いたか", "editorial-02"],
    ["03", "どこを改善するか", "editorial-03"],
    ["04", "今ならどう書くか", "editorial-04"],
    ["05", "理解を深める", "editorial-05"],
  ] as const;

  return (
    <main id="main-content" className="min-h-screen bg-[#f7f8f7] text-slate-900">
      <header className="border-b border-slate-300 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
          <PrototypeSwitcher active="a" />
          <div className="mt-10 max-w-4xl">
            <p className="text-xs font-bold tracking-[0.16em] text-teal-800">2026 / 選択科目Ⅱ-1-4 / 復元答案レビュー</p>
            <h1 className="mt-4 max-w-3xl text-3xl font-black leading-tight md:text-5xl">特性要因図を、どう説明すればよかったか</h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 md:text-lg">
              実際の復元答案を起点に、Ⅱ-1型の読み方と、原因候補をデータで検証するところまでを一つの教材として読み解きます。
            </p>
          </div>
          <dl className="mt-10 grid max-w-4xl gap-6 border-t border-slate-300 pt-6 md:grid-cols-3">
            <SummaryFact term="問題要求">基本構造と4Mを説明し、飲食店へ適用する</SummaryFact>
            <SummaryFact term="答案の型">選択科目Ⅱ-1型</SummaryFact>
            <SummaryFact term="この教材の焦点">原因仮説と真因を分ける</SummaryFact>
          </dl>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-12 lg:grid-cols-[11rem_minmax(0,46rem)] lg:py-16">
        <aside className="hidden lg:block">
          <nav aria-label="ページ内目次" className="sticky top-28 border-t border-slate-400 pt-4">
            <p className="text-[0.6875rem] font-bold tracking-[0.18em] text-slate-500">CONTENTS</p>
            <ol className="mt-4 space-y-3">
              {contents.map(([number, label, id]) => (
                <li key={id}>
                  <a href={`#${id}`} className="grid grid-cols-[1.8rem_1fr] text-xs leading-5 text-slate-600 hover:text-teal-800">
                    <span className="font-bold text-teal-800">{number}</span>
                    <span>{label}</span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </aside>

        <article className="min-w-0 max-w-[46rem]">
          <Chapter id="editorial-01" number="01" title="問題をつかむ">
            <p className="text-lg font-bold leading-8 text-slate-900">特性要因図の基本構造と4Mを説明し、飲食店の顧客満足度が低い要因を4Mから分析する問題です。</p>
            <p className="mt-4 text-base leading-8 text-slate-700">
              問われているのは用語の暗記だけではありません。特性要因図が何を整理する手法か、4Mをどう使い、具体的なサービス品質の問題へどう当てはめるかまでが対象です。
            </p>
            <p className="mt-5 border-l-2 border-amber-500 pl-4 text-sm leading-7 text-slate-600">
              本文は試験後に作成した復元答案です。試験当日の記述を完全に逐語再現したものではありません。評価はN-IE Lab独自であり、公式採点や合否を保証するものではありません。
            </p>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm font-bold">
              <Link className="text-teal-800 underline decoration-teal-300 underline-offset-4" href="/guides/engineer/answer-structure-guide#6-選択科目ⅱ-1で使う骨子">Ⅱ-1答案型を確認する</Link>
              <a className="text-slate-600 underline decoration-slate-300 underline-offset-4" href="https://www.engineer.or.jp/c_topics/011/attached/attach_11985_2.pdf">公式問題を確認する</a>
            </div>
          </Chapter>

          <Chapter id="editorial-02" number="02" title="実際にどう書いたか">
            <OriginalAnswer />
            <section className="mt-12">
              <EditorialLabel>復元答案から読み取れる答案設計</EditorialLabel>
              <p className="mt-3 text-sm leading-7 text-slate-600">内面的な思考過程は資料に残っていないため、答案本文に表れた選択と順序だけを分析します。</p>
              <dl className="mt-6 divide-y divide-slate-300 border-y border-slate-300">
                {answerDesign.map(([term, description]) => (
                  <div key={term} className="grid gap-2 py-5 sm:grid-cols-[8rem_1fr] sm:gap-6">
                    <dt className="text-sm font-bold text-slate-900">{term}</dt>
                    <dd className="text-sm leading-7 text-slate-600">{description}</dd>
                  </div>
                ))}
              </dl>
            </section>
          </Chapter>

          <Chapter id="editorial-03" number="03" title="どこを改善するか">
            <div className="divide-y divide-slate-300 border-y border-slate-300">
              {reviewPoints.map((point, index) => <EditorialReviewPoint key={point.title} index={index + 1} point={point} />)}
            </div>
            <ConceptFigure variant="a" />
          </Chapter>

          <Chapter id="editorial-04" number="04" title="今ならどう書くか">
            <EditorialLabel>答案骨子</EditorialLabel>
            <AnswerFrameList variant="a" />
            <ReferenceAnswer variant="a" />
          </Chapter>

          <Chapter id="editorial-05" number="05" title="理解を深める">
            <RelatedReading variant="a" />
            <nav aria-label="次に進む" className="mt-10 border-t border-slate-300 pt-6 text-sm">
              <Link href="/guides/engineer/answer-structure-guide#6-選択科目ⅱ-1で使う骨子" className="font-bold text-teal-800 underline decoration-teal-300 underline-offset-4">Ⅱ-1答案型へ戻る</Link>
              <span className="mx-3 text-slate-300" aria-hidden="true">/</span>
              <Link href="/guides/engineer/past-exam-trend-map?type=ii-1" className="text-slate-600 underline decoration-slate-300 underline-offset-4">Ⅱ-1の過去問を探す</Link>
            </nav>
          </Chapter>
        </article>
      </div>
    </main>
  );
}

function EditorialLabPlus() {
  const contents = [
    ["01", "問題をつかむ", "editorial-plus-01"],
    ["02", "実際にどう書いたか", "editorial-plus-02"],
    ["03", "どこを改善するか", "editorial-plus-03"],
    ["04", "今ならどう書くか", "editorial-plus-04"],
    ["05", "理解を深める", "editorial-plus-05"],
  ] as const;

  return (
    <main id="main-content" className="min-h-screen bg-[#fafaf8] text-slate-900">
      <header className="bg-[#fafaf8]">
        <div className="mx-auto max-w-6xl px-4 pb-8 pt-9 md:pb-10 md:pt-11">
          <PrototypeSwitcher active="c" />
          <div className="mt-9 max-w-4xl">
            <p className="text-xs font-bold tracking-[0.12em] text-teal-800">2026 / 選択科目Ⅱ-1-4 / 復元答案レビュー</p>
            <h1 className="mt-4 max-w-3xl text-3xl font-black leading-tight md:text-5xl">特性要因図を、どう説明すればよかったか</h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 md:text-lg md:leading-8">
              実際の復元答案を読み直し、Ⅱ-1型の組み立て方と、原因候補をデータで検証するところまでを一つの教材として整理します。
            </p>
          </div>
          <dl className="mt-8 grid max-w-4xl gap-5 border-t border-slate-300 pt-5 md:grid-cols-3">
            <SummaryFact term="問題要求">基本構造と4Mを説明し、飲食店へ適用する</SummaryFact>
            <SummaryFact term="答案の型">選択科目Ⅱ-1型</SummaryFact>
            <SummaryFact term="この教材の焦点">原因仮説と真因を分ける</SummaryFact>
          </dl>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-10 px-4 pb-10 pt-4 lg:grid-cols-[10rem_minmax(0,44rem)] lg:gap-12 lg:pb-14">
        <aside className="hidden lg:block">
          <nav aria-label="ページ内目次" className="sticky top-28 pt-3">
            <div className="h-px bg-slate-400" />
            <p className="mt-4 text-[0.6875rem] font-bold tracking-[0.14em] text-slate-500">目次</p>
            <ol className="mt-4 space-y-3">
              {contents.map(([number, label, id]) => (
                <li key={id}>
                  <a href={`#${id}`} className="grid grid-cols-[1.8rem_1fr] text-xs leading-5 text-slate-600 hover:text-teal-800">
                    <span className="font-bold text-teal-800">{number}</span>
                    <span>{label}</span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </aside>

        <article className="min-w-0 max-w-[44rem]">
          <EditorialPlusChapter
            id="editorial-plus-01"
            number="01"
            title="問題をつかむ"
            focus="設問が求める二つの説明対象と、使うべき答案の型を先に確認します。"
          >
            <p className="text-lg font-bold leading-8 text-slate-950">特性要因図の基本構造と4Mを説明し、飲食店の顧客満足度が低い要因を4Mから分析する問題です。</p>
            <p className="mt-4 text-base leading-8 text-slate-700">
              用語の暗記だけでなく、特性要因図が何を整理する手法か、4Mをどう使い、サービス品質の問題へどう当てはめるかまでが問われています。
            </p>
            <p className="mt-5 text-sm font-bold leading-7 text-slate-800">このレビューで分かること：原因候補を挙げた後、何を根拠に真因と判断するか。</p>
            <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3 text-sm font-bold">
              <Link className="text-teal-800 underline decoration-teal-300 underline-offset-4" href="/guides/engineer/answer-structure-guide#6-選択科目ⅱ-1で使う骨子">Ⅱ-1答案型を確認する</Link>
              <a className="text-slate-600 underline decoration-slate-300 underline-offset-4" href="https://www.engineer.or.jp/c_topics/011/attached/attach_11985_2.pdf">公式問題を確認する</a>
            </div>
          </EditorialPlusChapter>

          <EditorialPlusChapter
            id="editorial-plus-02"
            number="02"
            title="実際にどう書いたか"
            focus="復元答案の内容と、答案に表れた説明順序を分けて読みます。"
          >
            <AnswerBlock
              variant="reconstructed"
              title="復元答案"
              subtitle="ORIGINAL"
              note="試験後に作成した復元答案です。試験当日の記述を完全に逐語再現したものではありません。"
            >
              <div className="space-y-7">
                {originalAnswer.map((part) => (
                  <section key={part.title}>
                    <h3 className="text-base font-bold leading-7 text-slate-950">{part.title}</h3>
                    <div className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
                      {part.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                    </div>
                  </section>
                ))}
              </div>
            </AnswerBlock>

            <section className="mt-9" aria-labelledby="editorial-plus-design">
              <p className="text-[0.6875rem] font-bold tracking-[0.12em] text-slate-500">答案に表れた設計</p>
              <h3 id="editorial-plus-design" className="mt-2 text-lg font-bold text-slate-950">何を選び、どの順で説明したか</h3>
              <p className="mt-2 text-sm leading-7 text-slate-600">内面的な思考過程は資料に残っていないため、答案本文に表れた選択と順序だけを分析します。</p>
              <dl className="mt-5 grid gap-x-8 gap-y-5 sm:grid-cols-2">
                {answerDesign.map(([term, description]) => (
                  <div key={term}>
                    <dt className="text-sm font-bold text-slate-950">{term}</dt>
                    <dd className="mt-1 text-sm leading-6 text-slate-600">{description}</dd>
                  </div>
                ))}
              </dl>
            </section>
          </EditorialPlusChapter>

          <EditorialPlusChapter
            id="editorial-plus-03"
            number="03"
            title="どこを改善するか"
            focus="良い部分を残しながら、原因候補を真因と判断してしまう箇所を見直します。"
          >
            <div>
              {reviewPoints.map((point, index) => (
                <EditorialPlusReviewPoint key={point.title} index={index + 1} point={point} />
              ))}
            </div>
            <EditorialConceptFigure />
          </EditorialPlusChapter>

          <EditorialPlusChapter
            id="editorial-plus-04"
            number="04"
            title="今ならどう書くか"
            focus="参考解答を読む前に、短答に必要な五つの要素を自分の順序で確認します。"
          >
            <section aria-labelledby="editorial-plus-frame">
              <p className="text-[0.6875rem] font-bold tracking-[0.12em] text-slate-500">答案骨子</p>
              <h3 id="editorial-plus-frame" className="mt-2 text-xl font-bold text-slate-950">今ならこう組み立てる</h3>
              <EditorialAnswerFrame />
            </section>
            <p className="mt-7 text-sm font-bold leading-7 text-slate-800">図で終わらず、原因候補をどのデータで確かめるかまで一文で示します。</p>
            <AnswerBlock
              variant="reference"
              title="N-IE Lab参考解答"
              subtitle="REFERENCE"
              heading="復元答案の直接性を残し、検証まで補う"
              note="試験後の検討を反映したN-IE Lab独自の参考解答です。公式採点や合格を保証するものではありません。"
            >
              <div className="space-y-3 text-sm leading-6 text-slate-700">
                {referenceAnswer.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </div>
            </AnswerBlock>
          </EditorialPlusChapter>

          <EditorialPlusChapter
            id="editorial-plus-05"
            number="05"
            title="理解を深める"
            focus="答案で使った手法を、試験以外でも使える通常のKnowledgeへ戻します。"
          >
            <EditorialRelatedReading />
            <EditorialNextLinks />
          </EditorialPlusChapter>
        </article>
      </div>
    </main>
  );
}

function GuidedWorkbook() {
  const steps = ["問題", "復元答案", "レビュー", "組み直す", "深める"] as const;

  return (
    <main id="main-content" className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-4xl px-4 py-10 md:py-14">
          <PrototypeSwitcher active="b" />
          <p className="mt-10 text-xs font-bold tracking-[0.14em] text-teal-800">2026 / 選択科目Ⅱ-1-4 / 復元答案レビュー</p>
          <h1 className="mt-4 max-w-3xl text-3xl font-black leading-tight md:text-5xl">特性要因図を、どう説明すればよかったか</h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600">復元答案を読み、直す理由を確かめ、最後に自分の答案へ組み直す5段階のワークブックです。</p>
          <ol aria-label="学習の5段階" className="mt-8 grid grid-cols-5 border-y border-slate-200 py-4">
            {steps.map((step, index) => (
              <li key={step} className="border-l border-slate-200 px-2 first:border-l-0 md:px-4">
                <span className="block text-[0.6875rem] font-bold text-teal-700">STEP {index + 1}</span>
                <span className="mt-1 block text-xs font-bold text-slate-700 md:text-sm">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </header>

      <article className="mx-auto max-w-3xl px-4 py-12 md:py-16">
        <WorkbookStep number="1" title="問題を読む" prompt="設問の動詞と、指定された二つの説明対象を先に確認します。" id="workbook-01">
          <p className="text-lg font-bold leading-8">特性要因図の基本構造と4Mを説明し、飲食店の顧客満足度が低い要因を4Mから分析する。</p>
          <CheckNote title="ここで確認">
            用語の定義だけでなく、手法の役割、4Mの使い方、具体的な問題への適用までが問われています。
          </CheckNote>
          <p className="mt-6 text-sm leading-7 text-slate-600">本文は試験後に作成した復元答案です。試験当日の記述を完全に逐語再現したものではありません。評価はN-IE Lab独自のものです。</p>
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm font-bold">
            <Link className="text-teal-800 underline decoration-teal-300 underline-offset-4" href="/guides/engineer/answer-structure-guide#6-選択科目ⅱ-1で使う骨子">Ⅱ-1答案型を確認する</Link>
            <a className="text-slate-600 underline decoration-slate-300 underline-offset-4" href="https://www.engineer.or.jp/c_topics/011/attached/attach_11985_2.pdf">公式問題を確認する</a>
          </div>
        </WorkbookStep>

        <WorkbookStep number="2" title="実際の復元答案を見る" prompt="何を書いたかと、どの順序で書いたかを分けて読みます。" id="workbook-02">
          <OriginalAnswer />
          <h3 className="mt-10 text-lg font-bold">復元答案から読み取れる答案設計</h3>
          <dl className="mt-4 divide-y divide-slate-200 border-y border-slate-200">
            {answerDesign.map(([term, description]) => (
              <div key={term} className="py-4">
                <dt className="text-sm font-bold">{term}</dt>
                <dd className="mt-1 text-sm leading-7 text-slate-600">{description}</dd>
              </div>
            ))}
          </dl>
        </WorkbookStep>

        <WorkbookStep number="3" title="どこを直すか考える" prompt="良い部分を残しながら、判断の根拠が弱い箇所を見つけます。" id="workbook-03">
          <div className="space-y-10">
            {reviewPoints.map((point, index) => <WorkbookReviewPoint key={point.title} index={index + 1} point={point} />)}
          </div>
          <ConceptFigure variant="b" />
        </WorkbookStep>

        <WorkbookStep number="4" title="答案を組み直す" prompt="参考解答を読む前に、必要な5要素を自分の順序で確認します。" id="workbook-04">
          <AnswerFrameList variant="b" />
          <CheckNote title="覚えておく">
            特性要因図で終わらず、原因候補をどのデータで確かめるかまで一文で示します。
          </CheckNote>
          <ReferenceAnswer variant="b" />
        </WorkbookStep>

        <WorkbookStep number="5" title="Knowledgeで理解を深める" prompt="答案で使った手法を、試験以外でも使える知識へ戻します。" id="workbook-05">
          <RelatedReading variant="b" />
          <CheckNote title="次に見る">
            別のⅡ-1問題でも、定義、原理、使い方、留意点の順に骨子を作れるか試します。
          </CheckNote>
          <nav aria-label="次に進む" className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm">
            <Link href="/guides/engineer/answer-structure-guide#6-選択科目ⅱ-1で使う骨子" className="font-bold text-teal-800 underline decoration-teal-300 underline-offset-4">Ⅱ-1答案型へ戻る</Link>
            <Link href="/guides/engineer/past-exam-trend-map?type=ii-1" className="text-slate-600 underline decoration-slate-300 underline-offset-4">Ⅱ-1の過去問を探す</Link>
          </nav>
        </WorkbookStep>
      </article>
    </main>
  );
}

function EditorialPlusChapter({
  id,
  number,
  title,
  focus,
  children,
}: {
  id: string;
  number: string;
  title: string;
  focus: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 py-8 md:py-10">
      {number === "01" ? null : <div aria-hidden="true" className="mb-8 h-px bg-slate-300" />}
      <header className="mb-5">
        <div className="grid grid-cols-[2.75rem_1fr] items-baseline gap-3">
          <span className="text-sm font-black text-teal-800">{number}</span>
          <h2 className="text-2xl font-black text-slate-950 md:text-3xl">{title}</h2>
        </div>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:pl-[3.5rem]">
          <span className="font-bold text-slate-800">この章で見ること：</span>{focus}
        </p>
      </header>
      {children}
    </section>
  );
}

function AnswerBlock({
  variant,
  title,
  subtitle,
  heading,
  note,
  children,
}: {
  variant: "reconstructed" | "reference";
  title: string;
  subtitle: string;
  heading?: string;
  note: string;
  children: ReactNode;
}) {
  const isReference = variant === "reference";

  return (
    <section
      className={`border-l-2 pl-5 md:pl-7 ${isReference ? "mt-9 border-teal-600" : "border-slate-400"}`}
      aria-label={title}
    >
      <p className={`text-xs font-black ${isReference ? "text-teal-800" : "text-slate-700"}`}>
        {title}
        <span className="ml-2 text-[0.625rem] font-bold tracking-[0.12em] text-slate-400">{subtitle}</span>
      </p>
      {heading ? <h3 className="mt-2 text-xl font-bold text-slate-950">{heading}</h3> : null}
      <p className="mt-2 text-xs leading-5 text-slate-500">{note}</p>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function EditorialPlusReviewPoint({ index, point }: { index: number; point: ReviewPointData }) {
  const items = [
    ["できていたこと", point.good],
    ["見直したいこと", point.but],
    ["なぜか", point.why],
    ["今なら", point.better],
  ] as const;

  return (
    <section className={index === 1 ? "pb-6" : "pb-6 pt-6"}>
      {index === 1 ? null : <div aria-hidden="true" className="mb-6 h-px bg-slate-200" />}
      <p className="text-[0.6875rem] font-black tracking-[0.12em] text-teal-800">振り返り {String(index).padStart(2, "0")}</p>
      <h3 className="mt-2 text-lg font-bold text-slate-950 md:text-xl">{point.title}</h3>
      <dl className="mt-4 grid gap-x-8 gap-y-3 sm:grid-cols-2">
        {items.map(([label, description]) => (
          <div key={label}>
            <dt className="text-xs font-bold text-slate-500">{label}</dt>
            <dd className="mt-1 text-sm leading-6 text-slate-700">{description}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function EditorialConceptFigure() {
  return (
    <figure className="mt-4 py-6">
      <div aria-hidden="true" className="h-px bg-slate-400" />
      <figcaption className="pt-6">
        <p className="text-[0.6875rem] font-black tracking-[0.12em] text-teal-800">図1 <span className="ml-2 text-slate-400">FIGURE 01</span></p>
        <h3 className="mt-2 text-xl font-bold text-slate-950">特性要因図から真因判断まで</h3>
      </figcaption>
      <ol className="mt-6 grid gap-2 sm:grid-cols-6 sm:gap-4" aria-label="原因候補を整理してデータで検証し、真因を判断して改善する流れ">
        {conceptStages.map(([number, title, description], index) => (
          <li key={number} className="relative grid grid-cols-[2.25rem_1fr] gap-3 pb-2 sm:block sm:pb-0">
            <span className="text-xs font-black text-teal-800">{number}</span>
            <div className="sm:mt-2">
              <p className="text-sm font-bold leading-6 text-slate-950">{title}</p>
              <p className="mt-0.5 text-xs leading-5 text-slate-500">{description}</p>
            </div>
            {index < conceptStages.length - 1 ? (
              <>
                <span aria-hidden="true" className="absolute bottom-0 left-[0.85rem] top-6 w-px bg-slate-200 sm:hidden" />
                <span aria-hidden="true" className="absolute -right-3 top-1 hidden text-sm text-slate-300 sm:block">→</span>
              </>
            ) : null}
          </li>
        ))}
      </ol>
      <p className="mt-6 max-w-2xl text-sm font-bold leading-6 text-slate-800">特性要因図で得られるのは原因候補です。真因の判断には、観察や測定による検証が必要になります。</p>
      <p className="mt-3 text-xs italic leading-6 text-slate-500">特性要因図は真因そのものではなく、検証すべき仮説を整理するために使います。</p>
      <div aria-hidden="true" className="mt-6 h-px bg-slate-300" />
    </figure>
  );
}

function EditorialAnswerFrame() {
  return (
    <ol className="mt-5 space-y-3">
      {answerFrame.map(([title, description], index) => (
        <li key={title} className="grid grid-cols-[2.25rem_1fr] gap-3 sm:grid-cols-[2.75rem_1fr]">
          <span className="pt-0.5 text-sm font-black text-teal-800">{String(index + 1).padStart(2, "0")}</span>
          <p className="text-sm leading-6 text-slate-600">
            <span className="mr-2 font-bold text-slate-950">{title}</span>{description}
          </p>
        </li>
      ))}
    </ol>
  );
}

function EditorialRelatedReading() {
  return (
    <div className="space-y-5">
      {relatedKnowledge.map((item) => (
        <Link key={item.href} href={item.href} className="group block max-w-2xl">
          <span className="block text-base font-bold text-slate-950 group-hover:text-teal-800">{item.title}</span>
          <span className="mt-1 block text-sm leading-6 text-slate-600">{item.description}</span>
          <span className="mt-1 block text-sm font-bold text-teal-700">読む →</span>
        </Link>
      ))}
    </div>
  );
}

function EditorialNextLinks() {
  const links = [
    ["答案の型を確認する", "Ⅱ-1の答案型", "/guides/engineer/answer-structure-guide#6-選択科目ⅱ-1で使う骨子"],
    ["次に学ぶ", "Ⅱ-2では何が違う？", "/guides/engineer/answer-structure-guide#7-選択科目ⅱ-2で使う骨子"],
    ["過去問へ戻る", "Ⅱ-1の問題を探す", "/guides/engineer/past-exam-trend-map?type=ii-1"],
  ] as const;

  return (
    <nav aria-label="次に進む" className="mt-8">
      <div aria-hidden="true" className="h-px bg-slate-300" />
      <div className="grid gap-5 pt-5 sm:grid-cols-3">
        {links.map(([label, text, href]) => (
          <Link key={href} href={href} className="group block">
            <span className="block text-xs font-bold text-slate-500">{label}</span>
            <span className="mt-1 block text-sm font-bold leading-6 text-slate-900 underline decoration-slate-300 underline-offset-4 group-hover:text-teal-800">{text}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}

function SummaryFact({ term, children }: { term: string; children: ReactNode }) {
  return (
    <div>
      <dt className="text-xs font-bold text-teal-800">{term}</dt>
      <dd className="mt-2 text-sm font-semibold leading-6 text-slate-800">{children}</dd>
    </div>
  );
}

function Chapter({ id, number, title, children }: { id: string; number: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-slate-400 py-12 first:border-t-0 first:pt-0 md:py-16">
      <header className="mb-8 grid grid-cols-[3rem_1fr] items-baseline gap-4">
        <span className="text-sm font-black text-teal-800">{number}</span>
        <h2 className="text-2xl font-black tracking-normal text-slate-950 md:text-3xl">{title}</h2>
      </header>
      {children}
    </section>
  );
}

function EditorialLabel({ children }: { children: ReactNode }) {
  return <p className="text-xs font-black tracking-[0.14em] text-slate-500">{children}</p>;
}

function OriginalAnswer() {
  return (
    <section aria-labelledby="original-answer-title" className="border-l-2 border-slate-400 pl-5 md:pl-7">
      <p id="original-answer-title" className="text-xs font-black tracking-[0.14em] text-slate-500">復元答案</p>
      <p className="mt-2 text-xs leading-6 text-slate-500">試験後に作成した記録。表現は整えず、判読できた内容を掲載しています。</p>
      <div className="mt-7 space-y-9">
        {originalAnswer.map((part) => (
          <section key={part.title}>
            <h3 className="text-base font-bold leading-7 text-slate-950">{part.title}</h3>
            <div className="mt-4 space-y-3 text-sm leading-7 text-slate-700">
              {part.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
          </section>
        ))}
      </div>
    </section>
  );
}

function EditorialReviewPoint({ index, point }: { index: number; point: ReviewPointData }) {
  return (
    <section className="py-8 first:pt-0 last:pb-0">
      <p className="text-[0.6875rem] font-black tracking-[0.16em] text-teal-800">REVIEW {String(index).padStart(2, "0")}</p>
      <h3 className="mt-2 text-xl font-bold text-slate-950">{point.title}</h3>
      <dl className="mt-5 grid gap-x-6 gap-y-4 sm:grid-cols-2">
        <ReviewTerm label="良い点">{point.good}</ReviewTerm>
        <ReviewTerm label="不足">{point.but}</ReviewTerm>
        <ReviewTerm label="理由">{point.why}</ReviewTerm>
        <ReviewTerm label="改善">{point.better}</ReviewTerm>
      </dl>
    </section>
  );
}

function ReviewTerm({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <dt className="text-xs font-bold text-slate-500">{label}</dt>
      <dd className="mt-1 text-sm leading-7 text-slate-700">{children}</dd>
    </div>
  );
}

function WorkbookStep({ number, title, prompt, id, children }: { number: string; title: string; prompt: string; id: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-slate-300 py-12 first:border-t-0 first:pt-0 md:py-16">
      <header className="mb-8">
        <p className="text-xs font-black tracking-[0.14em] text-teal-800">STEP {number}</p>
        <h2 className="mt-2 text-2xl font-black text-slate-950 md:text-3xl">{title}</h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">この段階で見ること：{prompt}</p>
      </header>
      {children}
    </section>
  );
}

function WorkbookReviewPoint({ index, point }: { index: number; point: ReviewPointData }) {
  return (
    <section aria-labelledby={`workbook-review-${index}`} className="border-l-2 border-slate-300 pl-5">
      <p className="text-[0.6875rem] font-black tracking-[0.14em] text-teal-800">確認 {index}</p>
      <h3 id={`workbook-review-${index}`} className="mt-2 text-lg font-bold">{point.title}</h3>
      <dl className="mt-4 space-y-4">
        <ReviewTerm label="残す">{point.good}</ReviewTerm>
        <ReviewTerm label="直す">{point.but}</ReviewTerm>
        <ReviewTerm label="なぜ">{point.why}</ReviewTerm>
        <ReviewTerm label="こう書く">{point.better}</ReviewTerm>
      </dl>
    </section>
  );
}

function CheckNote({ title, children }: { title: string; children: ReactNode }) {
  return (
    <aside className="mt-7 border-l-2 border-amber-500 pl-4">
      <p className="text-xs font-bold text-slate-900">{title}</p>
      <p className="mt-2 text-sm leading-7 text-slate-600">{children}</p>
    </aside>
  );
}

function ConceptFigure({ variant }: { variant: PrototypeVariant }) {
  return (
    <figure className={`mt-12 border-y border-slate-300 py-8 ${variant === "b" ? "bg-white px-4 sm:px-6" : ""}`}>
      <figcaption>
        <p className="text-xs font-black tracking-[0.14em] text-teal-800">概念図</p>
        <h3 className="mt-2 text-xl font-bold text-slate-950">特性要因図だけでは、真因は証明できない</h3>
      </figcaption>
      <div className="mt-7" role="img" aria-label="特性要因図で原因候補を仮説として整理し、データで検証して真因を判断し、改善する流れ">
        {conceptStages.map(([number, title, description], index) => (
          <div key={number} className="contents">
            <div className="grid grid-cols-[2.25rem_1fr] gap-3 py-3 sm:grid-cols-[3rem_1fr]">
              <span className="pt-0.5 text-xs font-black text-teal-800">{number}</span>
              <div>
                <p className="text-sm font-bold text-slate-950">{title}</p>
                <p className="mt-1 text-xs leading-5 text-slate-500">{description}</p>
              </div>
            </div>
            {index < conceptStages.length - 1 ? <div aria-hidden="true" className="pl-3 text-lg leading-none text-slate-300">↓</div> : null}
          </div>
        ))}
      </div>
      <p className="mt-7 border-l-2 border-teal-600 pl-4 text-sm font-bold leading-7 text-slate-800">特性要因図は真因そのものではなく、検証すべき仮説を整理するために使います。</p>
    </figure>
  );
}

function AnswerFrameList({ variant }: { variant: PrototypeVariant }) {
  return (
    <ol className={`mt-6 divide-y divide-slate-300 border-y border-slate-300 ${variant === "b" ? "bg-white px-4 sm:px-6" : ""}`}>
      {answerFrame.map(([title, description], index) => (
        <li key={title} className="grid grid-cols-[2.25rem_1fr] gap-3 py-5 sm:grid-cols-[3rem_1fr] sm:gap-5">
          <span className="text-sm font-black text-teal-800">{String(index + 1).padStart(2, "0")}</span>
          <div>
            <h3 className="text-base font-bold text-slate-950">{title}</h3>
            <p className="mt-1 text-sm leading-7 text-slate-600">{description}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

function ReferenceAnswer({ variant }: { variant: PrototypeVariant }) {
  return (
    <section className={`mt-12 border-l-2 border-teal-600 pl-5 md:pl-7 ${variant === "b" ? "bg-white py-1 pr-4 sm:pr-6" : ""}`} aria-labelledby={`reference-answer-${variant}`}>
      <p className="text-xs font-black tracking-[0.14em] text-teal-800">N-IE LAB 参考解答</p>
      <h3 id={`reference-answer-${variant}`} className="mt-2 text-xl font-bold text-slate-950">復元答案の直接性を残し、検証まで補う</h3>
      <p className="mt-2 text-xs leading-6 text-slate-500">試験後の検討を反映した参考解答・569字。唯一の正解ではありません。</p>
      <div className="mt-6 space-y-4 text-sm leading-7 text-slate-700">
        {referenceAnswer.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      </div>
    </section>
  );
}

function RelatedReading({ variant }: { variant: PrototypeVariant }) {
  return (
    <div className={`divide-y divide-slate-300 border-y border-slate-300 ${variant === "b" ? "bg-white px-4 sm:px-6" : ""}`}>
      {relatedKnowledge.map((item) => (
        <Link key={item.href} href={item.href} className="group grid gap-1 py-5 sm:grid-cols-[1fr_auto] sm:items-center sm:gap-6">
          <span>
            <span className="block text-base font-bold text-slate-950 group-hover:text-teal-800">{item.title}</span>
            <span className="mt-1 block text-sm leading-6 text-slate-600">{item.description}</span>
          </span>
          <span aria-hidden="true" className="text-sm font-bold text-teal-700">読む →</span>
        </Link>
      ))}
    </div>
  );
}
