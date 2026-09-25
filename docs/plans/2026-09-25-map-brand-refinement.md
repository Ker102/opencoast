# Focus map and brand refinement

## Current state

The product is a light, map-first interface using deep teal, DM Sans body copy, Manrope headings, and a widely tracked all-caps text logo. The favicon is a generic two-wave mark and is not shown in the header. Focus view recolors base fills but leaves the Liberty style's green park `fill-outline-color` intact, allowing unreviewed parks to resemble reviewed access polygons.

## Design direction

Preserve the existing routes, content, form flow, and teal identity. Use a restrained trust-first style: design variance 4, motion 2, visual density 5. Draw a compact vector symbol that combines a shoreline and a path reaching it, and use it for both the header and favicon. Set the wordmark in locally hosted Space Grotesk with mixed-case `OpenCoast`, tighter spacing, and a quieter sentence-case subtitle. Keep DM Sans and Manrope locally hosted for the rest of the app.

In Focus view, recolor all base-map land fills and any explicit fill outlines to cool neutral grays. Mute the wetland pattern and base icons. Keep blue water, gray roads, hillshade, and the existing colored OpenCoast records and drawing overlays. Restore the original style values on returning to Standard view.

## Checks

Compare the exact Policoro coast shown in the report before and after the change. Verify that all basemap park boundaries are neutral, map attribution and terrain remain, and the view switch restores the original colors. Inspect the logo at desktop and phone sizes, including its favicon-scale form. Run typecheck, build, tests, and a production browser check after deployment.

## Result

The Policoro coastline was checked at desktop and phone widths. Park fills and their borders are neutral in Focus view, while the original green map style returns in Standard view. The mark and wordmark fit both headers. Production verification follows deployment.
