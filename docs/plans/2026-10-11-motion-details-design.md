# Extended motion explainers

## Brief

Use a white cursor with a black outline. Extend both videos with beach location, access routes, observed barriers, coast conditions, local categories, lease/license restrictions, sources and dates. Improve map animation, status semantics and contrast, particularly against Draft B's teal frame.

## Design

96 seconds each. Chapters: locate/access (0–12), categories and rules (12–25), physical barriers (25–38), coast conditions (38–51), documents and dates (51–65), contributions and review (65–87), closing (87–96). Keep the two main goals and square panels. A has larger explanatory layouts and more copy; B follows the map with changing details beside it.

Map colors represent access status, not document verification: green allowed, amber conditional, red restricted. Proposed routes use a dashed purple line. Put the legend on a pale plate with dark text and explicit labels; use light casings and stronger outlines for map overlays. Show local category separately from access status. Lease/license terms and private ownership do not imply a universal rule. Barriers are observations, not legal determinations. Unknown/unverified information stays explicit.

Use official Phosphor cursor geometry styled white with black stroke. Cache static geography, animate selection/drawing and apply a slow, small camera focus where helpful. Keep cursor coordinates tied to transformed route geometry. Preserve prior versions and output v4 locally.

## Verification

Check copy against the current record/contribution UI and distinguish illustrative records from actual product screenshots. Inspect every chapter, cursor visibility, status legends, text widths and safe margins. Export and fully decode both videos; verify browser seeking/playback and desktop/mobile preview. No production app or automation changes.

## Completed

Both v4 exports are 96 seconds, 1280 × 720, 60 fps and 5,760 frames. Chapter stills and full-size category/barrier/source compositions were inspected. The standard cursor is white with black stroke around official library geometry. Map colors now encode access status separately from evidence quality; pale legends and detail panels preserve contrast against the teal frame. Status highlights appear sequentially, camera focus is restrained and cursor positions share the map route geometry.

Both exports passed full text-width validation and complete FFmpeg decoding. Edge seeking/playback passed at 8, 18, 31, 44, 57, 76 and 91 seconds. Desktop/mobile preview overflow and square-panel checks passed. Receipts are in artifacts/opencoast-motion/2026-10-11/v4/playback-report.json. The stopped local preview server was restarted in a hidden background process at http://127.0.0.1:5190/.

Copy was checked against RecordDetail.tsx, Contribution.tsx and the existing map status colors. Local category, legal conditions, physical observations and evidence verification are explained separately. All records and geography remain illustrative; no live data or new product feature is claimed. Earlier drafts are preserved.
