# OpenCoast design

## Goal

Give anyone a global map where they can inspect source-backed coastal access rights, including lawful routes to the shore, and contribute precise corrections for moderator review.

## Product principles

- The map is available worldwide from launch. Places without reviewed records say **No reviewed access information yet**. Absence of a record never implies access is forbidden.
- Explain what a person may do at a location in plain language. Keep legal rights, concessions, physical routes, and observed conditions distinct.
- A public beach, a leased beach, and a path to that beach may have different rules. A lease does not by itself establish that public access is either granted or denied.
- Show the source, the review basis, and dates for every published claim. Never claim survey-level boundary precision from a hand-drawn outline.
- Browsing and contributing require no account. Accounts are optional for personal features, and account holders may keep their public identity hidden.
- Code is public on GitHub. The project operator controls the live database. Publication or licensing of approved map records is a separate decision.

## Map experience

The default screen is a responsive, mobile-first map with a compact search control, a legend, and a prominent **Add information** action. The base map uses OpenStreetMap-derived geography with visible attribution and an appropriate tile service. OpenCoast overlays only reviewed records.

The overlay has three geometry types:

1. **Areas** describe a specific part of the coast where a stated access rule applies.
2. **Lines** describe a lawful route to the shore or a right to move along it.
3. **Points** describe entrances, gates, signs, or other precise locations.

Selecting a record opens a card with: plain-language access summary; allowed activities and conditions; jurisdiction and local category; evidence level; source links; moderator explanation; **last edited**; and **last reviewed against sources**. The card may link a shore area to one or more routes. If the shore's use is documented but no land route has been checked, say **Land route not verified**.

Evidence level and access status are separate. Access status can be *allowed*, *conditional*, *restricted*, *disputed*, or *unknown*. Evidence level can be *document backed* or *community reviewed without an official source*. A disputed or community-reviewed claim must be visibly labeled on the main map and in its detail card. Country-level rule cards provide context but do not automatically color every beach in that country.

## Contributor experience

The contributor chooses an area, line, or point; draws it; adjusts vertices; and reviews the geometry before submitting. Mobile uses tap-to-place vertices, large editing handles, undo, and a full-screen review step. The form asks for a short claim, free-text description, jurisdiction, applicable conditions, source links where available, observation date where relevant, and optional files. Official sources are strongly encouraged but not mandatory.

Anonymous contributors receive a private receipt link for status updates and moderator questions. Losing that link means losing access to the submission. Optional account features can later include saved drafts, notification preferences, and contribution history. Public attribution remains optional even for account holders.

## Review and publication

New proposals stay out of the public overlay until a moderator approves them. Moderators review the exact geometry and claim, inspect supporting material, request clarification, edit a proposed description with an audit trail, approve, or reject with a reason. A published record retains revisions and source history. A new approved revision supersedes the old map display without deleting its history.

Moderators select which submitted files become public. Raw uploads remain private by default. Before publication, photos and documents should be checked for faces, personal details, and location metadata. Public evidence should have a clear source and permission to publish. The public card should describe the moderator's reasoning without exposing contributor identity, contact information, IP address, or private receipt token.

Anonymous submission needs rate limits, duplicate detection, file limits, and abuse review. Moderators need a way to pause publication of a challenged claim and show its disputed status. The review policy should separate a documented observation from a legal conclusion.

## Data and service design

- A spatial database stores jurisdiction rules, access features, geometry, descriptions, conditions, source citations, evidence classifications, dates, and revision history.
- A proposal store keeps pending submissions and private evidence separate from the public record.
- An API serves the approved overlay by map viewport and supports submission receipts and moderator actions. It is designed so a future mobile app can use the same data and workflow.
- A private file store holds submitted evidence. Only moderator-selected, processed files receive public URLs.
- Geometry is exported as GeoJSON for interoperability. OpenStreetMap licensing and each third-party source's reuse terms are reviewed before combining datasets or publishing exports.

## First milestone

Ship a responsive global map, public record cards, area/line/point drawing, anonymous submission with optional links/files/description, private receipt links, moderator review, and revision dates. Launch with no asserted legal-access records. Records appear only after a submitted or moderator-authored proposal passes review. The world remains available for contributions and visibly unreviewed wherever no approved record exists.

Out of scope for this milestone: a native app, automated legal interpretation, automated OSM edits, public dispute feeds, countrywide inferred access shading, and claims that every coast has a lawful land route.

## Validation

- Test geometry creation and editing on desktop, iOS Safari, and Android Chrome, including narrow beaches and paths.
- Test that pending proposals and private evidence never appear in public API responses.
- Test that public records have a visible access status, evidence level, source or source-absence label, and distinct edit/review dates.
- Test that an anonymous receipt grants access only to its own submission.
- Review first Montenegro entries against current official documents and have a second moderator check their geometry and wording.

## Initial research anchors

- Montenegro coastal authority beach atlas: https://www.morskodobro.me/me/kupalista/atlas-crnogorskih-plaza-i-kupalista
- Montenegro 2024–2028 Budva temporary-objects plan, February 2025 amendment: https://wapi.gov.me/download/eaeb3c5f-d803-4c51-a5a7-a82f39be9876?version=1.0
- OpenStreetMap Foundation licensing: https://osmfoundation.org/wiki/Licence_and_Legal_FAQ
- OpenStreetMap Foundation tile policy: https://operations.osmfoundation.org/policies/tiles/
- MapLibre GL JS: https://maplibre.org/maplibre-gl-js/docs/
- Terra Draw touch modes: https://github.com/JamesLMilner/terra-draw/blob/main/guides/4.MODES.md
