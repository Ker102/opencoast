# OpenCoast

OpenCoast is a global map for reviewed information about coastal access. People can draw an area, route, or point and submit a claim without an account. A moderator checks the exact shape, wording, and evidence before it appears on the map. Unmarked places say **No reviewed access information yet**; an empty map never implies that access is forbidden.

The code is public and accepts technical contributions. The live database and private evidence store are controlled by the project operator. Approved map records do **not** have an open-data license yet; ask before redistributing them. The OpenStreetMap-derived basemap retains its own attribution and license.

## What works now

- Responsive global map using MapLibre and an OpenStreetMap-derived OpenFreeMap style, with visible attribution.
- Reviewed areas, routes, and points with access status, evidence label, local category, conditions, sources, and separate edit and source-review dates.
- Desktop and touch-friendly drawing with vertex editing, undo, geometry review, and an anonymous submission form.
- Private receipt link, optional source link and file evidence, and a reply path when a moderator asks for clarification.
- Moderator sign-in, queue, private evidence inspection, audited wording edits, approval, rejection, clarification, public revision history, and selected sanitized image publication.
- A production PostGIS schema and a local PostGIS container. New databases have **zero asserted access records**.

See [the design](docs/plans/2026-09-24-opencoast-design.md) and [moderation policy](docs/moderation-policy.md) for the current decisions. The generated images in `docs/design-reference` are visual references only; their fictitious beach claims are not data.

## Run locally

Requirements: Node.js 24+, npm, and Docker. A local PostGIS database uses port `54329`; the API uses `4000`; the web app uses `5173`.

```sh
npm ci
docker compose up -d
npm run db:migrate
npm run dev
```

Open `http://localhost:5173`. To create a local moderator, set `MODERATOR_BOOTSTRAP_PASSWORD` to a unique password of at least 12 characters and run:

```sh
npm run moderator:create -w api -- moderator@example.org
```

The API loads environment values from the repository `.env` or `api/.env`; copy `.env.example` if you need to change the defaults. Local uploads are stored in ignored `.local-evidence/`. Production must configure Cloudflare R2 credentials and leave `LOCAL_EVIDENCE_DIR` unset.

## Checks

```sh
npm test
npm run format:check
npm run typecheck
npm run build
npm audit --audit-level=high
```

The database integration test uses a separate `opencoast_test` database and clears only that database after running. Create it locally, run migrations against it, then run the test:

```sh
docker exec opencoast-postgis-1 createdb -U opencoast opencoast_test
```

Set `DATABASE_URL=postgres://opencoast:opencoast_local@localhost:54329/opencoast_test` for both the migration and `INTEGRATION_TEST=1 npx vitest run api/src/app.integration.test.ts`. The test refuses any other database name.

## Hosted deployment

The intended setup is Supabase PostgreSQL with PostGIS, a **private** Cloudflare R2 bucket, the API on Google Cloud Run from the root `Dockerfile`, and the web app on Vercel from the repository root. `vercel.ts` proxies `/api/*` to Cloud Run so moderator cookies remain first-party. Set `CLOUD_RUN_API_ORIGIN` on Vercel before building. Do not expose the database or R2 credentials to the web build.

API environment:

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | Supabase Postgres connection string with PostGIS enabled |
| `WEB_ORIGIN` | Exact public web origin for CORS and moderator mutation checks |
| `S3_ENDPOINT` | Cloudflare R2 account endpoint |
| `S3_REGION` | R2 region, normally `auto` |
| `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY` | R2 credentials restricted to the evidence bucket |
| `S3_BUCKET` | Private evidence bucket name |
| `COOKIE_SECURE` | Defaults to secure in production |

Run `api/db/*.sql` in filename order against the database before starting the API, or run `npm run db:migrate -w api` in a trusted environment with `DATABASE_URL`. Keep R2 private: raw uploads never get a public object URL. Create moderator accounts using `MODERATOR_BOOTSTRAP_PASSWORD` as a temporary secret, then remove it.

The public basemap URL can be replaced with `VITE_MAP_STYLE_URL`. OpenFreeMap is suitable for early development but has no service guarantee; arrange monitoring and a funded tile provider before wide promotion. The map currently accepts coordinate navigation (`latitude, longitude`) rather than place-name search.

## Current release limits

This is an initial working implementation, not a legal authority. No jurisdiction-wide law is automatically applied to beaches. Hand-drawn shapes are labeled approximate. Area records do not claim a verified land route until links to separately reviewed route records are implemented. File scanning, durable abuse controls across API replicas, accessibility audits, and real iOS Safari/Android Chrome touch checks are release gates before broad public use. No hosted account or domain has been connected yet.

Code is MIT licensed; approved record data and third-party sources have separate rights. See [CONTRIBUTING.md](CONTRIBUTING.md) for code changes and map submissions.
