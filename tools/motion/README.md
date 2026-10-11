# OpenCoast motion drafts

Two silent, editable drafts explain two goals: understand coastal access and contribute evidence. Revision 2 uses square component edges, curved coastlines and connectors, Space Grotesk/Manrope typography, and official Phosphor duotone symbols. Each is 40 seconds, 1280 × 720, 60 fps, H.264. Current outputs live in the ignored `artifacts/opencoast-motion/2026-10-10/v2/` folder. The combined preview is one level above; original media remains available there.

- `draft-a-workflow.mp4`: cream editorial composition with large headlines, a square map plate and a curved knowledge-to-source-to-review diagram.
- `draft-b-map.mp4`: deep teal cartography with separate area and route overlays, a smooth cursor drawing demonstration and square evidence/review panels. Example records are explicitly illustrative, with no real legal claim.
- `contact-sheet.png`: eight representative frames, with A in the left column and B in the right.

## Re-render

Use the dependency in this folder's package.json, or set `OPENCOAST_CANVAS_MODULE` to an existing installation of `@napi-rs/canvas`. FFmpeg must be available, or provide its executable through `OPENCOAST_FFMPEG`. Install the root project dependencies for its existing Space Grotesk and Manrope font files. `OPENCOAST_FONT_DIR` selects the installed Consolas annotation font; the Windows default is `C:/Windows/Fonts`. Font files are not committed here. Recheck layout if fonts change. Use standard hundred-step weights because the canvas parser misreads intermediate weights as font sizes.

```text
node render.cjs stills
node render.cjs video
node render.cjs video-b
node render.cjs social
```

`scenes-v2.cjs` contains the current editable copy, shapes, colors and time-based motion. `scenes.cjs` preserves the original design and social-card function. The renderer uses cubic easing over 1.25 seconds for transitions, several seconds for cursor movement and long reading holds. There is no voice track, music or simulated performance claim. The social command retains the site's original deterministic share card.

Official icon SVGs and their MIT license are in `assets/`. To rebuild those assets, set `OPENCOAST_PHOSPHOR_DIR` to an installed `@phosphor-icons/react` directory and run `node tools/motion/build-icons.mjs` from the repository root. The assets are already included, so that library is not needed for normal rendering.

`verify.cjs` checks media format, full decoding, browser seeking/playback and desktop/mobile preview layout. It needs FFprobe, FFmpeg, an installed Playwright module (or `OPENCOAST_PLAYWRIGHT_MODULE`), Edge and the combined preview served at `http://127.0.0.1:5189/`. The latest results are in `v2/playback-report.json` alongside the videos.

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
