# Site Operations Execution Record (2026-10-17)

## Scope

This record follows `docs/project/OPERATIONS_PLAN_20261017.md` and
`docs/development/CODEX_NEXT_ACTIONS_20261017.md`. It distinguishes locally
verified results from checks that still require account access. No change was
made to `main`, Production, public content, URLs, or analytics settings.

## Branches

| Purpose | Branch | Verified remote SHA |
| --- | --- | --- |
| Operations handoff | `feat/site-operations-handoff` | `c7348394f7fe24f30fdc7388bb924d80b787a4c2` |
| Security candidate | `chore/security-next15528-review` | `a8192600f5d6c09885a0cb31615dae60b32eb880` |
| Current main reference | `main` | `98f9d024052a104c6cec98ad722d8581857faaba` |

The security candidate is based on the operations handoff and changes only
`package.json` and `package-lock.json`. It updates `next` and
`eslint-config-next` from 15.5.22 to 15.5.28 while retaining React 18,
Pages Router, Contentlayer2, and Node.js 24.

## Next.js 15.5.28 Candidate

### Local verification

- Runtime: Node.js `v24.18.1`, npm `11.16.0`.
- A normal `npm.cmd ci` completed without `--force` or
  `--legacy-peer-deps`.
- `npm.cmd run gen`: 239 Contentlayer documents.
- `npm.cmd run jev:test`: 16 of 16 tests passed.
- `npm.cmd run check:ci`: passed.
- Build output: 266 static pages, 238 published guides, 249 prerender routes,
  130 engineer past-exam records, and four 2026 review routes.
- Guide First Load JS: 145 kB.
- The four review Page Data measurements remained 125,020 / 114,067 /
  114,292 / 126,476 bytes.
- The source snapshot was unchanged after validation: 495 tracked source files.
- Existing routes, duplicate URL checks, guide audit, Knowledge map, draft
  exclusion, and generated-output checks passed.

Local HTTP checks returned 200 for the home page, guide index, representative
MDX pages, one representative answer review, the tools index, and all six
individual tools. A missing route returned 404. Generation of all four answer
review routes was verified by `check:ci`. Desktop and narrow-width screenshots
were reviewed at 360, 768, and 1280 pixel targets. The control-chart canvas
renders, but its right-side labels are tight or clipped at the narrow target.
Because the candidate has no application or CSS source diff, this is existing
mobile UX debt rather than evidence of a 15.5.28 regression.

The KaTeX pipeline remains configured through `remark-math`,
`rehype-katex`, and the global stylesheet. No current guide containing a
rendered math fixture was found, so a visual formula assertion was not claimed.

### GitHub and Preview

The candidate SHA has successful GitHub checks for `check`,
`windows-content`, `scan`, and Vercel. GitHub records a successful Preview
deployment for the exact candidate SHA:

- Deployment URL:
  `https://qc-ie-consulting-site-ozddl8ddc-nagae916s-projects.vercel.app`
- Vercel status page:
  `https://vercel.com/nagae916s-projects/qc-ie-consulting-site/4QGdw11KuvrSSiar3R4MYz6hLQx5`

The deployment is protected and unauthenticated requests redirect to Vercel
SSO. The available Vercel API identity receives 403 for the project team, and
the local Vercel CLI has no credentials. Therefore Ready status and source SHA
are verified through GitHub, while Preview response bodies and Vercel build
logs remain unverified in this environment.

### Audit and reachability

The candidate production-dependency audit result is critical 0, high 19,
moderate 25, low 5. The 19 high findings are transitive; none is a new direct
dependency.

- Next carries internal `postcss@8.4.31`, while the repository's direct
  build dependency remains `postcss@8.5.25`. The application builds only
  trusted repository CSS and has no user or external CSS ingestion path.
- Contentlayer-related findings are reached while parsing and bundling trusted
  repository MDX during development or build. The site has no user-authored
  content upload path.
- Next optionally resolves `sharp@0.34.5`. The only `next/image` use found
  is the local home hero image. No image upload or remote image configuration
  was found. A Vercel Function trace could not be inspected without Vercel
  access, so runtime exclusion is not asserted.
- The audit recommendation that requires a major Next.js change is not applied
  automatically. `npm audit fix --force`, overrides, and unrelated package
  updates were not used.

The candidate removes the previously recorded Next.js critical advisory and
preserves the application baseline. Adoption remains conditional on an
authenticated Preview response/build-log check and an explicit acceptance or
separate remediation plan for residual high findings.

## Production Source SHA

GitHub records a successful Production deployment for
`98f9d024052a104c6cec98ad722d8581857faaba`:

- Deployment URL:
  `https://qc-ie-consulting-site-ibmdw8exp-nagae916s-projects.vercel.app`
- Vercel status page:
  `https://vercel.com/nagae916s-projects/qc-ie-consulting-site/8WtEA76P4z7uH96Ho7uD7Wbd3FbC`

The public custom domain returned HTTP 200 and its canonical points to
`https://n-ie-qclab.com/`. The unique deployment URL is protected. Without
team read access, the current custom-domain alias cannot be authoritatively
resolved to a deployment and `gitSource` SHA. The GitHub deployment record is
evidence for that commit's successful Production deployment, not proof that the
custom domain currently aliases it.

## Measurement and Contact

No Search Console or GA4 export was found in the repository. The local
dashboard therefore keeps search clicks, traffic, inquiries, and sales as
`未接続`; they are not converted to zero. No 28-day or 90-day result is
reported.

The public contact page currently links to the existing N-IE Lab X profile and
asks readers not to post confidential information publicly. The formal contact
channel, response frequency, and current paid-engagement availability require
owner confirmation. No form, email address, automated response, payment flow,
or private inquiry ledger was added.

## Development Tooling Status

- Local Codex CLI `0.155.0` reports ChatGPT login.
- The project TypeSafe skill and `PreCompact` / `SessionStart` hook
  definitions are present.
- Hook trust and actual hook firing have not been confirmed through `/hooks`.
- No TypeSafe, Jev, AI Gateway, or Vercel OIDC credential is configured in the
  local environment.
- Jev Review and Retention therefore remain credential-waiting Shadow paths.
- `npm.cmd run codex:jev -- --version` safely fell back to normal Codex;
  this is not counted as active Jev Router use.
- Router metrics contain zero sessions and zero decisions.

## Small Agent Pilot

The first read-only pilot used two independent reviewers, followed by a
Knowledge Curator handoff. No agent edited files.

| Page | Shared finding | Proposed next decision |
| --- | --- | --- |
| Quality standards | Strongest practical structure; current ISO edition wording and the boundary between ISO requirements and N-IE Lab's workflow need verification | Update the source reference and clarify scope before adding any new material |
| Simple linear regression | The slope explanation must be unit-aware; residual assumptions and the relationship to the QC regression page need a canonical decision | Correct the factual sentence first, then plan a focused diagnostic example |
| Production planning | The page declares inputs and outputs without providing them and has no outgoing internal links | Treat this as the highest-priority existing-page revision, preserving its URL |

Both independent reviews converged on the same priority order. A solo baseline,
token usage, billed cost, and rework count were not captured, so this pilot does
not establish a cost or speed advantage. Recommendations are editorial backlog,
not approved content changes.

The Knowledge Curator concluded that all three existing URLs should remain the
canonical candidates and that no standalone Knowledge page is needed. The
recommended sequence is: verify and update the ISO reference and scope boundary
on the quality-standard page; decide the canonical regression URL before any
URL consolidation; then expand the production-planning page as the existing
planning overview. Any regression URL consolidation still requires GSC and
inbound-link evidence plus the normal redirect/canonical process. Exact ISO
clause mapping and production-planning terminology require human review of the
licensed/current source material.

## Local Dashboard

`npm.cmd run dashboard:site` generated the local-only dashboard with 239
guides, 238 published guides, two cases, and six tools. The dashboard keeps
unconnected business metrics visibly separate from measured repository data.

The implementation was adjusted so that:

- the four registered themes are counted from the actual `themes` array
  boundary instead of an indentation-sensitive match; and
- metric cards use one column below 560 px, while wide layouts retain the
  existing four-column design.

The generated `.site-ops/dashboard.html` remains ignored and is not part of
the public site.

## Handoff Branch Final Verification

After restoring the handoff branch's locked Next.js 15.5.22 dependencies with
Node.js 24, `npm.cmd run check:ci` passed. The final baseline remained 239
Contentlayer documents, 238 published guides, 266 static pages, 249 prerender
routes, 130 past-exam records, and 145 kB First Load JS for guide pages. The
four answer-review Page Data values remained 125,020 / 114,067 / 114,292 /
126,476 bytes, and the 495-file tracked source snapshot was unchanged.

The remaining output consisted of the known Contentlayer Windows notice,
multiple-lockfile root inference, stale Browserslist data, and the existing
`/guides/qc/oc-curve` Page Data warning. The locked 15.5.22 install also still
reports one critical audit finding; this is the security candidate's reason
for evaluation and was not modified on the handoff branch.

## Remaining Actions

1. Authenticate to the intended Vercel team and verify Preview responses,
   build logs, and custom-domain alias to deployment to `gitSource` SHA.
2. Confirm the Search Console property/export owner and obtain 28-day and
   90-day exports before connecting measurements.
3. Confirm the official inquiry channel, response expectation, and paid-work
   status before changing public copy.
4. Decide whether to adopt the Next.js 15.5.28 candidate after the remaining
   Preview and audit-risk review.
5. Establish a solo baseline before expanding the agent workflow beyond three
   representative articles.
