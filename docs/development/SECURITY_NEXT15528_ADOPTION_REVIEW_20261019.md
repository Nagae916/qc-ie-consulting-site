# Next.js 15.5.28 Security Adoption Review (2026-10-19)

## 1. Scope and recommendation

This review compares the latest operations handoff at
`a4cd7a8db9bf2912c0e0b342c6a58b3c7643c7ba` with the dependency-only
Next.js candidate originally recorded at
`a8192600f5d6c09885a0cb31615dae60b32eb880`.

The candidate changes only `package.json` and `package-lock.json`. It updates
`next` and `eslint-config-next` from 15.5.22 to 15.5.28, together with the
matching `@next/*` and SWC packages. React 18, Pages Router, Contentlayer2,
application code, public content, URLs, and design remain unchanged.

**Recommendation:** adopt the dependency-only 15.5.28 update after the final
review-branch Preview is Ready and the owner accepts the residual risks below.
This recommendation is not authorization to merge or promote to Production.

The update removes two Critical and two Moderate Next.js advisories without a
local functional regression. It does not remove all existing High findings.
The residual findings are grouped by concrete dependency path and lifecycle;
they are not accepted merely because they are transitive or normally process
repository-controlled input.

## 2. Reproducible comparison conditions

| Item | Value |
| --- | --- |
| OS | Windows local environment |
| Node.js | `v24.18.1` |
| npm | `11.16.0` |
| Install | `npm.cmd ci --include=dev --no-audit --no-fund` |
| Force / legacy peer mode | Not used |
| Before lock | SHA-256 `1FEF89D0C69945B07F233D68A2EB18C9931FC0DBCEE97136A8478B14E0980CE9` |
| After lock | SHA-256 `5CC8BA6BF4E06F6487BDD8E5EF39E7EBA3A8BCA7669B2115C5387BB06467F862` |
| Audit commands | `npm audit --json`; `npm audit --omit=dev --json` |

The full audit and production-only audit were captured separately. npm's
severity totals count affected package nodes, not independent attack paths.
In this snapshot, the number of unique High advisory source IDs happens to
equal the High package count, but that equality must not be assumed in later
reviews.

| Scope | Before | After |
| --- | --- | --- |
| All dependencies | Critical 1 / High 45 / Moderate 26 / Low 5 / Total 77 | Critical 0 / High 45 / Moderate 27 / Low 5 / Total 77 |
| Production dependency graph | Critical 1 / High 19 / Moderate 24 / Low 5 / Total 49 | Critical 0 / High 19 / Moderate 25 / Low 5 / Total 49 |
| Unique High advisory IDs | 45 | 45 |
| Unique High advisory IDs also present in production audit | 19 | 19 |

The total counts remain unchanged because the package-node severity summary is
not a count of advisories fixed. The after snapshot no longer contains these
Next.js advisories:

| Source / advisory | Severity | Affected range | Result |
| --- | --- | --- | --- |
| 1193677 / [GHSA-p293-qw3h-jr36](https://github.com/advisories/GHSA-p293-qw3h-jr36) | Critical | `>=13.4.0 <15.5.24` | Fixed by 15.5.28 |
| 1193733 / [GHSA-2xp9-vwfh-vxw4](https://github.com/advisories/GHSA-2xp9-vwfh-vxw4) | Critical | `>=10.0.0 <15.5.24` | Fixed by 15.5.28 |
| 1241491 / [GHSA-4jqv-mc3x-m676](https://github.com/advisories/GHSA-4jqv-mc3x-m676) | Moderate | `>=15.0.0 <15.5.27` | Fixed by 15.5.28 |
| 1241494 / [GHSA-mcj8-r9mp-w47p](https://github.com/advisories/GHSA-mcj8-r9mp-w47p) | Moderate | `>=15.0.0 <15.5.27` | Fixed by 15.5.28 |

## 3. Residual High risk decisions

| Dependency path | Lifecycle and actual use | Reachability and current control | Decision and recheck condition |
| --- | --- | --- | --- |
| `next -> sharp@0.34.5` | Optional image processing dependency. The home page uses `next/image` with a local hero image. | No upload path or remote image pattern was found. The optimizer still exists and `sharp` cannot be called unreachable solely because the current source image is local. Function-trace exclusion was not proven. | **Additional investigation.** Keep local-only image inputs. Recheck before remote images, uploads, AVIF processing changes, or a Next.js release that supports a fixed sharp line. Do not force an out-of-range direct sharp dependency or override. |
| `next -> postcss@8.4.31` | Next build-time CSS processing. The root build dependency is separately `postcss@8.5.25`. | Current builds process repository CSS; there is no user/external CSS ingestion. A pull request can still change CSS and source maps, so CI build-time denial or file-read behavior is not dismissed as impossible. | **Conditional hold.** Do not override Next's declared dependency. Recheck on the next supported Next patch/major and before external CSS or untrusted source-map processing. |
| `next/postcss -> nanoid@3.3.17` | Internal PostCSS dependency. | Advisory requires a custom generator called with size zero; no such application call was found. | **Conditional hold.** Recheck with the parent PostCSS/Next update or if application code begins using custom nanoid generators. |
| `next/postcss and dev tooling -> source-map-js@1.2.1` | Build-time source-map parsing. | Repository and pull-request CSS/source maps can reach build tooling. Public runtime input cannot. A malicious pull request could still target CI availability. | **Conditional hold.** Keep fork PR secrets unavailable and require review. Recheck when Next/PostCSS exposes a compatible fixed version or CI begins processing external source maps. |
| `Contentlayer2 -> chokidar -> picomatch/braces` | Content discovery and watch/build patterns. | Fixed script patterns lower normal exposure, but pull requests can add crafted paths/content and can reach CI builds. | **Conditional hold.** Treat untrusted PR build DoS as residual risk. Recheck with a tested Contentlayer2 upgrade or replacement; do not bulk override matcher packages. |
| `Contentlayer2 -> gray-matter -> js-yaml@3.14.2` | Frontmatter parsing during generation. | MDX is repository-controlled in normal operation, but pull-request content reaches CI. Existing source-format/frontmatter guards fail malformed input; they do not patch parser complexity or prototype issues. | **Conditional hold.** Keep fail-closed document generation and no public authoring path. Recheck before accepting external content and during Contentlayer maintenance. |
| `Contentlayer2 -> mdx-bundler -> remark-mdx-frontmatter -> toml@3.0.0` | Build-time TOML/frontmatter support. | No current TOML frontmatter was identified as a public input. Pull-request content can still exercise the parser in CI. | **Conditional hold.** Keep Contentlayer generation fail-closed; recheck with Contentlayer/MDX updates or if TOML content is introduced. |
| `Contentlayer2 -> OpenTelemetry -> @grpc/grpc-js / protobufjs / Jaeger propagator` | Build/development telemetry and OTLP client path. The application does not expose a gRPC server. | Server-side malformed request and auth-context cases were not found reachable from the public site. Malformed telemetry configuration or build-time data remains a separate availability concern. | **Conditional hold.** Recheck if telemetry export is enabled/configured, a gRPC server is added, or Contentlayer updates these packages. |
| ESLint/knip/depcheck toolchain -> `glob`, `minimatch`, `brace-expansion`, `flatted`, `smol-toml`, dev `js-yaml`/`picomatch` | Development and CI lint/audit tooling. | Project scripts use fixed arguments and do not invoke `glob -c`. Pull requests can modify configuration and file trees, so CI denial remains possible even though these packages are absent from browser runtime. | **Separate maintenance.** Upgrade lint/analysis tools in a dedicated branch and keep PR secrets restricted. Recheck before running tooling against external repositories or user-supplied patterns/configuration. |
| `autoprefixer -> browserslist` | Build-time target-browser selection. | No untrusted custom stats file or arbitrary query API is exposed. Pull requests can change config, so CI availability remains the relevant boundary. | **Separate maintenance.** Refresh Browserslist data and parent tooling separately; do not mix it into the security patch. |

The repository's GitHub workflows run on `pull_request` and execute install,
lint, generation, and build checks. Therefore "only trusted repository input"
is not used as a blanket safety claim: an untrusted contribution can reach
build-time parsers and pattern matchers even when it cannot reach Production
runtime or protected credentials.

## 4. Install-script review

`npm ci` completed but npm reported five scripts awaiting explicit approval.
No blanket approval was added.

| Package | Script purpose | Decision |
| --- | --- | --- |
| `contentlayer2@0.5.8` | Generates Contentlayer type stubs and may update the Contentlayer ignore entry. | Do not approve globally. Explicit `gen` and `check:ci` succeed without it. Recheck if a fresh environment cannot generate content. |
| `esbuild@0.28.0` | Validates the platform binary and may download/build a fallback if the optional binary is absent. | Needed by the MDX build path, but the current prebuilt binary works. Approve only this package if a documented target environment needs the fallback. |
| `protobufjs@7.5.6` | Checks protobuf dependency-version compatibility and emits warnings. | Not required for the current build. Leave unapproved. |
| `sharp@0.34.5` | Checks libvips/native support and may build the native addon. | Current optional prebuilt path builds. Do not approve until the sharp residual risk and target deployment need are resolved. |
| `unrs-resolver@1.11.1` | Locates/verifies its optional native resolver binding and may invoke the package manager for a missing binding. | Used by lint-time import resolution. Approve specifically only if a supported CI platform lacks its prebuilt binding. |

## 5. Build and UI verification

### Final validation without the fixture

- `npm.cmd run jev:test`: 16/16 passed.
- `npm.cmd run jev:doctor`: Codex CLI, ChatGPT authentication, TypeSafe skill,
  and hook definitions are present. Hook trust and TypeSafe/Gateway credentials
  are not configured, so Review/Retention/Router remain inactive fail-open
  paths; this is an authentication state, not a test failure.
- `npm.cmd run check:ci`: passed outside the managed sandbox. Inside the
  sandbox, asynchronous `realpath` on `node_modules` returned `EPERM` and Next
  misclassified existing TypeScript packages as missing. The candidate
  package/lock blobs were restored and matched the original candidate before
  the successful run.
- Contentlayer documents: 239.
- Published guides: 238.
- Static pages: 266.
- Prerender routes: 249.
- Engineer past-exam records: 130.
- Guide First Load JS: 145 kB.
- Four answer-review Page Data values: 125,020 / 114,067 / 114,292 /
  126,476 bytes.
- Routes, duplicate URLs, guide audit, Knowledge map, draft exclusion, and
  generated output passed. Tracked source snapshot remained unchanged.

### KaTeX fixture

A temporary published guide exercised inline fraction `\\frac{a}{b}`, subscript
`x_i`, and display summation `\\sum_{i=1}^{n} x_i`. Its local production HTML
returned 200 and contained 10 KaTeX class nodes. Screenshots at 360, 768, and
1280 px showed all three expressions as rendered mathematics. The fixture was
then deleted. The final build returned to 239 documents / 266 pages, and the
fixture is absent from source and sitemap.

### Local page matrix

The home page, a representative MDX guide, and all six tools returned HTTP 200
from the same candidate build. Screenshots were captured at 360, 768, and
1280 px under the ignored `.site-ops/security-review/screenshots/` directory.
Edge logs contained no console, hydration, or unhandled-error match.

At 768 and 1280 px, the reviewed pages rendered normally. At 360 px, existing
fixed-width content is visibly tight or clipped on the right in the home hero,
several tool controls/results, and especially control-chart legends/labels.
The dependency candidate has no application/CSS source diff and the prior
execution record already identified the control-chart narrow-width issue.
This is recorded as existing responsive UX debt, not silently treated as a
15.5.28 regression. A pixel-for-pixel 15.5.22 replay was not run in this phase.

## 6. Warning classification

| Warning | Classification | Follow-up |
| --- | --- | --- |
| Unknown npm env config `cache-dir` in supplied Vercel log | Environment/project configuration; no repository `cache-dir` setting was found. | Owner/project-setting review. Do not change application code to hide it. |
| Deprecated transitive packages | Existing ESLint/Contentlayer/analysis-tool debt. | Grouped dependency-maintenance branch; do not mix with the two-package security update. |
| Five pending install scripts | Supply-chain policy warning, reviewed individually above. | No blanket approval. Approve only a demonstrated target-specific need. |
| Browserslist data outdated | Routine build-data maintenance. | Separate task with before/after CSS and browser-support review. |
| `/guides/engineer/keyword-priority-100` 180 kB in the supplied Vercel/fixture build | Existing page-data issue. | Separate page-data task. |
| `/guides/qc/oc-curve` 467 kB in final local `check:ci` | Existing page-data issue. | Separate page-data task. |
| Contentlayer Windows notice and multiple-lockfile root inference | Known environment warnings. | Cross-platform policy already guards output; parent lockfile/root selection remains separate maintenance. |
| `next lint` deprecation | Next 16 migration preparation, not a 15.5.28 blocker. | Replace with ESLint CLI in a dedicated tooling change. |

## 7. Vercel evidence and limits

The owner previously opened the original candidate Preview and followed links
to other articles. The supplied Vercel build log reports Next.js 15.5.28,
266 generated pages, and completed build/deployment. This is owner evidence for
the old candidate Preview; it is not evidence for the final review-branch
commit that will contain the same dependency change plus the latest handoff.

The deployment URL recorded for the original candidate is
`https://qc-ie-consulting-site-ozddl8ddc-nagae916s-projects.vercel.app`.
Automated access remains blocked:

- local Vercel CLI reports `loggedIn: false`;
- the connected Vercel API identity receives 403 for the project/team; and
- the protected-deployment fetch also receives 403 while requesting a
  protection bypass.

Deployment Protection was not changed or bypassed. Final review-branch Preview
status must be checked after push through GitHub/Vercel evidence or by an owner
with the correct team access. The owner-provided Production screen showed
`main` at `98f9d024052a104c6cec98ad722d8581857faaba` at that time. The current
custom-domain alias and `gitSource` cannot be re-proven through the available
API identity and are recorded as an access limitation.

## 8. Adoption conditions, rollback, and integration boundary

Adoption is recommended when all of the following hold:

1. the final pushed review commit receives successful GitHub CI and a Ready
   Preview built from that exact SHA;
2. the owner confirms the protected Preview opens and the existing smoke path
   remains usable;
3. the residual High decisions in this document are explicitly accepted as
   time-bounded follow-up, especially `sharp`, Next's internal PostCSS, and
   Contentlayer build parsers; and
4. no unrelated handoff changes are accidentally included in the merge plan.

The dependency update will be committed as its own two-file commit. If `main`
does not yet contain the handoff's Jev/dashboard work, the full review branch
must not be merged wholesale. Apply or cherry-pick only the identified
dependency commit after reviewing its `package.json` / `package-lock.json`
diff, then run the normal CI and Preview approval flow.

Rollback is to revert that dependency-only commit, restoring Next.js and
`eslint-config-next` 15.5.22 plus the prior lockfile, and redeploy through the
normal reviewed branch process. Do not roll back unrelated handoff changes.

## Appendix A: High advisory register

`Production` means the advisory also appears in the
`npm audit --omit=dev --json` graph. It does not by itself prove browser/runtime
reachability.

| Source / GHSA | Package | Production | Vulnerable range | Advisory |
| --- | --- | --- | --- | --- |
| 1120582 / [GHSA-5375-pq7m-f5r2](https://github.com/advisories/GHSA-5375-pq7m-f5r2) | `@grpc/grpc-js` | Yes | `>=1.14.0 <1.14.4` | Malformed request can cause a server crash |
| 1120588 / [GHSA-99f4-grh7-6pcq](https://github.com/advisories/GHSA-99f4-grh7-6pcq) | `@grpc/grpc-js` | Yes | `>=1.14.0 <1.14.4` | Malformed compressed message can crash client or server |
| 1240622 / [GHSA-m9gg-hp2v-232j](https://github.com/advisories/GHSA-m9gg-hp2v-232j) | `@grpc/grpc-js` | Yes | `>=1.14.0 <1.14.5` | Auth context can report unauthorized certificates as authorized |
| 1124011 / [GHSA-45rx-2jwx-cxfr](https://github.com/advisories/GHSA-45rx-2jwx-cxfr) | `@opentelemetry/propagator-jaeger` | Yes | `<2.9.0` | Malformed header can throw and cause denial of service |
| 1123896 / [GHSA-3jxr-9vmj-r5cp](https://github.com/advisories/GHSA-3jxr-9vmj-r5cp) | `brace-expansion` | No | `>=2.0.0 <2.1.2` | Exponential expansion denial of service |
| 1123897 / [GHSA-3jxr-9vmj-r5cp](https://github.com/advisories/GHSA-3jxr-9vmj-r5cp) | `brace-expansion` | No | `<1.1.16` | Exponential expansion denial of service |
| 1130588 / [GHSA-mh99-v99m-4gvg](https://github.com/advisories/GHSA-mh99-v99m-4gvg) | `brace-expansion` | No | `<1.1.17` | Unbounded expansion can cause out-of-memory crash |
| 1130589 / [GHSA-mh99-v99m-4gvg](https://github.com/advisories/GHSA-mh99-v99m-4gvg) | `brace-expansion` | No | `>=2.0.0 <2.1.3` | Unbounded expansion can cause out-of-memory crash |
| 1130736 / [GHSA-rgw5-rvv9-x895](https://github.com/advisories/GHSA-rgw5-rvv9-x895) | `brace-expansion` | No | `>=2.0.0 <2.1.4` | Unbounded intermediate arrays denial of service |
| 1130737 / [GHSA-rgw5-rvv9-x895](https://github.com/advisories/GHSA-rgw5-rvv9-x895) | `brace-expansion` | No | `<1.1.18` | Unbounded intermediate arrays denial of service |
| 1240104 / [GHSA-qhr7-859c-m2p7](https://github.com/advisories/GHSA-qhr7-859c-m2p7) | `brace-expansion` | No | `<1.1.20` | Nested group recursion stack exhaustion |
| 1240105 / [GHSA-qhr7-859c-m2p7](https://github.com/advisories/GHSA-qhr7-859c-m2p7) | `brace-expansion` | No | `>=2.0.0 <2.1.6` | Nested group recursion stack exhaustion |
| 1240108 / [GHSA-6j4f-fj2g-mc7p](https://github.com/advisories/GHSA-6j4f-fj2g-mc7p) | `brace-expansion` | No | `<1.1.19` | `parseCommaParts` recursion stack exhaustion |
| 1240109 / [GHSA-6j4f-fj2g-mc7p](https://github.com/advisories/GHSA-6j4f-fj2g-mc7p) | `brace-expansion` | No | `>=2.0.0 <2.1.5` | `parseCommaParts` recursion stack exhaustion |
| 1240992 / [GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm) | `braces` | Yes | `<=3.0.3` | Deeply nested patterns cause stack exhaustion |
| 1153171 / [GHSA-c83g-rgw3-j3cx](https://github.com/advisories/GHSA-c83g-rgw3-j3cx) | `browserslist` | No | `<=4.28.6` | Unbounded cache growth and eventual out-of-memory |
| 1153172 / [GHSA-73wf-gq98-2v4g](https://github.com/advisories/GHSA-73wf-gq98-2v4g) | `browserslist` | No | `<=4.28.6` | Untrusted custom stats can crash or write prototypes |
| 1114526 / [GHSA-25h7-pfq9-p65f](https://github.com/advisories/GHSA-25h7-pfq9-p65f) | `flatted` | No | `<3.4.0` | Unbounded recursion in parse revive phase |
| 1241196 / [GHSA-rf6f-7fwh-wjgh](https://github.com/advisories/GHSA-rf6f-7fwh-wjgh) | `flatted` | No | `<=3.4.1` | Prototype pollution via parse |
| 1109842 / [GHSA-5j98-mcp5-4vw2](https://github.com/advisories/GHSA-5j98-mcp5-4vw2) | `glob` | No | `>=10.2.0 <10.5.0` | CLI command injection through `-c` / `--cmd` |
| 1123911 / [GHSA-52cp-r559-cp3m](https://github.com/advisories/GHSA-52cp-r559-cp3m) | `js-yaml` | No | `>=4.0.0 <4.3.0` | Merge-key chains cause quadratic CPU use |
| 1123912 / [GHSA-52cp-r559-cp3m](https://github.com/advisories/GHSA-52cp-r559-cp3m) | `js-yaml` | Yes | `>=3.0.0 <3.15.0` | Merge-key chains cause quadratic CPU use |
| 1138114 / [GHSA-5p4m-2wfm-xmqj](https://github.com/advisories/GHSA-5p4m-2wfm-xmqj) | `js-yaml` | Yes | `>=3.0.0 <3.15.1` | Quadratic CPU use in `!!omap` resolution |
| 1138115 / [GHSA-5p4m-2wfm-xmqj](https://github.com/advisories/GHSA-5p4m-2wfm-xmqj) | `js-yaml` | No | `>=4.0.0 <4.3.1` | Quadratic CPU use in `!!omap` resolution |
| 1193726 / [GHSA-2883-xcg3-v3hh](https://github.com/advisories/GHSA-2883-xcg3-v3hh) | `js-yaml` | Yes | `>=3.0.0 <3.15.2` | Merge-key CPU limit bypass |
| 1193727 / [GHSA-2883-xcg3-v3hh](https://github.com/advisories/GHSA-2883-xcg3-v3hh) | `js-yaml` | No | `>=4.0.0 <4.3.2` | Merge-key CPU limit bypass |
| 1113459 / [GHSA-3ppc-4f35-3m26](https://github.com/advisories/GHSA-3ppc-4f35-3m26) | `minimatch` | No | `<3.1.3` | ReDoS through repeated wildcards |
| 1113465 / [GHSA-3ppc-4f35-3m26](https://github.com/advisories/GHSA-3ppc-4f35-3m26) | `minimatch` | No | `>=9.0.0 <9.0.6` | ReDoS through repeated wildcards |
| 1113538 / [GHSA-7r86-cg39-jmmj](https://github.com/advisories/GHSA-7r86-cg39-jmmj) | `minimatch` | No | `<3.1.3` | GLOBSTAR combinatorial backtracking ReDoS |
| 1113544 / [GHSA-7r86-cg39-jmmj](https://github.com/advisories/GHSA-7r86-cg39-jmmj) | `minimatch` | No | `>=9.0.0 <9.0.7` | GLOBSTAR combinatorial backtracking ReDoS |
| 1113546 / [GHSA-23c5-xmqv-rm74](https://github.com/advisories/GHSA-23c5-xmqv-rm74) | `minimatch` | No | `<3.1.4` | Nested extglob regular-expression ReDoS |
| 1113552 / [GHSA-23c5-xmqv-rm74](https://github.com/advisories/GHSA-23c5-xmqv-rm74) | `minimatch` | No | `>=9.0.0 <9.0.7` | Nested extglob regular-expression ReDoS |
| 1139427 / [GHSA-2v37-7h3g-55p8](https://github.com/advisories/GHSA-2v37-7h3g-55p8) | `nanoid` | Yes | `<3.3.18` | Zero-size custom generator can loop indefinitely |
| 1115552 / [GHSA-c2c7-rcm5-vvqj](https://github.com/advisories/GHSA-c2c7-rcm5-vvqj) | `picomatch` | Yes | `<2.3.2` | Extglob quantifier ReDoS |
| 1115554 / [GHSA-c2c7-rcm5-vvqj](https://github.com/advisories/GHSA-c2c7-rcm5-vvqj) | `picomatch` | No | `>=4.0.0 <4.0.4` | Extglob quantifier ReDoS |
| 1124252 / [GHSA-6g55-p6wh-862q](https://github.com/advisories/GHSA-6g55-p6wh-862q) | `postcss` | Yes | `<=8.5.11` | Attacker-controlled `sourceMappingURL` arbitrary file read |
| 1139510 / [GHSA-r28c-9q8g-f849](https://github.com/advisories/GHSA-r28c-9q8g-f849) | `postcss` | Yes | `<=8.5.17` | Previous source-map path traversal and file disclosure |
| 1123488 / [GHSA-wcpc-wj8m-hjx6](https://github.com/advisories/GHSA-wcpc-wj8m-hjx6) | `protobufjs` | Yes | `<=7.6.0` | Unbounded Any expansion during JSON conversion |
| 1124066 / [GHSA-f88m-g3jw-g9cj](https://github.com/advisories/GHSA-f88m-g3jw-g9cj) | `sharp` | Yes | `<0.35.0` | Inherited libvips vulnerabilities |
| 1193725 / [GHSA-rgj7-g3m4-5g8c](https://github.com/advisories/GHSA-rgj7-g3m4-5g8c) | `sharp` | Yes | `<0.35.4` | Inherited libheif vulnerabilities |
| 1241331 / [GHSA-wq5f-xc86-pv6w](https://github.com/advisories/GHSA-wq5f-xc86-pv6w) | `sharp` | Yes | `<0.35.5` | Inherited librsvg vulnerability |
| 1193945 / [GHSA-7w5x-hrqm-74c2](https://github.com/advisories/GHSA-7w5x-hrqm-74c2) | `smol-toml` | No | `<=1.7.0` | Malformed TOML denial of service |
| 1241209 / [GHSA-68fv-2mgg-jv7q](https://github.com/advisories/GHSA-68fv-2mgg-jv7q) | `source-map-js` | Yes | `>=1.0.0 <1.2.2` | Indexed source-map offsets can block the event loop |
| 1164824 / [GHSA-82x6-q7mm-w9cf](https://github.com/advisories/GHSA-82x6-q7mm-w9cf) | `toml` | Yes | `<4.2.0` | Uncontrolled recursion |
| 1164825 / [GHSA-v5mp-jgw5-2x6j](https://github.com/advisories/GHSA-v5mp-jgw5-2x6j) | `toml` | Yes | `<4.1.2` | Prototype pollution through key-path desynchronization |
