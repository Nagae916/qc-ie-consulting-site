import type React from "react";

type Status = "published" | "planned";

type ExamSubject = {
  title: string;
  ability: string;
  answerPattern: string;
  sitePages: string;
};

type FlowStep = {
  step: string;
  title: string;
  description: string;
  href?: string;
  status: Status;
};

type ResourceLink = {
  title: string;
  description: string;
  href?: string;
  status: Status;
};

const subjects: ExamSubject[] = [
  {
    title: "必須科目Ⅰ",
    ability: "社会的背景から課題を抽出し、解決策、リスク、倫理まで構造化する力。",
    answerPattern: "課題3つ、最重要課題、解決策、施策後リスク、技術者倫理・持続可能性。",
    sitePages: "過去問トレンドマップ、課題分解マトリクス、答案骨子ビルダー",
  },
  {
    title: "選択科目Ⅱ-1",
    ability: "専門用語や手法を短く正確に説明する力。",
    answerPattern: "定義、目的、使いどころ、留意点を簡潔にまとめる。",
    sitePages: "経営工学 学習マップ、個別テーマガイド",
  },
  {
    title: "選択科目Ⅱ-2",
    ability: "実務手順、留意点、工夫点を具体的に整理する力。",
    answerPattern: "手順、関係者、留意点、成果確認を実務の流れで書く。",
    sitePages: "生産管理・品質管理・IEの個別テーマガイド",
  },
  {
    title: "選択科目Ⅲ",
    ability: "専門領域の課題解決と将来展望を、広い視点で整理する力。",
    answerPattern: "背景、課題、解決策、リスク、将来展望を一貫して述べる。",
    sitePages: "過去問トレンドマップ、白書・法令アップデートボード",
  },
];

const flowSteps: FlowStep[] = [
  {
    step: "Step 1",
    title: "過去問トレンドマップで出題傾向を確認する",
    description: "年度、科目、テーマ、設問パターンを見て、頻出論点と問い方を把握します。",
    href: "/guides/engineer/past-exam-trend-map",
    status: "published",
  },
  {
    step: "Step 2",
    title: "必須Ⅰ型の例題を作る",
    description: "過去問傾向から、本番に近い問題文やテーマを選び、演習対象を作ります。",
    href: "/guides/engineer/problem-matrix",
    status: "published",
  },
  {
    step: "Step 3",
    title: "課題分解マトリクスで課題を3つ抽出する",
    description: "複数の観点から課題候補を広げ、最重要課題を理由付きで選びます。",
    href: "/guides/engineer/issue-decomposition-matrix",
    status: "published",
  },
  {
    step: "Step 4",
    title: "答案骨子ビルダーで解決策・リスク・倫理まで整理する",
    description: "課題、解決策、リスク、倫理、持続可能性を答案の骨格に落とし込みます。",
    href: "/guides/engineer/answer-structure-builder",
    status: "published",
  },
  {
    step: "Step 5",
    title: "白書・法令アップデートで背景情報を補強する",
    description: "政策、法令、白書の一次情報を使って、課題設定と解決策の説得力を高めます。",
    status: "planned",
  },
];

const requiredSubjectPolicy = [
  "課題3つを多面的に抽出する",
  "最重要課題を理由付きで選ぶ",
  "解決策を具体化する",
  "施策後リスクと対策を書く",
  "技術者倫理・社会の持続可能性をテーマ固有に書く",
];

const selectedSubjectPolicy = [
  { title: "Ⅱ-1", description: "用語・手法を短く説明する。" },
  { title: "Ⅱ-2", description: "手順・留意点・工夫点を整理する。" },
  { title: "Ⅲ", description: "専門領域における課題解決・将来展望を整理する。" },
];

const resourceLinks: ResourceLink[] = [
  {
    title: "過去問トレンドマップ",
    description: "年度・科目・テーマ・設問パターンから、演習すべき論点を選びます。",
    href: "/guides/engineer/past-exam-trend-map",
    status: "published",
  },
  {
    title: "課題分解マトリクス",
    description: "課題を多面的に広げ、最重要課題を選ぶ練習に使います。",
    href: "/guides/engineer/issue-decomposition-matrix",
    status: "published",
  },
  {
    title: "答案骨子ビルダー",
    description: "解決策、リスク、倫理まで一貫した答案骨子に整えます。",
    href: "/guides/engineer/answer-structure-builder",
    status: "published",
  },
  {
    title: "経営工学 学習マップ",
    description: "品質管理、生産管理、統計、技術士演習のつながりを確認します。",
    href: "/guides/engineer/learning-map",
    status: "published",
  },
  {
    title: "白書・法令アップデートボード",
    description: "答案背景に使う一次情報を整理するための入口です。",
    status: "planned",
  },
];

const reviewPoints = [
  "問題文は本番らしいか",
  "課題抽出は浅くないか",
  "解決策は最重要課題に対応しているか",
  "リスクは施策後の副作用になっているか",
  "倫理・持続可能性は具体的か",
  "講座テキスト・添削フィードバックと矛盾していないか",
];

const backLinks = [
  { title: "経営工学 学習マップ", href: "/guides/engineer/learning-map" },
  { title: "技術士第一次試験ロードマップ", href: "/guides/engineer/first-exam-roadmap" },
  { title: "トップページ", href: "/" },
];

function StatusBadge({ status }: { status: Status }) {
  if (status === "planned") {
    return <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-800">準備中</span>;
  }

  return <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-800">公開中</span>;
}

function MaybeLink({ item, children }: { item: ResourceLink | FlowStep; children: React.ReactNode }) {
  if (item.status === "planned" || !item.href) {
    return <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">{children}</div>;
  }

  return (
    <a href={item.href} className="block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-emerald-400 hover:shadow-md">
      {children}
    </a>
  );
}

export default function SecondExamRoadmap() {
  return (
    <div className="mx-auto max-w-7xl space-y-10 px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-semibold text-emerald-700">技術士二次試験の入口</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">技術士第二次試験ロードマップ</h1>
        <p className="mt-4 max-w-4xl text-base leading-8 text-slate-700">
          経営工学部門の第二次試験に向けて、過去問傾向の把握、例題生成、課題分解、答案骨子作成、白書・法令情報の活用までを段階的に整理するページです。
        </p>
      </section>

      <section className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm">
        <h2 className="text-xl font-bold">このページの位置づけ</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {[
            "第二次試験は知識の暗記ではなく、実務経験を課題・解決策・リスク・倫理へ構造化する試験です。",
            "本サイトでは、過去問傾向と答案骨子作成をつなげて学びます。",
            "ユーザー自身が実際に演習し、フィードバックしながら改善していく前提で使います。",
          ].map((item) => (
            <p key={item} className="rounded-xl border border-emerald-200 bg-white p-4 text-sm leading-7 text-slate-700">
              {item}
            </p>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">試験科目の全体像</h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {subjects.map((subject) => (
            <article key={subject.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-lg font-bold">{subject.title}</h3>
              <dl className="mt-4 space-y-3 text-sm leading-7">
                <div>
                  <dt className="font-bold text-slate-950">問われる力</dt>
                  <dd className="text-slate-700">{subject.ability}</dd>
                </div>
                <div>
                  <dt className="font-bold text-slate-950">答案の型</dt>
                  <dd className="text-slate-700">{subject.answerPattern}</dd>
                </div>
                <div>
                  <dt className="font-bold text-slate-950">本サイトで使うページ</dt>
                  <dd className="text-slate-700">{subject.sitePages}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">推奨学習フロー</h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {flowSteps.map((item) => (
            <MaybeLink key={item.step} item={item}>
              <div className="flex items-start justify-between gap-3">
                <span className="rounded-full bg-slate-900 px-2.5 py-1 text-xs font-bold text-white">{item.step}</span>
                <StatusBadge status={item.status} />
              </div>
              <h3 className="mt-4 text-base font-bold">{item.title}</h3>
              <p className="mt-2 text-sm leading-7 text-slate-700">{item.description}</p>
            </MaybeLink>
          ))}
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-2xl font-bold">必須科目Ⅰの学習方針</h2>
          <div className="mt-4 grid gap-3">
            {requiredSubjectPolicy.map((item) => (
              <p key={item} className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-slate-700">
                {item}
              </p>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-2xl font-bold">選択科目Ⅱ-1 / Ⅱ-2 / Ⅲの学習方針</h2>
          <div className="mt-4 grid gap-3">
            {selectedSubjectPolicy.map((item) => (
              <div key={item.title} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="font-bold text-slate-950">{item.title}</p>
                <p className="mt-2 text-sm leading-7 text-slate-700">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">重点的に使うページ</h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {resourceLinks.map((item) => (
            <MaybeLink key={item.title} item={item}>
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-base font-bold">{item.title}</h3>
                <StatusBadge status={item.status} />
              </div>
              <p className="mt-3 text-sm leading-7 text-slate-700">{item.description}</p>
            </MaybeLink>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-2xl font-bold">レビューの観点</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {reviewPoints.map((item) => (
            <p key={item} className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-7 text-slate-700">
              {item}
            </p>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">戻り導線</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {backLinks.map((link) => (
            <a key={link.href} href={link.href} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-emerald-400 hover:shadow-md">
              <span className="font-bold text-emerald-800">{link.title}</span>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
