# OpenCoast first milestone

## Objective

Build a public-source global coastal access map with accurate reviewed records, anonymous contributions, private evidence, and moderator approval. Start with zero asserted legal records. The first useful field work will focus on Montenegro after sources and geometry are reviewed.

## Decisions

- Code public on GitHub; operator controls live database and decides data licensing separately.
- Supabase PostGIS for hosted data, Cloudflare R2 for private objects, separate Vercel API and web projects with a same-origin API proxy.
- OpenFreeMap basemap with OpenStreetMap attribution, replaceable before high traffic.
- No account needed for browsing or submitting; moderators have accounts.
- Areas, routes, and points are separate; status and evidence label are separate.

## Progress

- [x] Product design and visual references documented.
- [x] Shared schema, spatial database, API, map, drawing, receipt, evidence, moderation, and revision history implemented.
- [x] Database-backed integration flow passes in isolated test database; no legal records seeded.
- [x] Desktop and narrow viewport browser inspection; point, route, and area drawing verified in browser.
- [x] Public GitHub repository and CI created; clean-checkout run is green.
- [x] GitHub discovery documentation expanded with a public-facing overview, evidence FAQ, contribution paths, and software citation metadata (issue #7).
- [x] Follow-up work tracked as [GitHub issues](https://github.com/Ker102/opencoast/issues).
- [x] Explicit area-to-route links, current derived land-route status, moderator controls, and audit revisions implemented (issue #2).
- [x] Terrain focus view implemented with muted base colors, preserved community overlays, and a mobile map switch.
- [x] Focus view park fills and outlines neutralized so they cannot resemble reviewed access areas; shoreline logo, wordmark, and locally hosted fonts added.
- [x] Dedicated Supabase PostGIS project, private R2 bucket, and two Vercel projects configured; hosted health, empty map, and same-origin proxy respond successfully.
- [x] Hosted anonymous submission, private evidence upload, receipt, and first moderator sign-in flow verified; temporary test data removed.
- [x] Custom domain `opencoast.kaelux.dev` added to the Vercel web project; API production origin checks and private R2 upload CORS accept both the custom domain and existing address. Focused origin tests, type checking, formatting, hosted CORS, and proxy health passed on 2026-10-06. README prominently explains anonymous, account-free browsing and contributions.
- [x] Custom domain DNS, HTTPS and API proxy verified on 2026-10-10. The current web deployment is aliased to the custom domain, and the previous hostname redirects there.
- [x] Crawlable public explanations, canonical/social metadata, structured data, sitemap, crawler policy and AI reading summary deployed; desktop/mobile, no-JavaScript and response checks passed. See [discovery notes](docs/discovery.md).
- [x] Two editable 96-second motion drafts rendered with white/black cursors, status-based map colors, local access/category details, barriers, conditions, evidence and dates. See [motion source and filming notes](tools/motion/README.md).
- [ ] Real iOS Safari and Android Chrome touch testing.
- [ ] Disable Supabase Data API in the dashboard; direct PostgreSQL table grants already block the checked API roles.
- [ ] First Montenegro records checked by two moderators.

## Validation before broad promotion

Run tests, type checks, build, dependency audit, and browser smoke checks. Confirm R2 bucket privacy, source copyright, production domain/origin, monitoring, and review policy with the first moderator cohort. Track remaining limits as GitHub issues.

## Validation before the 16 October 2026 push

Tests: seven passed; two database integration checks require the isolated test service and were skipped locally. Type checking, formatting, production build and translation checks passed. Prior motion playback receipts cover both 96-second exports. Rendered artifacts remain local; source, symbols and licenses are included. Dependency advisory follow-up is tracked in issue #11.
