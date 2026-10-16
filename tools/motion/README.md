# OpenCoast motion drafts

Two silent, editable drafts explain two goals: understand coastal access and contribute evidence. Revision 4 extends both to 96 seconds and covers location, local categories, legal conditions, observed barriers, coast details, documents, evidence labels, edit/review dates and contributions. The cursor is white with a black outline. Status colors are green allowed, amber conditional and red restricted; proposed routes are dashed purple. Legends and detail panels sit on pale backgrounds for contrast. Square edges, curved connectors, Space Grotesk/Manrope typography and official Phosphor symbols are retained. Current outputs are 1280 × 720, 60 fps, H.264, in the ignored `artifacts/opencoast-motion/2026-10-11/v4/` folder. The combined preview is one level above; earlier sources and media remain available.

- `draft-a-workflow.mp4`: detailed editorial explanations, local category examples, a map/obstruction example, coast details, documents and contribution steps.
- `draft-b-map.mp4`: map walkthrough with sequential status highlights, a reported barrier, a slow camera focus, sources and dates, and a drawing/submission example. Example records and geography are explicitly illustrative, with no real legal claim.
- `contact-sheet.png`: fourteen chapter frames, with A in the left column and B in the right.

## Re-render

Use the dependency in this folder's package.json, or set `OPENCOAST_CANVAS_MODULE` to an existing installation of `@napi-rs/canvas`. FFmpeg must be available, or provide its executable through `OPENCOAST_FFMPEG`. Install the root project dependencies for its existing Space Grotesk and Manrope font files. `OPENCOAST_FONT_DIR` selects the installed Consolas annotation font; the Windows default is `C:/Windows/Fonts`. Font files are not committed here. Recheck layout if fonts change. Use standard hundred-step weights because the canvas parser misreads intermediate weights as font sizes.

```text
node render.cjs stills
node render.cjs video
node render.cjs video-b
node render.cjs social
```

`scenes-v4.cjs` contains the current copy, chapters, layout and motion. `cartography-v4.cjs` contains cached geography, status overlays, hatched conditional/restricted examples and transformed route geometry. Cursor positions share the drawn route geometry and camera transform. Earlier scene/map modules preserve previous designs. Transitions use cubic easing over 1.25 seconds, several seconds for cursor movement and long reading holds. There is no audio or simulated performance claim. The social command retains the site's original share card.

| Chapter | Time |
| --- | --- |
| Beach location and approach | 0–12 s |
| Local categories and access conditions | 12–25 s |
| Reported barriers and route rights | 25–38 s |
| Coast surface, activities and observations | 38–51 s |
| Documents, evidence labels and dates | 51–65 s |
| Anonymous contribution and human review | 65–87 s |
| Closing | 87–96 s |

Official icon SVGs and their MIT license are in `assets/`. The standard cursor styles the official Phosphor fill geometry with white fill and black stroke. To rebuild assets, set `OPENCOAST_PHOSPHOR_DIR` to an installed `@phosphor-icons/react` directory and run `node tools/motion/build-icons.mjs` from the repository root. Assets are included, so that library is not needed for rendering.

`verify.cjs` checks media format, full decoding, browser seeking/playback across every chapter and desktop/mobile preview layout. It needs FFprobe, FFmpeg, an installed Playwright module (or `OPENCOAST_PLAYWRIGHT_MODULE`), Edge and the combined preview served at `http://127.0.0.1:5190/` (or `OPENCOAST_PREVIEW_URL`). The latest results are in `v4/playback-report.json` alongside the videos. Set `OPENCOAST_CANVAS_MODULE` for both rendering and verification when using an existing bundled installation.

## Suggested real UI recordings

Record the actual site at a consistent viewport and normal pointer speed. Leave several seconds before and after each action for editing. Do not reveal a private receipt token, moderator credentials or unapproved uploaded evidence.

| Insert | Suggested duration | Show |
| --- | ---: | --- |
| Explore | 5–7 seconds | Pan to the coast and switch to terrain focus. |
| Evidence | 7–10 seconds | Open a genuine reviewed record and show its conditions, sources and dates. Use only existing approved information. |
| Draw | 8–12 seconds | Start an area or route contribution and draw slowly. Keep it as an unsubmitted demonstration. |
| Add sources | 6–8 seconds | Show description and official-source fields with clearly illustrative content. |
| Review | 4–6 seconds | Use the diagram's moderator stage unless a privacy-safe genuine example is available. |

Replace sections rather than adding fast cuts. An official source is encouraged, not mandatory. Moderator approval and document verification are separate. Boundaries are approximate, coverage is incomplete, and routes and areas can have different rules. Those distinctions should survive any edit.

Accuracy references: project README, the current contribution UI, record detail UI, and the public About, How it works and Evidence pages. Inspiration: HarneLoop's seven-step overview source and rendered reference, inspected on 10 October 2026. HarneLoop files were left unchanged.
