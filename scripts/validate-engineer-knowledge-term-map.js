const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const mapPath = path.join(root, 'public', 'data', 'engineer', 'knowledge-term-map.json');
const examPath = path.join(root, 'public', 'data', 'engineer', 'past-exam-questions.json');

const terms = JSON.parse(fs.readFileSync(mapPath, 'utf8'));
const examData = JSON.parse(fs.readFileSync(examPath, 'utf8'));
const questions = Array.isArray(examData) ? examData : examData.questions;
const errors = [];

const normalize = (value) => String(value ?? '').trim();

function guideUrlExists(url) {
  const match = /^\/guides\/(qc|stat|engineer)(?:\/([^/?#]+))?$/.exec(url);
  if (!match) return false;
  if (!match[2]) return fs.existsSync(path.join(root, 'pages', 'guides', '[exam]', 'index.tsx'));

  return ['mdx', 'md'].some((extension) =>
    fs.existsSync(path.join(root, 'content', 'guides', match[1], `${match[2]}.${extension}`)),
  );
}

function buildResolver(items) {
  const resolver = new Map();

  for (const term of items) {
    const href = normalize(term.knowledgeUrl);
    if (!href) continue;

    for (const rawAlias of [term.canonicalTerm, ...(term.aliases ?? [])]) {
      const alias = normalize(rawAlias);
      if (!alias) continue;
      resolver.set(alias, { canonicalTerm: term.canonicalTerm, href });
    }
  }

  return resolver;
}

if (!Array.isArray(terms)) errors.push('knowledge-term-map must be an array.');
if (!Array.isArray(questions)) errors.push('past-exam questions must be an array.');

const canonicalOwners = new Map();
const aliasOwners = new Map();
let rawAliasEntries = 0;
let withUrl = 0;
let withoutUrl = 0;

for (const [index, term] of terms.entries()) {
  const canonical = normalize(term.canonicalTerm);
  if (!canonical) {
    errors.push(`entry ${index} has an empty canonicalTerm.`);
    continue;
  }

  if (canonicalOwners.has(canonical)) {
    errors.push(`duplicate canonical term: ${canonical}`);
  } else {
    canonicalOwners.set(canonical, index);
  }

  const href = normalize(term.knowledgeUrl);
  if (href) {
    withUrl += 1;
    if (!guideUrlExists(href)) errors.push(`canonical URL does not exist: ${canonical} -> ${href}`);
  } else {
    withoutUrl += 1;
  }

  const aliases = Array.isArray(term.aliases) ? term.aliases : [];
  rawAliasEntries += aliases.length;
  const aliasesWithinTerm = new Set();
  for (const rawAlias of aliases) {
    const alias = normalize(rawAlias);
    if (aliasesWithinTerm.has(alias)) errors.push(`duplicate alias in ${canonical}: ${alias}`);
    aliasesWithinTerm.add(alias);
  }

  for (const rawAlias of [canonical, ...aliases]) {
    const alias = normalize(rawAlias);
    if (!alias) {
      errors.push(`empty alias in: ${canonical}`);
      continue;
    }

    const owner = aliasOwners.get(alias);
    if (owner && owner !== canonical) {
      errors.push(`alias collision: ${alias} -> ${owner}, ${canonical}`);
    } else {
      aliasOwners.set(alias, canonical);
    }
  }
}

const resolver = buildResolver(terms);
const expected = {
  KPI: '/guides/engineer/kpi-management',
  SCM: '/guides/engineer/scm',
  'S&OP': '/guides/engineer/s-and-op',
  SOP: '/guides/engineer/s-and-op',
  MIP: '/guides/engineer/linear-programming',
  APS: '/guides/engineer/scheduling',
  GT: '/guides/engineer/group-technology',
  'グループテクノロジー': '/guides/engineer/group-technology',
};

for (const [alias, href] of Object.entries(expected)) {
  if (resolver.get(normalize(alias))?.href !== href) {
    errors.push(`representative term did not resolve: ${alias} -> ${href}`);
  }
}

if (resolver.has('__unknown_knowledge_term__')) {
  errors.push('unknown term unexpectedly resolved.');
}

const urlLessResolver = buildResolver([
  ...terms,
  {
    canonicalTerm: '__url_less_test__',
    aliases: ['__url_less_alias__'],
    knowledgeUrl: null,
  },
]);
if (urlLessResolver.has('__url_less_test__') || urlLessResolver.has('__url_less_alias__')) {
  errors.push('URL-less term unexpectedly generated a link.');
}

const examKeywords = Array.from(
  new Set(
    questions.flatMap((question) => [
      ...(Array.isArray(question.themeTags) ? question.themeTags : []),
      ...(Array.isArray(question.methodTags) ? question.methodTags : []),
    ]),
  ),
).sort((a, b) => a.localeCompare(b, 'ja'));
const unresolved = examKeywords.filter((keyword) => !resolver.has(normalize(keyword)));

const report = {
  canonicalTerms: terms.length,
  aliases: rawAliasEntries,
  resolverKeys: resolver.size,
  knowledgeUrlPresent: withUrl,
  knowledgeUrlMissing: withoutUrl,
  examKeywords: examKeywords.length,
  resolvedExamKeywords: examKeywords.length - unresolved.length,
  unresolvedTerms: unresolved.length,
  collisions: errors.filter((error) => error.startsWith('alias collision:')).length,
};

console.log(JSON.stringify(report, null, 2));
if (unresolved.length > 0) console.log(`Unresolved terms (tags only): ${unresolved.join(', ')}`);

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('Knowledge term map audit passed.');
