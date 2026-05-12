const fs = require('fs');

const data = JSON.parse(
  fs.readFileSync('public/data/engineer/past-exam-questions.json', 'utf8'),
);

const years = [
  { year: 2019, era: '令和元年度' },
  { year: 2020, era: '令和2年度' },
  { year: 2021, era: '令和3年度' },
  { year: 2022, era: '令和4年度' },
  { year: 2023, era: '令和5年度' },
  { year: 2024, era: '令和6年度' },
  { year: 2025, era: '令和7年度' },
];

const fields = [
  { label: '生産・物流マネジメント', code: '1501' },
  { label: 'サービスマネジメント', code: '1502' },
];

const requiredFields = [
  'id',
  'year',
  'eraYear',
  'subjectType',
  'field',
  'fieldCode',
  'questionNumber',
  'officialPdfUrl',
  'sourcePdfUrl',
  'sourceChecked',
  'officialSourceLabel',
  'summary',
  'questionPattern',
  'requiredActions',
  'themeTags',
  'methodTags',
  'policyTags',
  'lawTags',
  'answerFrameType',
  'skeletonTemplateId',
  'assessedCompetencies',
];

function expectedRows() {
  const rows = [];
  for (const { year, era } of years) {
    for (const questionNumber of ['I-1', 'I-2']) {
      rows.push({ year, era, subjectType: '必須科目Ⅰ', field: '共通', questionNumber });
    }
    for (const { label } of fields) {
      for (const questionNumber of ['II-1-1', 'II-1-2', 'II-1-3', 'II-1-4']) {
        rows.push({ year, era, subjectType: '選択科目Ⅱ-1', field: label, questionNumber });
      }
      for (const questionNumber of ['II-2-1', 'II-2-2']) {
        rows.push({ year, era, subjectType: '選択科目Ⅱ-2', field: label, questionNumber });
      }
      for (const questionNumber of ['III-1', 'III-2']) {
        rows.push({ year, era, subjectType: '選択科目Ⅲ', field: label, questionNumber });
      }
    }
  }
  return rows;
}

function isEmpty(value) {
  return (
    value == null ||
    value === '' ||
    (Array.isArray(value) && value.length === 0) ||
    value === false
  );
}

const questions = data.questions || [];
const actual = new Set(
  questions.map((q) => `${q.year}|${q.subjectType}|${q.field}|${q.questionNumber}`),
);
const duplicateIds = questions
  .map((q) => q.id)
  .filter((id, index, ids) => ids.indexOf(id) !== index);
const duplicateKeys = questions
  .map((q) => `${q.year}|${q.subjectType}|${q.field}|${q.questionNumber}`)
  .filter((key, index, keys) => keys.indexOf(key) !== index);
const missing = expectedRows().filter(
  (row) => !actual.has(`${row.year}|${row.subjectType}|${row.field}|${row.questionNumber}`),
);
const incomplete = questions
  .map((q) => ({
    id: q.id,
    missing: requiredFields.filter((field) => isEmpty(q[field])),
  }))
  .filter((row) => row.missing.length > 0);

const invalidFieldCodes = questions.filter((q) => {
  if (q.field === '共通') return q.fieldCode !== 'common';
  const expected = fields.find((field) => field.label === q.field);
  return !expected || q.fieldCode !== expected.code;
});

if (
  missing.length ||
  incomplete.length ||
  invalidFieldCodes.length ||
  duplicateIds.length ||
  duplicateKeys.length
) {
  console.error(
    JSON.stringify(
      {
        expected: expectedRows().length,
        actual: questions.length,
        missing,
        incomplete,
        duplicateIds,
        duplicateKeys,
        invalidFieldCodes: invalidFieldCodes.map((q) => q.id),
      },
      null,
      2,
    ),
  );
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      expected: expectedRows().length,
      actual: questions.length,
      missing: 0,
      incomplete: 0,
      duplicateIds: 0,
      duplicateKeys: 0,
      fieldCode: 'ok',
    },
    null,
    2,
  ),
);
