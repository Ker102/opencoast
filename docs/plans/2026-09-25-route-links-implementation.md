# Reviewed route links implementation plan

> **For Agent:** Use the executing-plans skill to implement this plan task by task.

**Goal:** Let moderators link a reviewed land approach route to a reviewed coast area, with a current public status and an audit trail.

**Architecture:** A separate join table records explicit moderator links. Public reads derive an area's land-route state from the current route record, so a route revision or hide takes effect immediately. Each link edit creates an immutable event and a public area revision.

**Tech stack:** PostGIS, Fastify, Zod, React, Vitest.

## Task 1: Spatial persistence and public reads

**Files:** `api/db/003_route_links.sql`, `api/src/records.ts`, `shared/src/schema.ts`, `api/src/app.ts`, `api/src/app.integration.test.ts`.

1. Extend the isolated integration flow to assert a new area starts with `landRouteStatus: not_verified`, `linkedRouteIds: []`, and an empty `/records/:id/routes` response. Run with `INTEGRATION_TEST=1` and confirm the new expectation fails.
2. Add `access_route_links(area_id,route_id)` with unique pair, foreign keys, timestamps, and a kind check trigger; add append-only `route_link_events` with moderator, reason, before/after IDs. Migration remains ordered and idempotent.
3. Add a public linked-route endpoint returning only visible linked route records. Derive `landRouteStatus` from a currently visible, document-backed route whose status is allowed or conditional. Return linked route IDs on area features.
4. Run migrations against `opencoast_test`, the integration test, and typecheck.

## Task 2: Moderator mutation and audit

**Files:** `shared/src/schema.ts`, `api/src/route-links.ts`, `api/src/app.ts`, `api/src/app.integration.test.ts`.

1. Add integration checks for unauthenticated and cross-origin rejection, a valid link, duplicate/invalid route rejection, unlink, changed public status, event rows, and public revisions. Check a route revision to restricted status removes the area's verified claim without deleting its link.
2. Add `GET /moderation/records/:id/route-candidates` with nearby reviewed routes and current selections. Add `PUT /moderation/records/:id/routes` taking a unique route-ID array and a written reason.
3. In one transaction, lock the area and selected routes, validate kinds and visibility, replace links, append an immutable event, increment the area's revision/edit date, and append a public snapshot. Reject no-op changes and missing/invalid records clearly.
4. Run the integration test and typecheck.

## Task 3: Public and moderator interface

**Files:** `web/src/api.ts`, `web/src/RecordDetail.tsx`, `web/src/Moderation.tsx`, `web/src/App.tsx`, `web/src/styles.css`.

1. Show linked routes in the area card with each route's own status, evidence level, and a map focus action. If none qualifies, keep the `Land route not verified` message.
2. Add an area-specific moderator route manager reached from its public card. Show nearby candidate route records, current links, a required audit reason, save errors, and success feedback. Preserve sign-in gating.
3. Refresh public records after a successful save. Build and inspect desktop and narrow viewport layouts.

## Task 4: Documentation and release check

**Files:** `README.md`, `docs/moderation-policy.md`, `task.md`.

1. Explain that a route link is an explicit reviewed relationship, and only a current document-backed allowed/conditional route yields `verified`; no route is inferred from proximity.
2. Run `npm test` with the isolated database, `npm run format:check`, `npm run typecheck`, `npm run build`, and `npm audit --audit-level=high`.
3. Commit and push, then verify GitHub CI on the pushed commit and close issue #2 only if the acceptance criteria are met.
