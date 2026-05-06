# AGENTS.md

## Project rules

- This project is n-ie-qclab, a Next.js 14 / Contentlayer2 educational site.
- Use minimal diffs.
- Do not add dependencies unless explicitly necessary.
- Prefer existing components and utilities.
- Guides are managed under content/guides/{exam}/.
- Valid exam values are qc, stat, and engineer.
- For QC guides, use content/guides/qc/.
- MDX guide content should not include import statements.
- If interactive components are needed, register allowed client components through the existing guide component registry.
- Do not write JSX comments inside MDX.
- Use KaTeX syntax for formulas.
- Inline math: $...$
- Block math: $$...$$
- Avoid double-index matrix access such as matrix[i][j].
- Use src/lib/safe-matrix.ts utilities for 2D matrix operations.
- Do not introduce Bash-only commands in documentation.
- Use PowerShell-compatible npm commands.
- After changes, run available checks from package.json, such as typecheck, lint, and build.
