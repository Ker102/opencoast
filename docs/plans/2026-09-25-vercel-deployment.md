# Vercel deployment and private evidence plan

## Objective

Deploy the existing public map and API as two dedicated Vercel projects from the monorepo, backed by a dedicated Supabase PostGIS database and a private Cloudflare R2 bucket. Keep 10 MB private evidence uploads working despite Vercel's 4.5 MB function payload limit.

## Decisions

- Use `web` and `api` as separate Vercel project roots. The web project proxies `/api/*` to the API project so the browser keeps a first-party moderator session.
- Keep the existing Fastify application. Vercel serves it through the Node function at `api/api/index.mjs` and the rewrite in `api/vercel.json`. Build the shared workspace first in each project. The native Fastify framework entry hung in this project during deployment checks, so the explicit Node function is the verified route.
- In hosted mode, issue short-lived R2 presigned PUT URLs for browser evidence uploads. Keep uploads in a staging key until the API validates actual bytes, type, and size, then copy into a private final key. Local development can retain the existing multipart upload.
- Return short-lived R2 presigned GET redirects for moderator private evidence and approved public derivatives; never make the bucket public.
- Keep the Supabase Data API disabled because this app uses direct PostgreSQL connections. Add SQL revocations as defense in depth for every application table.
- Do not publish any legal access records during infrastructure setup.

## Implementation

1. Replace Cloud Run web proxy configuration with the Vercel API project origin. Add project-level configuration and document monorepo settings.
2. Add a durable upload intent table and storage helpers for signed URLs, HEAD/GET, staging cleanup, and final object storage.
3. Add receipt-protected initiate/finalize routes; validate the actual uploaded bytes and reject missing, expired, oversized, or incorrectly typed objects. Route the web form through this flow in hosted mode.
4. Redirect authorized evidence reads to short-lived GET URLs in hosted mode, retaining direct local reads for development.
5. Add Supabase public-schema grant lockdown and document disabling its Data API.
6. Run migrations against the test database, integration tests, type checks, build, formatting, and security audit. Test the browser flow locally where possible.
7. Use device login to create dedicated Supabase, R2, and Vercel projects, configure secrets and R2 CORS, deploy API then web, and verify health, empty map, anonymous receipt, evidence, and moderator flow.

## Deployment status

The dedicated Supabase project and private R2 bucket are configured. The API and web projects are deployed. `/health`, the empty reviewed-record query, and the web project's same-origin `/api` proxy return 200. A temporary anonymous proposal passed receipt lookup, R2 browser CORS preflight, signed PUT, and server-side evidence validation, then its database rows and objects were removed. A moderator account passed sign-in, session, queue, and logout checks through the web origin. SQL checks confirm no `anon`, `authenticated`, or `service_role` SELECT grant on four sensitive application tables, and zero public access records.

Supabase's Data API toggle has not been disabled in the dashboard yet. The SQL revocations protect the private tables checked above; the dashboard toggle remains a separate release task.

## Risks and checks

- Presigned URLs are bearer tokens. Keep them scoped to one staging object and short lived; copy validated bytes to a different final key so the signed URL cannot overwrite published evidence.
- R2 needs a CORS rule for the exact public web origin and `PUT` with `Content-Type`; local development uses its own multipart route.
- A production URL is not proof of public readiness. Verify the private bucket, database access boundaries, end-to-end submission, and moderation before inviting public submissions.
- Vercel Hobby has finite limits; usage and service availability must be checked after account setup. Google Cloud is not needed for this first deployment.

## Primary references checked 2026-09-25

- https://vercel.com/docs/frameworks/backend/fastify
- https://vercel.com/docs/monorepos
- https://vercel.com/docs/routing/rewrites
- https://vercel.com/docs/functions/limitations
- https://developers.cloudflare.com/r2/api/s3/presigned-urls/
- https://developers.cloudflare.com/r2/buckets/cors/
- https://supabase.com/docs/guides/api/securing-your-api
