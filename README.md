<img src="web/public/favicon.svg" width="56" height="56" alt="OpenCoast shoreline logo">

# OpenCoast — Open-source coastal access map

**Beach access rights, routes to shore, and the evidence behind them.**

OpenCoast is an open-source web app for mapping community-reviewed information about **public beach access and coastal access rights**. People can draw coastal areas, paths to the shore, and access points; add descriptions, local conditions, and sources; and submit them anonymously. Moderators review each proposal before it appears on the public map.

[Explore the map](https://opencoast-web.vercel.app/) · [Contribute](CONTRIBUTING.md) · [How review works](docs/moderation-policy.md) · [Development guide](docs/development.md) · [Roadmap](https://github.com/Ker102/opencoast/issues)

[![CI](https://github.com/Ker102/opencoast/actions/workflows/ci.yml/badge.svg)](https://github.com/Ker102/opencoast/actions/workflows/ci.yml) · [Code license: MIT](LICENSE)

> **Early-stage project.** The map supports worldwide navigation and submissions; reviewed information grows place by place. An unmarked coast means **no reviewed access information yet**. It never means that access is forbidden or guaranteed.

## Why OpenCoast exists

Finding a beach on a map leaves several questions unanswered: What access is permitted? What conditions apply? Is there a reviewed route to reach it? Which sources support that information, and when were they checked?

OpenCoast brings those questions into one map. Each record ties a specific location to a description, jurisdiction, access status, evidence label, and review history. The project is useful to residents, coastal visitors, community mappers, source researchers, and developers building public-interest mapping tools.

Created by **[Kristofer Jussmann (Ker102)](https://github.com/Ker102)**, OpenCoast began with concerns about coastal access in Montenegro. Its scope is global; the [first Montenegro records](https://github.com/Ker102/opencoast/issues/5) are a source-review effort, not a preloaded set of legal conclusions.

## What can you map?

| Record type        | What it describes                                   | Why it is separate                                                                     |
| ------------------ | --------------------------------------------------- | -------------------------------------------------------------------------------------- |
| **Access area**    | A beach, foreshore, or other defined coastal area   | Conditions can apply to a particular area rather than an entire coastline.             |
| **Route to shore** | A path, entrance route, or coastal way              | An area's access status does not establish permission to cross the land leading to it. |
| **Access point**   | An entrance, gate, sign, or other relevant location | A precise point can explain where an access condition or observation applies.          |

Records can include local categories, allowed activities, conditions, source links, and observations. A leased beach or concession can be described with its specific conditions and evidence; OpenCoast does not assume that one label determines every right at that location.

## What works now

- **A responsive global map:** browse in a desktop or mobile browser, with an OpenStreetMap-derived basemap supplied by OpenFreeMap.
- **A terrain Focus view:** neutral land colors and hillshade keep the coastline readable while reviewed access areas, routes, and points stand out.
- **Precise drawing tools:** draw and edit points, lines, and polygons, adjust vertices, undo changes, and review geometry before submitting.
- **Anonymous contributions:** submit information or corrections without creating an account. Save a private receipt link to follow the review and answer moderator questions.
- **Evidence and dates:** records distinguish access status from evidence strength and show edit dates separately from source-review dates.
- **Moderated publication:** moderators can request clarification, edit wording with an audit reason, approve or reject proposals, and inspect private evidence. Published records have revision histories.
- **Reviewed area-to-route links:** moderators can link a coastal area to separate approach-route records. A verified land-route label depends on the linked route's current visibility, evidence, and access status.

## How to read coastal access information

### Access status

| Status          | Meaning in OpenCoast                                                        |
| --------------- | --------------------------------------------------------------------------- |
| **Allowed**     | The reviewed claim describes access as permitted within the record's scope. |
| **Conditional** | The record describes access subject to stated limits or conditions.         |
| **Restricted**  | The record describes a restriction on access.                               |
| **Disputed**    | The claim is contested or credible evidence conflicts.                      |
| **Unknown**     | The available information does not establish the applicable access rule.    |

Read the description and conditions alongside the status. An access label is a reviewed claim with a defined scope, not a guarantee for every activity or date.

### Evidence strength

**Document backed** means a moderator checked at least one linked official source against the claim and geometry. The explanation should identify what the source supports and any remaining uncertainty.

**Community reviewed, no official source verified** means a moderator approved the information for display without verifying an official source. These records carry a visible label; they must not be read as legally verified access rights.

Hand-drawn boundaries are labeled approximate. An edit date does not imply a new legal-source review. Read the [moderation policy](docs/moderation-policy.md) for the full review standard.

## Contribute beach-access information

1. **Find the location** in the [live map](https://opencoast-web.vercel.app/). Pan and zoom, or enter `latitude, longitude`; place-name search is [planned](https://github.com/Ker102/opencoast/issues/6).
2. **Choose Add information** and draw an area, route, or point. Existing records also accept proposed corrections.
3. **Describe the claim:** include the jurisdiction, local category where useful, conditions, and what you observed or read.
4. **Add sources and evidence.** Official documents and direct links are strongly encouraged, but they are optional. Original uploads are private to moderators; only separately approved images with publication consent can appear publicly.
5. **Save the private receipt link.** A moderator reviews the proposal and may ask for clarification before publication.

Coastal access reports belong in the app's review workflow. Use GitHub issues for software bugs, documentation, and feature proposals. See the [contribution guide](CONTRIBUTING.md) for both paths.

## Frequently asked questions

### Is OpenCoast a worldwide database of legally verified public beaches?

OpenCoast supports a worldwide map and contributions from different jurisdictions. Coverage depends on submitted and reviewed records, and some published records have no verified official source. It is an early-stage information project, not a complete legal database or legal authority.

### Does a blank map mean a beach is private or closed?

No. It means there is no reviewed access information displayed there. The basemap's parks, roads, beaches, and land colors are geographic context; they are not OpenCoast access claims.

### Can I submit without an account or an official document?

Yes. Public submissions do not require an account, and official sources are encouraged rather than mandatory. Every submission still requires moderator review. If an official source has not been verified, the published record says so.

### How is a public beach connected to its access route?

The beach area and route are reviewed as separate records. A moderator must explicitly link them after checking the geometry and sources. OpenCoast does not infer an access route because a nearby road or path appears to reach the beach.

### Does submitting to OpenCoast edit OpenStreetMap?

No. OpenCoast stores its reviewed access records in its own database. OpenFreeMap provides the OpenStreetMap-derived background map. Submissions here are not automatically written to OpenStreetMap.

### Is the coastal access data open data?

The software is open source under the MIT license. Approved records in the hosted database do not yet have an open-data license; obtain permission before redistributing them. Private evidence and third-party source material have separate rights. See [licensing and attribution](#licensing-and-attribution).

### Can I use OpenCoast on my phone?

Yes, through its responsive web interface. Drawing is designed for touch as well as desktop input. There is no native mobile app yet, and [real-device testing and accessibility review](https://github.com/Ker102/opencoast/issues/4) remain active work.

## Help build OpenCoast

Contributions are useful across several areas:

- **Local knowledge and source research:** submit carefully scoped records and corrections through the map. Include relevant provisions, source dates, and uncertainty.
- **Mapping and user experience:** improve drawing, navigation, readable legends, keyboard access, and touch interaction.
- **Software and infrastructure:** help with geospatial queries, moderation tools, evidence handling, testing, and deployment reliability.
- **Documentation:** improve explanations and developer onboarding. Translations and localization proposals are welcome.

Read [CONTRIBUTING.md](CONTRIBUTING.md), browse [open issues](https://github.com/Ker102/opencoast/issues), or [propose an improvement](https://github.com/Ker102/opencoast/issues/new/choose). Report security concerns through [private vulnerability reporting](https://github.com/Ker102/opencoast/security/advisories/new).

## Technology and repository structure

| Layer                | Implementation                                         | Location             |
| -------------------- | ------------------------------------------------------ | -------------------- |
| Web interface        | React, TypeScript, Vite, MapLibre GL JS, Terra Draw    | [`web/`](web/)       |
| API and moderation   | Fastify, TypeScript, private evidence handling         | [`api/`](api/)       |
| Data contracts       | Zod schemas and GeoJSON types                          | [`shared/`](shared/) |
| Spatial storage      | PostgreSQL and PostGIS; hosted on Supabase             | [`api/db/`](api/db/) |
| Hosting and evidence | Vercel web/API projects; private Cloudflare R2 storage | [`infra/`](infra/)   |

### Run locally

The current CI uses Node.js 24. Install Node.js 24+, npm, and Docker, then:

```sh
git clone https://github.com/Ker102/opencoast.git
cd opencoast
npm ci
docker compose up -d
npm run db:migrate
npm run dev
```

Open `http://localhost:5173`. Local databases start with zero asserted access records. The [development guide](docs/development.md#run-locally) covers environment settings, ports, local uploads, and creating a moderator account.

### Checks

See [validation commands and the isolated database integration test](docs/development.md#checks).

### Hosted deployment

See [Vercel, Supabase/PostGIS, and private Cloudflare R2 configuration](docs/development.md#hosted-deployment).

## Current release limits

The current implementation supports reviewed publication, but several tasks remain before broad promotion: [upload and abuse-control hardening](https://github.com/Ker102/opencoast/issues/3), [real-device touch and accessibility testing](https://github.com/Ker102/opencoast/issues/4), [independent source review for the first Montenegro records](https://github.com/Ker102/opencoast/issues/5), and [place-name search](https://github.com/Ker102/opencoast/issues/6).

No jurisdiction-wide law is automatically applied to beaches. A reported obstruction and a documented legal right are separate claims. OpenCoast's records explain the evidence reviewed; they do not replace the source documents or establish legal boundaries.

See the [project design](docs/plans/2026-09-24-opencoast-design.md) and [progress tracker](task.md). Images in `docs/design-reference` are visual concepts with fictitious example claims; they are not map data.

## Licensing and attribution

- **Software:** [MIT](LICENSE), permitting use, modification, and redistribution under its terms.
- **Hosted access records:** operator-controlled, with no open-data license yet. Discuss reuse with the [maintainer](https://github.com/Ker102).
- **Evidence and source documents:** retain their own rights and publication restrictions. Uploaded originals are private.
- **Basemap and terrain:** attribution to [OpenStreetMap](https://www.openstreetmap.org/copyright), [OpenFreeMap](https://openfreemap.org/), [OpenMapTiles](https://www.openmaptiles.org/), and [Mapterhorn](https://mapterhorn.com/attribution) remains visible in the map as applicable.

For articles, research, or software reuse, link to [OpenCoast on GitHub](https://github.com/Ker102/opencoast) and use [CITATION.cff](CITATION.cff) for software citation details. Citing the software does not verify any particular coastal access claim.

Project overview last reviewed: **2026-09-28**.
