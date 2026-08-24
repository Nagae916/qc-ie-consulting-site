'use strict';

const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');

const EXPECTED_DOCUMENTS = 239;
const EXPECTED_PUBLISHED = 238;
const EXPECTED_EXAM_QUESTIONS = 130;
const REVIEW_URLS = [
  '/guides/engineer/2026-required-i-2-answer-review',
  '/guides/engineer/2026-ii-1-4-answer-review',
  '/guides/engineer/2026-ii-2-2-answer-review',
  '/guides/engineer/2026-iii-1-answer-review',
];
const DRAFT_URL = '/guides/engineer/production-modes';

async function main() {
  const generatedPath = path.join(process.cwd(), '.contentlayer', 'generated', 'index.mjs');
  const { allGuides } = await import(pathToFileURL(generatedPath).href);
  const published = allGuides.filter((guide) => guide.status === 'published');
  const questions = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'public', 'data', 'engineer', 'past-exam-questions.json'), 'utf8'),
  ).questions;

  const failures = [];
  if (allGuides.length !== EXPECTED_DOCUMENTS) failures.push(`documents=${allGuides.length}`);
  if (published.length !== EXPECTED_PUBLISHED) failures.push(`published=${published.length}`);
  if (questions.length !== EXPECTED_EXAM_QUESTIONS) failures.push(`examQuestions=${questions.length}`);

  const publishedUrls = new Set(published.map((guide) => guide.url));
  for (const url of REVIEW_URLS) {
    if (!publishedUrls.has(url)) failures.push(`missing review=${url}`);
  }
  if (publishedUrls.has(DRAFT_URL)) failures.push(`draft published=${DRAFT_URL}`);

  if (failures.length) {
    console.error(`Generated output validation failed: ${failures.join(', ')}`);
    process.exit(1);
  }

  console.log(JSON.stringify({
    contentlayerDocuments: allGuides.length,
    publishedGuides: published.length,
    examQuestions: questions.length,
    reviewRoutes: REVIEW_URLS.length,
    draftPublished: false,
  }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
