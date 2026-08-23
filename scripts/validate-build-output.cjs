'use strict';

const fs = require('fs');
const path = require('path');

const EXPECTED_PRERENDER_ROUTES = 249;
const PAGE_DATA_LIMIT = 128000;
const REVIEW_SLUGS = [
  '2026-required-i-2-answer-review',
  '2026-ii-1-4-answer-review',
  '2026-ii-2-2-answer-review',
  '2026-iii-1-answer-review',
];
const DRAFT_ROUTE = '/guides/engineer/production-modes';

function readJson(file) {
  return JSON.parse(fs.readFileSync(path.join(process.cwd(), file), 'utf8'));
}

function main() {
  const prerender = readJson('.next/prerender-manifest.json');
  const routes = Object.keys(prerender.routes);
  const failures = [];
  const pageData = {};

  if (routes.length !== EXPECTED_PRERENDER_ROUTES) failures.push(`prerenderRoutes=${routes.length}`);
  if (routes.includes(DRAFT_ROUTE)) failures.push(`draft route generated=${DRAFT_ROUTE}`);

  for (const slug of REVIEW_SLUGS) {
    const route = `/guides/engineer/${slug}`;
    const file = path.join(process.cwd(), '.next', 'server', 'pages', 'guides', 'engineer', `${slug}.json`);
    if (!routes.includes(route)) failures.push(`missing route=${route}`);
    if (!fs.existsSync(file)) {
      failures.push(`missing page data=${route}`);
      continue;
    }
    const bytes = fs.statSync(file).size;
    pageData[route] = bytes;
    if (bytes >= PAGE_DATA_LIMIT) failures.push(`page data ${route}=${bytes}`);
  }

  const sitemapSource = fs.readFileSync(path.join(process.cwd(), 'pages', 'sitemap.xml.tsx'), 'utf8');
  if (sitemapSource.includes('/prototypes/engineer-answer-review')) {
    failures.push('prototype is hard-coded into sitemap source');
  }

  if (failures.length) {
    console.error(`Build output validation failed: ${failures.join(', ')}`);
    process.exit(1);
  }

  console.log(JSON.stringify({
    prerenderRoutes: routes.length,
    staticPageBaseline: 266,
    pageData,
    draftGenerated: false,
    prototypeInSitemapSource: false,
  }, null, 2));
}

main();
