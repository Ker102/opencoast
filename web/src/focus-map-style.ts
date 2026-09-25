import type { Map as MapLibreMap } from 'maplibre-gl';

type PaintChange = {
  layerId: string;
  property: string;
  original: unknown;
  focused: unknown;
};

const terrainSourceId = 'opencoast-focus-terrain';
const terrainLayerId = 'opencoast-focus-hillshade';

function baseColor(id: string, type: string): string | null {
  if (type === 'background') return '#eff1ee';
  if (type === 'fill-extrusion') return '#d5dcda';
  if (type === 'fill') {
    if (id === 'water') return '#c9dee1';
    if (id === 'landcover_sand') return '#e7e5df';
    if (/park|wood|grass|wetland|cemetery/.test(id)) return '#e7e9e8';
    if (id === 'building') return '#d8dddc';
    return '#eceeed';
  }
  if (type === 'line') {
    if (/waterway/.test(id)) return '#a3bec3';
    if (/path_pedestrian|service_track/.test(id)) return '#8ea5a2';
    if (/_casing|_outline/.test(id)) return '#b5c3c2';
    return '#c3cecd';
  }
  if (type === 'symbol') return /water/.test(id) ? '#64838a' : '#687b7b';
  return null;
}

export function captureFocusPaint(map: MapLibreMap): PaintChange[] {
  const changes: PaintChange[] = [];
  for (const layer of map.getStyle().layers) {
    const paint = layer.paint as Record<string, unknown> | undefined;
    if (!paint) continue;
    const color = baseColor(layer.id, layer.type);
    if (!color) continue;
    const property =
      layer.type === 'background'
        ? 'background-color'
        : layer.type === 'fill-extrusion'
          ? 'fill-extrusion-color'
          : layer.type === 'fill'
            ? 'fill-color'
            : layer.type === 'line'
              ? 'line-color'
              : 'text-color';
    if (property in paint) {
      changes.push({ layerId: layer.id, property, original: paint[property], focused: color });
    }
    if (layer.type === 'fill' && 'fill-outline-color' in paint) {
      changes.push({
        layerId: layer.id,
        property: 'fill-outline-color',
        original: paint['fill-outline-color'],
        focused: '#cbd2d0',
      });
    }
    if (layer.id === 'landcover_wetland' && 'fill-pattern' in paint) {
      changes.push({
        layerId: layer.id,
        property: 'fill-opacity',
        original: paint['fill-opacity'] ?? 1,
        focused: 0.15,
      });
    }
    const layout = layer.layout as Record<string, unknown> | undefined;
    if (layer.type === 'symbol' && layout && 'icon-image' in layout) {
      changes.push({
        layerId: layer.id,
        property: 'icon-opacity',
        original: paint['icon-opacity'] ?? 1,
        focused: 0.36,
      });
    }
    if (layer.id === 'natural_earth' && 'raster-opacity' in paint) {
      changes.push({
        layerId: layer.id,
        property: 'raster-opacity',
        original: paint['raster-opacity'],
        focused: 0.12,
      });
    }
  }
  return changes;
}

export function setFocusMapStyle(map: MapLibreMap, changes: PaintChange[], focused: boolean) {
  for (const change of changes) {
    map.setPaintProperty(
      change.layerId,
      change.property as never,
      (focused ? change.focused : change.original) as never,
    );
  }

  if (focused) {
    if (!map.getSource(terrainSourceId)) {
      map.addSource(terrainSourceId, {
        type: 'raster-dem',
        tiles: ['https://tiles.mapterhorn.com/{z}/{x}/{y}.webp'],
        tileSize: 512,
        encoding: 'terrarium',
        maxzoom: 12,
        attribution: '<a href="https://mapterhorn.com/attribution">© Mapterhorn</a>',
      });
    }
    if (!map.getLayer(terrainLayerId)) {
      map.addLayer(
        {
          id: terrainLayerId,
          type: 'hillshade',
          source: terrainSourceId,
          paint: {
            'hillshade-exaggeration': 0.5,
            'hillshade-shadow-color': '#637875',
            'hillshade-highlight-color': '#ffffff',
            'hillshade-accent-color': '#788e8b',
          },
        },
        map.getLayer('water') ? 'water' : map.getLayer('access-areas') ? 'access-areas' : undefined,
      );
    }
  } else {
    if (map.getLayer(terrainLayerId)) map.removeLayer(terrainLayerId);
    if (map.getSource(terrainSourceId)) map.removeSource(terrainSourceId);
  }
}
