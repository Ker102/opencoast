# OpenCoast custom domain

`opencoast.kaelux.dev` is assigned to the Vercel project `opencoast-web`. DNS resolution, HTTPS and the same-origin API health response were verified on 10 October 2026. The current web deployment is aliased to this hostname. The old Vercel hostname now redirects to the custom domain.

## DNS record

The existing record in the `kaelux.dev` DNS zone is:

| Type | Name | Value |
| --- | --- | --- |
| CNAME | `opencoast` | `d33e801daf5fd3d2.vercel-dns-017.com` |

This is the project-specific target returned by Vercel's domain verification command on 5 October 2026. Keep the existing nameservers. The same hostname must not have conflicting A, AAAA, or other CNAME records.

The initial alias attempt failed before DNS was configured. This is now resolved: the public map and `https://opencoast.kaelux.dev/api/health` respond over HTTPS. Continue using the custom hostname for shared links and browser sessions.

## Application origins

During the transition, the API's production `WEB_ORIGIN` value is:

```text
https://opencoast.kaelux.dev,https://opencoast-web.vercel.app
```

The API accepts only exact origins in this list for CORS and moderator mutations. The private R2 bucket also permits signed PUT uploads with `Content-Type` from both origins, as recorded in `infra/r2-cors.json`.

The API project and the web project's `/api` proxy keep their existing addresses. Moderator sessions are scoped to the browser hostname, so moderators sign in again when moving to the custom domain.
