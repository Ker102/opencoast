# Search and AI discovery

Canonical site: [opencoast.kaelux.dev](https://opencoast.kaelux.dev). The production changes were deployed on 10 October 2026 to the existing Vercel web project. The map, API proxy and public information pages were checked on the custom domain.

## Public information

- [About](https://opencoast.kaelux.dev/about): purpose, coverage, anonymity, authorship, source code and basemap attribution.
- [How it works](https://opencoast.kaelux.dev/how-it-works): browsing, drawing, sources, private receipt and moderation.
- [Evidence](https://opencoast.kaelux.dev/evidence): access states, document verification, community review, dates and boundaries.

These are static, readable HTML pages. The homepage also includes useful HTML before JavaScript loads, and a no-JavaScript explanation. The interactive map links to all three pages. No legal records or coverage claims were fabricated for search content.

`web/scripts/generate-discovery.mjs` is the source for page copy, canonical URLs, descriptions, Open Graph and Twitter metadata, WebSite/WebPage/SoftwareApplication structured data, sitemap.xml, robots.txt and llms.txt. The web prebuild regenerates them deterministically. Edit the content date when the underlying content changes. The shared public styling is `web/public/discovery.css`; the existing app styles remain separate. The social image is generated from the existing identity by `tools/motion/render.cjs social`.

## Routing and indexing

The old `opencoast-web.vercel.app` host redirects permanently to the custom domain. Public information pages have their own canonical URLs. Unsupported paths return HTTP 404 rather than the map shell. The API proxy still forwards to the existing API project.

The sitemap lists only the four public canonical pages. Contribution, moderator and private receipt pages return X-Robots-Tag noindex headers. API and private workflow paths are excluded from crawler discovery. These controls are separate from application authentication; robots.txt is not a privacy boundary. Receipts and original evidence remain protected by the application's existing access controls.

The general crawler policy allows public pages. OpenAI documents that OAI-SearchBot controls search discovery and is separate from GPTBot's training use. No new training opt-out policy was chosen in this change. See [official OpenAI crawler documentation](https://developers.openai.com/api/docs/bots). `llms.txt` is a concise optional reading aid; it is not an indexing or ranking guarantee.

## What remains outside code

Search engines decide when to crawl, index and cite a page. This implementation does not establish that OpenCoast is indexed or ranked. The owner can verify the domain in Google Search Console and Bing Webmaster Tools and submit `https://opencoast.kaelux.dev/sitemap.xml`. Link to the canonical site from the GitHub repository and genuine project articles. Keep the public explanations and approved local information current as coverage grows.

The content follows Google's emphasis on useful, original information for readers. It explains evidence and uncertainty without manufacturing legal claims, reviews or ratings. See [Google's helpful-content guidance](https://developers.google.com/search/docs/fundamentals/creating-helpful-content). Vercel routing uses its documented [configuration](https://vercel.com/docs/project-configuration/vercel-json).

## Verification on 10 October

- Web production build, type checking and source formatting passed.
- Unit suite: 7 tests passed. Two database integration tests were skipped because their explicit test database run was not enabled; production data was not used for tests.
- Public pages, crawler files and share image returned HTTP 200 with expected content types.
- Private workflow pages returned noindex headers; unknown path returned 404; old host returned a 308 redirect to the custom domain.
- Desktop at 1280px and mobile at 390px showed no horizontal overflow; headings, canonical tags and JSON-LD parsed correctly. The homepage was readable with JavaScript disabled.
- Video exports were inspected and fully decoded without FFmpeg errors; each is 40 seconds, 1280 × 720, 30 fps, with no audio.

Local receipts and screenshots are in the ignored `artifacts/` folder. Deployment ID: `dpl_7T2D8sR3wagtzm3CWHUiDVtGJfZR`.

The deployment's existing dependency audit reported four advisories: concurrently/shell-quote (development tooling), sharp (API image processing) and source-map-js. This discovery change added no app dependencies and does not claim those advisories were fixed. The saved audit is `artifacts/dependency-audit.json`; dependency remediation should include the API and its evidence-processing checks.
