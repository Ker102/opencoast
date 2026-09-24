import { useEffect, useRef, useState } from 'react';
import * as maplibregl from 'maplibre-gl';
import type { Map as MapLibreMap } from 'maplibre-gl';
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url';
import {
  TerraDraw,
  TerraDrawLineStringMode,
  TerraDrawPointMode,
  TerraDrawPolygonMode,
  TerraDrawSelectMode,
} from 'terra-draw';
import { TerraDrawMapLibreGLAdapter } from 'terra-draw-maplibre-gl-adapter';
import {
  geometrySchema,
  type Geometry,
  type ProposalInput,
  type RecordCollection,
} from '@opencoast/shared';

const styleUrl =
  import.meta.env.VITE_MAP_STYLE_URL ?? 'https://tiles.openfreemap.org/styles/liberty';
maplibregl.setWorkerUrl(workerUrl);
const empty: RecordCollection = { type: 'FeatureCollection', features: [] };
type DrawKind = ProposalInput['kind'] | null;

export interface MapViewProps {
  records: RecordCollection;
  drawingKind: DrawKind;
  focusGeometry?: Geometry | null;
  previewGeometry?: Geometry | null;
  onViewport: (bbox: string, signal: AbortSignal) => void;
  onSelectRecord: (id: string) => void;
  onGeometry: (geometry: Geometry) => void;
  onDrawReady: (draw: TerraDraw | null) => void;
}

function boundsFor(geometry: Geometry): maplibregl.LngLatBoundsLike {
  const points: number[][] = [];
  const visit = (coordinates: unknown): void => {
    if (Array.isArray(coordinates) && typeof coordinates[0] === 'number')
      points.push(coordinates as number[]);
    else if (Array.isArray(coordinates)) coordinates.forEach(visit);
  };
  visit(geometry.coordinates);
  const lngs = points.map((p) => p[0]),
    lats = points.map((p) => p[1]);
  const west = Math.min(...lngs),
    east = Math.max(...lngs),
    south = Math.min(...lats),
    north = Math.max(...lats);
  const pad = Math.max(0.003, (east - west + north - south) / 6);
  return [
    [west - pad, south - pad],
    [east + pad, north + pad],
  ];
}

export default function MapView({
  records,
  drawingKind,
  focusGeometry,
  previewGeometry,
  onViewport,
  onSelectRecord,
  onGeometry,
  onDrawReady,
}: MapViewProps) {
  const container = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const drawRef = useRef<TerraDraw | null>(null);
  const callbacks = useRef({ onViewport, onSelectRecord, onGeometry, onDrawReady });
  const drawingRef = useRef(drawingKind);
  const [mapError, setMapError] = useState(false);
  callbacks.current = { onViewport, onSelectRecord, onGeometry, onDrawReady };
  drawingRef.current = drawingKind;

  useEffect(() => {
    if (!container.current) return;
    const map = new maplibregl.Map({
      container: container.current,
      style: styleUrl,
      center: [0, 25],
      zoom: 2.2,
      minZoom: 1.2,
      attributionControl: false,
    });
    mapRef.current = map;
    map.addControl(new maplibregl.NavigationControl({ showCompass: true }), 'top-right');
    map.addControl(new maplibregl.AttributionControl({ compact: false }), 'bottom-right');
    map.addControl(new maplibregl.ScaleControl({ unit: 'metric' }), 'bottom-left');
    let timeout: ReturnType<typeof setTimeout> | undefined;
    let controller: AbortController | undefined;
    const refresh = () => {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
        controller?.abort();
        controller = new AbortController();
        const b = map.getBounds();
        const bbox = [
          Math.max(-180, b.getWest()),
          Math.max(-90, b.getSouth()),
          Math.min(180, b.getEast()),
          Math.min(90, b.getNorth()),
        ].join(',');
        callbacks.current.onViewport(bbox, controller.signal);
      }, 250);
    };
    map.on('moveend', refresh);
    map.on('error', () => setMapError(true));
    map.on('load', () => {
      map.addSource('access-records', { type: 'geojson', data: empty });
      const statusColor: maplibregl.ExpressionSpecification = [
        'match',
        ['get', 'accessStatus'],
        'allowed',
        '#147c6d',
        'conditional',
        '#d48f28',
        'restricted',
        '#ad514f',
        'disputed',
        '#8062a3',
        '#687d83',
      ];
      map.addLayer({
        id: 'access-areas',
        type: 'fill',
        source: 'access-records',
        filter: ['==', ['geometry-type'], 'Polygon'],
        paint: { 'fill-color': statusColor, 'fill-opacity': 0.28 },
      });
      map.addLayer({
        id: 'access-area-borders',
        type: 'line',
        source: 'access-records',
        filter: ['==', ['geometry-type'], 'Polygon'],
        paint: { 'line-color': statusColor, 'line-width': 3 },
      });
      map.addLayer({
        id: 'access-routes',
        type: 'line',
        source: 'access-records',
        filter: ['==', ['geometry-type'], 'LineString'],
        paint: { 'line-color': statusColor, 'line-width': 5, 'line-opacity': 0.9 },
      });
      map.addLayer({
        id: 'community-point-halos',
        type: 'circle',
        source: 'access-records',
        filter: [
          'all',
          ['==', ['geometry-type'], 'Point'],
          ['==', ['get', 'evidenceLevel'], 'community_reviewed'],
        ],
        paint: {
          'circle-color': '#ffffff',
          'circle-radius': 13,
          'circle-stroke-color': '#21383d',
          'circle-stroke-width': 2,
        },
      });
      map.addLayer({
        id: 'access-points',
        type: 'circle',
        source: 'access-records',
        filter: ['==', ['geometry-type'], 'Point'],
        paint: {
          'circle-color': statusColor,
          'circle-radius': 9,
          'circle-stroke-color': '#ffffff',
          'circle-stroke-width': 2.5,
        },
      });
      map.addLayer({
        id: 'community-area-borders',
        type: 'line',
        source: 'access-records',
        filter: [
          'all',
          ['==', ['geometry-type'], 'Polygon'],
          ['==', ['get', 'evidenceLevel'], 'community_reviewed'],
        ],
        paint: { 'line-color': '#21383d', 'line-width': 2, 'line-dasharray': [2, 2] },
      });
      map.addLayer({
        id: 'community-routes',
        type: 'line',
        source: 'access-records',
        filter: [
          'all',
          ['==', ['geometry-type'], 'LineString'],
          ['==', ['get', 'evidenceLevel'], 'community_reviewed'],
        ],
        paint: { 'line-color': '#21383d', 'line-width': 2, 'line-dasharray': [2, 2] },
      });
      map.addSource('proposal-preview', { type: 'geojson', data: empty });
      map.addLayer({
        id: 'proposal-preview-fill',
        type: 'fill',
        source: 'proposal-preview',
        filter: ['==', ['geometry-type'], 'Polygon'],
        paint: { 'fill-color': '#d88d39', 'fill-opacity': 0.28 },
      });
      map.addLayer({
        id: 'proposal-preview-line',
        type: 'line',
        source: 'proposal-preview',
        filter: ['in', ['geometry-type'], ['literal', ['Polygon', 'LineString']]],
        paint: { 'line-color': '#9a5b18', 'line-width': 4, 'line-dasharray': [2, 1] },
      });
      map.addLayer({
        id: 'proposal-preview-point',
        type: 'circle',
        source: 'proposal-preview',
        filter: ['==', ['geometry-type'], 'Point'],
        paint: {
          'circle-color': '#d88d39',
          'circle-radius': 12,
          'circle-stroke-color': '#6b421b',
          'circle-stroke-width': 3,
        },
      });
      map.on('click', (event) => {
        if (drawingRef.current) return;
        const features = map.queryRenderedFeatures(event.point, {
          layers: ['access-points', 'access-routes', 'access-area-borders', 'access-areas'],
        });
        const id = features[0]?.properties?.id;
        if (typeof id === 'string') callbacks.current.onSelectRecord(id);
      });
      const draw = new TerraDraw({
        adapter: new TerraDrawMapLibreGLAdapter({ map }),
        modes: [
          new TerraDrawPointMode({ editable: true }),
          new TerraDrawLineStringMode({ editable: true, showCoordinatePoints: true }),
          new TerraDrawPolygonMode({ editable: true, showCoordinatePoints: true }),
          new TerraDrawSelectMode({
            flags: {
              point: { feature: { draggable: true } },
              linestring: {
                feature: {
                  draggable: true,
                  coordinates: { midpoints: true, draggable: true, deletable: true },
                },
              },
              polygon: {
                feature: {
                  draggable: true,
                  coordinates: { midpoints: true, draggable: true, deletable: true },
                },
              },
            },
          }),
        ],
      });
      draw.start();
      draw.setMode(
        drawingRef.current === 'area'
          ? 'polygon'
          : drawingRef.current === 'route'
            ? 'linestring'
            : drawingRef.current === 'point'
              ? 'point'
              : 'select',
      );
      draw.on('finish', (id) => {
        const feature = draw.getSnapshotFeature(id);
        const parsed = geometrySchema.safeParse(feature?.geometry);
        if (parsed.success) {
          const other = draw
            .getSnapshot()
            .filter((item) => item.id !== id && item.id !== undefined)
            .map((item) => item.id as string | number);
          if (other.length) draw.removeFeatures(other);
          callbacks.current.onGeometry(parsed.data);
          draw.setMode('select');
          draw.selectFeature(id);
        }
      });
      draw.on('change', () => {
        const feature = draw
          .getSnapshot()
          .find((item) => geometrySchema.safeParse(item.geometry).success);
        const parsed = geometrySchema.safeParse(feature?.geometry);
        if (parsed.success) callbacks.current.onGeometry(parsed.data);
      });
      drawRef.current = draw;
      callbacks.current.onDrawReady(draw);
      refresh();
    });
    return () => {
      if (timeout) clearTimeout(timeout);
      controller?.abort();
      callbacks.current.onDrawReady(null);
      drawRef.current?.stop();
      drawRef.current = null;
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (map?.isStyleLoaded() && map.getSource('access-records'))
      (map.getSource('access-records') as maplibregl.GeoJSONSource).setData(records as never);
  }, [records]);

  useEffect(() => {
    const draw = drawRef.current;
    if (!draw) return;
    if (drawingKind) {
      draw.setMode(
        draw.getSnapshot().length
          ? 'select'
          : drawingKind === 'area'
            ? 'polygon'
            : drawingKind === 'route'
              ? 'linestring'
              : 'point',
      );
    } else draw.setMode('select');
  }, [drawingKind]);

  useEffect(() => {
    if (focusGeometry && mapRef.current)
      mapRef.current.fitBounds(boundsFor(focusGeometry), {
        padding: 70,
        maxZoom: 16,
        duration: 650,
      });
  }, [focusGeometry]);

  useEffect(() => {
    const map = mapRef.current;
    if (map?.isStyleLoaded() && map.getSource('proposal-preview'))
      (map.getSource('proposal-preview') as maplibregl.GeoJSONSource).setData(
        previewGeometry
          ? {
              type: 'FeatureCollection',
              features: [{ type: 'Feature', geometry: previewGeometry, properties: {} }],
            }
          : empty,
      );
  }, [previewGeometry]);

  return (
    <div className="map-wrap">
      <div
        ref={container}
        className="map-canvas"
        role="application"
        aria-label="Interactive coastal access map"
      />
      {mapError && (
        <div className="map-error" role="status">
          Map tiles could not load. Your submissions and records remain available in the side panel.
        </div>
      )}
    </div>
  );
}
