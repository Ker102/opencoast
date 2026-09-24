# OpenCoast first milestone implementation plan

> **For Agent:** Use the executing-plans skill to implement this plan task by task.

**Goal:** Deliver a responsive global coastal-access map with precise moderated area, route, and point records; anonymous submissions; private evidence; and a moderator review workflow.

**Architecture:** Use a TypeScript monorepo with a React web client, a separate API, and shared schemas. Store public geospatial records and private proposals in Supabase PostgreSQL with PostGIS. Store raw evidence privately in Cloudflare R2, publish only moderator-selected processed copies, and serve the map overlay through viewport queries. The web client targets Vercel and the API targets Google Cloud Run; the same API can later serve a mobile client.

**Tech stack:** React, Vite, MapLibre GL JS, Terra Draw, Fastify, Supabase PostgreSQL/PostGIS, Cloudflare R2, and Vitest. Start with OpenFreeMap's OpenStreetMap-derived vector style, configured so the provider can be replaced. The public tile service has no SLA, so production monitoring and a fallback are required before broad promotion. Local development uses PostGIS and S3-compatible storage containers with no hosted credentials.

**Scope decision:** Optional contributor accounts, native clients, public dispute feeds, automated legal interpretation, and automated OpenStreetMap editing are later milestones. Moderator accounts are required for review. Anonymous contributor receipt links are part of this milestone. No legal access record is seeded or published before evidence review.

## Batch 1: Repository and data contracts

### Task 1: Initialize the monorepo

**Files:** Create `package.json`, `web/package.json`, `api/package.json`, `shared/package.json`, `tsconfig.base.json`, `.gitignore`, `.env.example`, and `README.md`.

1. Initialize Git locally and add package workspaces for `web`, `api`, and `shared`.
2. Add `dev`, `test`, `typecheck`, and `build` scripts with no secrets in source control.
3. Document local setup and OpenStreetMap attribution requirements.
4. Run `npm install`, `npm test`, and `npm run typecheck`; confirm the clean scaffold succeeds.
5. Commit the scaffold with a descriptive message.

### Task 2: Define shared record schemas and tests

**Files:** Create `shared/src/access-record.ts`, `shared/src/proposal.ts`, `shared/src/index.ts`, and `shared/src/access-record.test.ts`.

1. Write a failing test for valid Point, LineString, and Polygon records and rejection of mismatched geometry types.
2. Define geometry kind, access status, evidence level, jurisdiction, allowed activities, conditions, citations, summary, `lastEditedAt`, `lastReviewedAt`, and `geometryPrecision`.
3. Ensure `document_backed` requires at least one qualifying official source; `community_reviewed` explicitly records source absence. A proposal may omit an official source.
4. Run `npm test` and `npm run typecheck`; confirm the schema tests pass.
5. Commit the shared contracts.

### Task 3: Create the spatial schema

**Files:** Create `api/db/001_initial.sql` and `api/db/001_initial.test.ts`.

1. Write a test that applies the migration to an empty PostGIS database and checks the tables and constraints.
2. Add `access_records`, `access_revisions`, `citations`, `jurisdiction_notes`, `proposals`, `proposal_evidence`, `moderators`, and `review_events` tables. Use geometry with SRID 4326, a spatial index for approved records, separate private proposal storage, and immutable review-event timestamps.
3. Prevent public record rows without status, evidence label, jurisdiction, edit date, and review date.
4. Run the migration test against a local test database.
5. Commit the migration.

## Batch 2: Read-only map and public records

### Task 4: Public viewport API

**Files:** Create `api/src/routes/access-records.ts`, `api/src/repositories/access-records.ts`, `api/src/server.ts`, and `api/src/routes/access-records.test.ts`.

1. Write failing tests for a bounded viewport response, empty coverage, and exclusion of pending proposals and private evidence.
2. Implement a bounding-box query using the PostGIS spatial index and return approved GeoJSON features plus display metadata.
3. Require valid viewport coordinates and cap query area or result count to protect the service.
4. Run route tests and typecheck.
5. Commit the public API.

### Task 5: Responsive global map

**Files:** Create `web/src/App.tsx`, `web/src/components/CoastMap.tsx`, `web/src/components/MapLegend.tsx`, `web/src/styles.css`, and `web/src/components/CoastMap.test.tsx`.

1. Write a component test for empty coverage text and a visible attribution area.
2. Render a MapLibre map with a configurable OpenFreeMap style URL. Draw approved areas, lines, and points in separate layers.
3. Fetch overlay data on viewport changes with request cancellation and a small debounce.
4. Provide responsive controls and an accessible non-map fallback list of records in view.
5. Run tests and build; inspect desktop and narrow-screen layouts manually.
6. Commit the map shell.

### Task 6: Access detail card and history

**Files:** Create `web/src/components/AccessDetail.tsx`, `web/src/components/AccessDetail.test.tsx`, and `api/src/routes/access-history.ts`.

1. Write tests that show allowed activities, conditions, evidence label, citations, last-edited date, last-reviewed date, and land-route status independently.
2. Implement the card as a side panel on desktop and a bottom sheet on mobile.
3. Add a history endpoint for public revisions, excluding private evidence and contributor identity.
4. Run tests and check screen-reader labels and keyboard closing.
5. Commit the detail view.

## Batch 3: Anonymous contribution

### Task 7: Precise drawing and form

**Files:** Create `web/src/components/ProposalEditor.tsx`, `web/src/components/ProposalForm.tsx`, `web/src/components/ProposalEditor.test.tsx`, and `web/src/components/ProposalForm.test.tsx`.

1. Write tests for geometry-type selection, undo, description, optional source links, conditions, and pre-submit geometry review.
2. Integrate Terra Draw point, line, and polygon modes. Use tap-to-place vertices on touch devices; support moving vertices and undo.
3. Label hand-drawn boundaries as approximate until supported by authoritative geometry.
4. Verify real touch behavior in iOS Safari and Android Chrome; fix hit targets and map gesture conflicts.
5. Commit the contribution UI.

### Task 8: Proposal API and private receipt

**Files:** Create `api/src/routes/proposals.ts`, `api/src/services/receipt-token.ts`, `api/src/routes/proposals.test.ts`, and `api/src/services/receipt-token.test.ts`.

1. Write tests for anonymous submission, malformed geometry rejection, rate limiting, receipt-only access, and no public exposure before approval.
2. Store a cryptographically random receipt token as a hash; return the raw token once in a private receipt URL.
3. Permit proposal descriptions and source links without an official document. Validate URL schemes, length, geometry complexity, and file metadata.
4. Run API tests, typecheck, and a manual cross-session receipt test.
5. Commit the proposal flow.

### Task 9: Private evidence upload

**Files:** Create `api/src/routes/evidence.ts`, `api/src/services/evidence-store.ts`, `api/src/routes/evidence.test.ts`, and `web/src/components/EvidenceUpload.tsx`.

1. Write tests that raw uploads are private, bound to one proposal, restricted by type and size, and inaccessible from public record endpoints.
2. Store uploads in a private S3-compatible bucket with random object keys. Scan file type, strip image metadata in public derivatives, and avoid directly serving raw originals.
3. Add an upload progress and error state to the form.
4. Verify unsupported files and oversized files fail clearly.
5. Commit the evidence handling.

## Batch 4: Moderator workflow and release checks

### Task 10: Moderator authentication and queue

**Files:** Create `api/src/routes/moderation.ts`, `api/src/auth/moderator-session.ts`, `api/src/routes/moderation.test.ts`, and `web/src/pages/ModerationQueue.tsx`.

1. Write tests for moderator-only queue access, session expiry, and rejection of cross-site or unauthenticated mutations.
2. Implement secure moderator sessions and an allowlisted moderator roster. Keep public contributor accounts out of scope.
3. Show submitted geometry, description, source links, private evidence, and prior related records in the queue.
4. Run security-focused route tests.
5. Commit the queue.

### Task 11: Approval, revision, and publication selection

**Files:** Create `api/src/services/review.ts`, `api/src/services/review.test.ts`, `web/src/pages/ProposalReview.tsx`, and `api/src/routes/public-evidence.ts`.

1. Write tests for approval, rejection with reason, clarification request, revision supersession, and publishing only selected evidence derivatives.
2. Require a moderator explanation and evidence label before approval. Record an immutable review event and update `lastEditedAt`; change `lastReviewedAt` only when source review occurs.
3. Ensure public responses exclude receipt tokens, private files, emails, IP addresses, and hidden contributor names.
4. Recheck public API tests and manual record history behavior.
5. Commit moderation actions.

### Task 12: Seed, accessibility, and end-to-end review

**Files:** Create `web/e2e/access-flow.spec.ts`, `web/e2e/contribution-flow.spec.ts`, and `docs/moderation-policy.md`.

1. Confirm the production database launches with no asserted legal-access records and the empty-coverage state is visible worldwide. Add Montenegro records only through the same submission and moderator review flow when their evidence and geometry are ready.
2. Test anonymous submit -> receipt -> moderator approve -> public map; test rejection and private evidence isolation.
3. Check responsive layouts, keyboard navigation, mobile touch drawing, high contrast, source links, dates, and empty global coverage.
4. Run the full test suite, typecheck, production build, and end-to-end tests. Document any remaining limitations.
5. Commit the verified first milestone.

## Checkpoints and release gates

- **After Batch 1:** Data contracts and migration are reviewable. Confirm access status and evidence terminology before API work.
- **After Batch 2:** Public map accurately distinguishes no coverage, legal status, evidence level, and route status.
- **After Batch 3:** Anonymous submission works without leaking private evidence or identity.
- **After Batch 4:** Two-person source review, moderation policy, mobile drawing QA, and privacy checks pass before public promotion.

## Source and tool references

- Vite React TypeScript template: https://vite.dev/guide/
- MapLibre GL JS: https://maplibre.org/maplibre-gl-js/docs/
- Terra Draw adapters and touch modes: https://github.com/JamesLMilner/terra-draw/blob/main/guides/3.ADAPTERS.md and https://github.com/JamesLMilner/terra-draw/blob/main/guides/4.MODES.md
- OpenFreeMap style and use: https://openfreemap.org/quick_start/ and https://openfreemap.org/
- PostGIS spatial queries: https://postgis.net/docs/ST_Intersects.html
- OpenStreetMap data licensing: https://osmfoundation.org/wiki/Licence_and_Legal_FAQ
- Supabase PostGIS support: https://supabase.com/docs/guides/database/extensions
- Cloudflare R2 API: https://developers.cloudflare.com/r2/api/s3/api/
- Google Cloud Run deployments: https://docs.cloud.google.com/run/docs/deployment-options-for-services
