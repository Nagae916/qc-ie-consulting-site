# Windows / Linux reproducible build audit

## 1. Scope and baseline

- Baseline commit: `a31f2ae92f82e245b58fdf77b261276a5dc0504e`
- Branch: `chore/reproducible-build-ci`
- Node.js: 24.x
- Next.js: 15.5.22
- Contentlayer2 / next-contentlayer2: 0.5.8
- Expected Contentlayer documents: 239
- Expected published guides: 238
- Expected static pages shown by Next.js: 266
- Expected engineer exam questions: 130

This work changes the validation and checkout boundary only. Public copy, design, navigation, URLs, metadata content, dependencies, `package-lock.json`, canonical policy, and sitemap policy are unchanged.

## 2. Root cause

The repository had no `.gitattributes` or `.editorconfig`, while the Windows checkout used `core.autocrlf=true`. The Git index stored guide files with LF, but Windows materialized some of them with CRLF.

Contentlayer2 reads a file through `gray-matter` and passes the extracted YAML string to `yaml.parse`. `gray-matter` locates the closing fence with `\n---`. For a CRLF document, the final `\r` before that delimiter remains at the end of the YAML string. When the final frontmatter value is a quoted scalar, `yaml.parse` reports `Unexpected scalar at node end`. Contentlayer's default `skip-warn` behavior then skips the document but can still exit successfully.

The application-level `normalizeGuideStatus` and boolean normalization execute only after YAML parsing. They can normalize `draft\r`, whitespace, and BOM at a field boundary, but they cannot repair a document that failed before a Contentlayer document was created. The former unit test called those post-parse helpers directly, so it passed while a real build skipped documents.

Before the fix, the Windows build reproduced this failure and generated 229 Contentlayer documents and 256 static pages instead of 239 and 266. No tracked bytes changed during that build, but a successful process exit did not prove complete content generation.

## 3. Previously normalized five files

The prior release process temporarily converted these files to LF and restored their original bytes after build:

1. `content/guides/engineer/2026-required-i-2-answer-review.mdx`
2. `content/guides/engineer/2026-ii-1-4-answer-review.mdx`
3. `content/guides/engineer/2026-ii-2-2-answer-review.mdx`
4. `content/guides/engineer/2026-iii-1-answer-review.mdx`
5. `content/guides/engineer/past-exam-trend-map.mdx`

At baseline, all five were UTF-8 without BOM, had CRLF in the Windows worktree, and ended with a newline. Their index blobs were already LF. LF/CRLF-insensitive comparison showed no title, frontmatter, body, formula, or MDX syntax difference.

The Contentlayer-compatible parser also found five existing Knowledge documents with the same terminal-scalar failure on this checkout:

- `content/guides/engineer/group-technology.mdx`
- `content/guides/engineer/kpi-management.mdx`
- `content/guides/engineer/linear-programming.mdx`
- `content/guides/engineer/scheduling.mdx`
- `content/guides/engineer/scm.mdx`

The parser failure total was therefore exactly 10, not more than the task stop threshold. Twenty-one guide worktree files contained CR or mixed line endings, but their Git index content was already LF. Applying the checkout policy created zero committed content-file diffs.

## 4. Adopted source policy

- `.gitattributes` makes `content/guides/**` LF on every checkout.
- `.editorconfig` declares UTF-8, LF, and a final newline for editors.
- `check:source-format` rejects BOM, CR/CRLF, and a missing final LF before Contentlayer runs.
- `check:frontmatter` uses the same `gray-matter` and `yaml.parse` boundary as Contentlayer2.
- Contentlayer is configured to fail for unknown or missing/incompatible documents instead of silently skipping them.
- A file-level BOM is rejected at the source boundary. BOM and whitespace inside an enum value remain handled by the existing enum normalization.

This removes temporary LF conversion, backup files, and byte restoration from the build process. No runtime content normalizer was added.

## 5. Non-destructive MDX safety check

The previous `guard-mdx.js` could remove special characters, repair malformed fences, append a final newline, and then write every guide file during `prebuild`. It also caught errors and continued.

The new behavior is split:

- `check:mdx-safety`: read-only; reports files that need repair and exits non-zero.
- `fix:mdx-safety`: explicit write command; never called by `dev`, `build`, `check`, or `check:ci`.

Read failures now fail the command. The validation runner hashes every tracked source file and compares `git status` before and after its work.

## 6. Frontmatter integration coverage

The test suite now covers the actual parser boundary and verifies:

- LF parsing with a terminal quoted scalar
- the known CRLF terminal-scalar failure
- file-level BOM rejection
- boundary whitespace and field-level BOM normalization
- `published`, `draft`, and the missing-status legacy default
- valid and invalid boolean values
- unknown status rejection and fail-safe non-public behavior
- a missing closing YAML fence
- body preservation after parsing

## 7. Validation flow

Before this change, GitHub CI ran typecheck, lint, and build separately on Ubuntu. It did not run frontmatter integration tests, source-format checks, the MDX safety guard as a read-only check, route/duplicate/guide/Knowledge audits, engineer exam coverage, output counts, or a tracked-source mutation check. `lint:fast` also passed unsupported `--cache`, so `check:fast` was unusable. The Quality workflow duplicated typecheck while running unused-code and dependency checks as advisory checks.

After this change:

- `npm run check:ci` is the full Ubuntu/local production validation entrypoint.
- `npm run check:cross-platform` is the Windows content-generation entrypoint.
- `lint:fast` uses the supported Next.js CLI options.
- `check:engineer-exams` formally registers the 130-question coverage audit.
- Next.js performs the production Contentlayer generation once; an extra pre-build generation was removed.
- `CI / check` keeps its existing job name and runs `check:ci`.
- `CI / windows-content` checks LF/BOM/frontmatter safety, generates Contentlayer data, validates 239/238/130 counts, and runs generated-data audits on Windows.
- `Quality / scan` keeps the existing advisory unused-code, unused-export, dependency, and circular-reference policy without duplicating typecheck.

## 8. Windows results

`npm ci` completed from the unchanged lockfile. The dependency audit result remained 44 findings (1 low, 29 moderate, 14 high); dependency remediation is outside this task.

The following passed on Windows:

- `npm run check:cross-platform`
- `npm run check:ci`
- two consecutive `npm run build` executions
- route, duplicate URL, guide, Knowledge map, and engineer exam coverage audits
- local HTTP checks for the four reviews, sitemap, robots, draft exclusion, and Prototype sitemap exclusion

Measured output:

| Metric | Result |
|---|---:|
| Contentlayer documents | 239 |
| Published guides | 238 |
| Next.js static pages | 266 |
| Prerender manifest routes | 249 |
| Engineer exam metadata | 130 |
| Guide route First Load JS | 145 kB |
| Shared First Load JS | 103 kB |

Review page data:

| Review | Bytes | Under 128,000 bytes |
|---|---:|---:|
| Required I-2 | 125,020 | Yes |
| II-1-4 | 114,067 | Yes |
| II-2-2 | 114,292 | Yes |
| III-1 | 126,476 | Yes |

Both consecutive builds produced the same staged-patch SHA-256, `ee6f973842c0311020338183645a03e73e78feb7`, and zero unstaged tracked-file changes. No backup or temporary source file remained.

Local HTTP verification returned 200 for all four review pages, `/sitemap.xml`, and `/robots.txt`; the draft `production-modes` route returned 404. Sitemap contained all four reviews and contained neither the draft route nor the Prototype route.

## 9. Linux and Preview verification

The branch workflow runs the same production entrypoint on Ubuntu and the cross-platform content entrypoint on Windows. The checks use fixed 239-document, 238-published-guide, 266-static-page, 249-prerender-route, and 130-question baselines so an OS-specific skip fails the workflow.

GitHub Actions run `32644638247` completed successfully for both `check` (Ubuntu) and `windows-content` (Windows). Existing `Quality / scan` run `32644638249` also completed successfully. Passing both OS jobs confirms the same 239-document and 238-published-guide baselines; Ubuntu also confirmed the 266-page production build.

Vercel Preview `https://qc-ie-consulting-site-ej9ygbc4j-nagae916s-projects.vercel.app` built commit `46cd47b` on Linux and reached Ready. Its build log recorded 239 Contentlayer documents, 266 static pages, and 146 kB First Load JS for the guide route. Authenticated `vercel curl` returned 200 for the four review pages, sitemap, and robots, and 404 for the draft route. The Preview sitemap contained all four reviews and contained neither the draft route nor the Prototype route.

## 10. Existing warnings and deferred work

The following existing warnings are not regressions from this work:

- Contentlayer's Windows support notice
- Browserslist data age notice
- multiple-lockfile workspace-root inference notice
- existing page-data warnings for `/guides/qc/oc-curve` and `/guides/engineer/keyword-priority-100` (which one is printed can vary with static generation order)
- existing npm audit findings

Separate tasks remain for dependency/security review, page-data optimization, Analytics, Search Console, and the contact path. This task does not change those areas.

## 11. Protected Defaults

Brand, target readers, the four themes, qualification placement, public content, URLs, canonical behavior, sitemap policy, design, Pages Router, dependencies, and Production remain unchanged.
