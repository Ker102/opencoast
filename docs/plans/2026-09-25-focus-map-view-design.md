# Focus map view

## Goal

Give readers a one-tap view that makes reviewed coastal access records and routes easier to read while retaining roads, paths, places, and visible terrain.

## Approach

Keep the current OpenFreeMap Liberty style and MapLibre instance. Recolor only its original base layers to a neutral land palette, soft blue water, and quiet roads and labels. Add a light Mapterhorn hillshade below the water layer so slopes remain visible without tinting the sea. Leave OpenCoast records, contribution previews, and TerraDraw layers untouched. A button toggles the focus view in place and restores the original layer paint values.

This avoids rebuilding the map, which would disrupt an in-progress drawing or selection. It also avoids relying on a different base style that might omit paths or elevation. The Mapterhorn source is requested only while focus view is on; its attribution appears through the map control.

## Interaction and validation

Put an accessible pressed-state button below the map navigation controls on desktop and mobile. Keep the standard view as the initial view. Verify the visual difference and return path at coastal and global zooms, and verify that drawing and reviewed overlays stay vivid through toggles.
