# Reviewed approach routes for access areas

## Goal

Show whether an access area has a separately reviewed route from land, while keeping the area's use rules and the route's access rules distinct.

## Design choice

Two approaches were considered: storing route IDs directly on an area record, or storing a separate reviewed relationship. A separate relationship is safer because a route can change status or visibility independently of the beach. The public area status is derived from the current linked route records, so an obsolete route cannot leave an area marked as verified.

## Data and API

- Store links from published areas to published route records in `access_route_links`. A moderator can replace an area's set of links through one transaction and must give an audit reason. Append before/after sets to `route_link_events` and a public area revision.
- A linked route counts as a verified land approach only when it is visible, document backed, and currently marked `allowed` or `conditional`. Other linked routes may be shown with their own evidence and status labels, but do not make the area say its land route is verified.
- The public area response includes linked route IDs and derived `landRouteStatus`. A public `/records/:id/routes` endpoint returns the current linked route records. A moderator-only candidate endpoint lists nearby published routes and current selections.
- Links never follow proximity automatically. The moderator confirms the relationship after inspecting the geometry and sources. A later route revision immediately affects the derived area status.

## Interface

The area card says `Land route not verified` when no qualifying route is linked. When linked routes exist, it lists each one with its own access and evidence labels and a control to focus that route on the map. A signed-in moderator can open route management for that area, select nearby reviewed routes, and save with a reason. A contributor can still suggest a correction through the normal anonymous flow.

## Validation

An integration flow must show: no link by default; a moderator can link an eligible route; the public area displays the route and verified status; an ineligible or hidden route never grants verified status; a moderator can remove a link; history and audit events capture changes; unauthenticated and cross-origin mutations fail.
