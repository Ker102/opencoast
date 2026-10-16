# Motion map refinement

## Goal

Make the geography and the map actions immediately understandable in both existing motion drafts. Preserve square panels, curved paths, typography, two narrative goals and slow pacing.

## Design

Use a detailed illustrative coastal village rather than a few abstract curves. Blue sea, pale land, beige beach, muted vegetation, hill contours, streets and building footprints establish place. Blue outlined beach coverage, orange walking access and a dashed purple proposed route distinguish contribution data from background geography. Name the sea, village, beach and paths and add a persistent overlay legend. All examples remain clearly illustrative.

Draft A keeps its editorial split. Draft B uses a dedicated colored map beside the evidence panel so geography stays visible and does not stretch behind the panel. Cursor targets are derived from the same route geometry used for drawing.

## Implementation and validation

Preserve v2 source/media. Create scenes-v3.cjs and a reusable cartography.cjs module, with cached static geography for efficient full-frame rendering. Render v3 in artifacts/opencoast-motion/2026-10-11/v3. Inspect small and large maps at full resolution, verify route and cursor alignment, and check typography/legend margins. Export both 40-second, 60 fps clips; run full decoding and browser playback checks, then refresh the existing combined preview.

No live website, deployment or automation changes.

## Completed on 11 October 2026

Both map compositions rebuilt and inspected at full resolution. Land, sea, sand beach, wooded hill contours, streets and building footprints are separated visually and labelled. Blue documented coverage, orange walking access and purple proposed access match the legend. The evidence panel sits outside the larger map, and the cursor follows the same geometry as the routes.

Both 40-second, 1280 × 720, 60 fps exports passed text-width validation, complete FFmpeg decoding, browser seeking/playback and desktop/mobile preview checks. Media and playback receipts are in artifacts/opencoast-motion/2026-10-11/v3; the combined preview runs at http://127.0.0.1:5190/. Earlier drafts are preserved.
