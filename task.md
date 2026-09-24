# OpenCoast first milestone

## Objective

Build a public-source global coastal access map with accurate reviewed records, anonymous contributions, private evidence, and moderator approval. Start with zero asserted legal records. The first useful field work will focus on Montenegro after sources and geometry are reviewed.

## Decisions

- Code public on GitHub; operator controls live database and decides data licensing separately.
- Supabase PostGIS for hosted data, Cloudflare R2 for private objects, Google Cloud Run API, Vercel web app with same-origin API proxy.
- OpenFreeMap basemap with OpenStreetMap attribution, replaceable before high traffic.
- No account needed for browsing or submitting; moderators have accounts.
- Areas, routes, and points are separate; status and evidence label are separate.

## Progress

- [x] Product design and visual references documented.
- [x] Shared schema, spatial database, API, map, drawing, receipt, evidence, moderation, and revision history implemented.
- [x] Database-backed integration flow passes in isolated test database; no legal records seeded.
- [x] Desktop and narrow viewport browser inspection; point, route, and area drawing verified in browser.
- [x] Public GitHub repository and CI created; clean-checkout script order corrected after the first CI run.
- [ ] Real iOS Safari and Android Chrome touch testing.
- [ ] Hosted Supabase, R2, Cloud Run, and Vercel credentials and deployment.
- [ ] First Montenegro records checked by two moderators.

## Validation before broad promotion

Run tests, type checks, build, dependency audit, and browser smoke checks. Confirm R2 bucket privacy, source copyright, production domain/origin, monitoring, and review policy with the first moderator cohort. Track remaining limits as GitHub issues.
