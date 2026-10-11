# Documentation Translations

[English](../../README.md) · [Español](es/README.md) · [简体中文](zh-CN/README.md) · [Français](fr/README.md) · [日本語](ja/README.md) · [Deutsch](de/README.md) · [Português (Brasil)](pt-BR/README.md)

## Source Of Truth

The maintained English files at the repository root and in `docs/` are
authoritative. These are full documentation translations, not summaries or an
application localization. They reflect the working-tree sources recorded in
[manifest.json](manifest.json), including reader-facing guides not yet committed
when the translation was made. No software behavior or hosted page is changed.

Each mirror is `docs/i18n/<locale>/<repo-relative-source-path>`. The inventory
lists every in-scope source, its SHA-256 hash, the requested locales and the
completed mirrors with their own hashes. A missing mirror is not completed
coverage. Check the manifest and validator output rather than inferring coverage
from directory presence. `pending` entries, if any, identify remaining work.

## Scope

The maintained public Markdown set is README, CONTRIBUTING, SECURITY, development
and deployment, moderation policy, discovery, and custom domain setup. All seven
are mirrored in Spanish, Simplified Chinese, French, Japanese, German, and
Brazilian Portuguese. No separate quickstart or API reference document exists in
this inventory; local setup and deployment reference material are in development.

Untranslated historical/internal materials include `docs/plans/`,
`docs/design-reference/`, `task.md`, progress records and agent instructions.
Generated run records, ignored artifacts/private evidence, vendor documentation
and `tools/motion/` development assets are outside scope. The discovery guide's
authored verification history is retained as dated history, not new verification;
no referenced private artifact was copied or translated. LICENSE and CITATION.cff
remain their canonical legal/machine-readable originals.

Links to in-scope documents use the same locale. Links to assets, code, canonical
legal files and excluded historical material return to their original repository
locations. Explicit English heading IDs preserve existing cross-document fragment
links even though heading text is translated. Code blocks, commands, inline code,
versions and external URLs stay unchanged; English UI labels remain identifiable
where needed. A translated document does not assert stronger legal rights,
privacy guarantees, coverage, deployment status or licensing than its source.

## Maintenance

Run from the repository root using its standard Node runtime:

```sh
node --test tools/check-i18n-tests.mjs
node tools/check-i18n.mjs
```

The validator is read-only and requires no extra packages or network access. It
checks source/mirror SHA-256 drift (UTF-8 text with CRLF normalized to LF), complete inventory, local links and
fragments, exact fenced code and inline code, external URLs, numeric literals,
heading levels, table rows and list item counts. It ignores only the language
switcher and the localized source-of-truth notice when comparing structure.
It supports the Markdown link forms used by these sources (inline/reference
links, autolinks and HTML `src`/`href`). It does not test remote URL availability,
translate text, prove semantic equivalence, or automatically refresh hashes.

When English changes, first update and review every affected translation. Keep
commands and warnings intact, rewrite relative links, retain source heading IDs,
then update the source and completed mirror hashes in the manifest together.
Never refresh hashes just to silence stale detection. If a mirror is incomplete,
remove its completed entry and record it in `pending`; do not substitute an
English copy or a shortened summary. Add newly maintained public docs explicitly
to the inventory and translate them across the requested locales.

Review factual meaning manually, especially access versus evidence, independent
route review, approximate geometry, upload privacy/consent, authentication,
database test isolation and the absence of an open-data license. Dates and
verification claims belong to the original source's review/deployment event,
not to the day a translation or validator is run.
