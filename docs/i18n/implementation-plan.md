# Documentation Translation Implementation Plan

Goal: Full mirrors of the seven maintained English public Markdown documents in
es, zh-CN, fr, ja, de and pt-BR, without changing application behavior.

Architecture: English working-tree files remain authoritative. Mirrors retain
repository-relative source paths under each locale. A JSON inventory records
source and mirror SHA-256 hashes; a dependency-free Node validator checks drift,
links, fences, code and structural coverage. No commit, push or staging.

## Scope And Constraints

- Sources: README.md, CONTRIBUTING.md, SECURITY.md, docs/development.md,
  docs/moderation-policy.md, docs/discovery.md, docs/domain-setup.md.
- Read current working files, including uncommitted reader-facing guides.
- Only add a language bar to the English README; leave other source files alone.
- Exclude agent instructions, task/progress files, plans, design references,
  generated run records, private evidence, vendor and motion development assets.
- Preserve code, commands, API identifiers, versions, URLs and safety limits.
- Translate complete documents, not summaries. Explicitly record pending mirrors.

## Execution

1. [x] Inspect instructions, dirty status, maintained sources and local runtime.
2. [x] Record scope and add the English language bar.
3. [x] Translate all seven sources into each of the six locales.
4. [x] Review claim scope, privacy, moderation, legal uncertainty and licensing.
5. [x] Generate explicit inventory and stable fragment anchors.
6. [x] Test validator failures with isolated temporary fixtures.
7. [x] Validate all mirrors, review the README-only diff and inspect final status.

## Validation

- `node --test tools/check-i18n-tests.mjs`: focused validator regression tests, separate from Vitest discovery.
- `node tools/check-i18n.mjs`: hashes, mirror coverage, links/anchors, headings,
  table/list structure, exact fenced code, inline identifiers and external URLs.
- `git diff --check`: whitespace errors in tracked changes.
- Compare English README against its initial working-tree snapshot with only the
  language bar removed. Inspect other changes without reverting concurrent work.
- Report per-language coverage and any incomplete documents accurately.

Risks: concurrent source edits can stale translations; hash checks must fail
rather than silently update source hashes. Automated structural checks cannot
prove semantic translation quality; factual review remains a manual step.

## Result

All requested locales have seven complete mirrors, for 42 total. The validator
passes and all seven regression tests pass. `git diff --check` and whitespace
checks of all new files pass. Removing only the language bar from the English
README reproduces its initial working-tree SHA-256 exactly. The index remains
empty; no commit, push or staging was performed. Other existing work was not
edited. No source/locale pairs are pending; independent native-speaker review
has not been performed and is explicitly noted in the inventory.
