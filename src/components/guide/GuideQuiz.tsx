'use client';

import React, { useState } from 'react';

type QuizQuestion = {
  level?: 'basic' | 'standard';
  question: string;
  choices: string[];
  answer: number;
  explanation: string;
};

type Props = {
  title?: string;
  questions: QuizQuestion[];
};

export default function GuideQuiz({ title = '理解度チェック', questions }: Props) {
  const [selected, setSelected] = useState<Record<number, number>>({});

  return (
    <section className="guide-quiz" aria-label={title}>
      <div className="guide-quiz__header">
        <p className="guide-kicker">CHECK</p>
        <h2>{title}</h2>
        <p>最後に2問だけ確認しましょう。選択すると、正誤と短い解説が表示されます。</p>
      </div>

      <div className="guide-quiz__list">
        {questions.map((q, qi) => {
          const chosen = selected[qi];
          const answered = typeof chosen === 'number';
          const correct = answered && chosen === q.answer;

          return (
            <div className="guide-quiz__item" key={`${q.question}-${qi}`}>
              <div className="guide-quiz__meta">
                <span>{q.level === 'standard' ? '中程度' : '基本'}</span>
                <strong>Q{qi + 1}</strong>
              </div>
              <h3>{q.question}</h3>
              <div className="guide-quiz__choices">
                {q.choices.map((choice, ci) => {
                  const isChosen = chosen === ci;
                  const isAnswer = q.answer === ci;
                  const stateClass = !answered
                    ? ''
                    : isAnswer
                    ? 'is-correct'
                    : isChosen
                    ? 'is-wrong'
                    : '';

                  return (
                    <button
                      type="button"
                      key={choice}
                      className={stateClass}
                      onClick={() => setSelected((prev) => ({ ...prev, [qi]: ci }))}
                    >
                      {choice}
                    </button>
                  );
                })}
              </div>
              {answered ? (
                <div className={correct ? 'guide-quiz__answer is-correct' : 'guide-quiz__answer is-wrong'}>
                  <strong>{correct ? '正解です' : 'もう一歩です'}</strong>
                  <p>{q.explanation}</p>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
