import type { Geometry, PublicRecord, RecordCollection, RecordFeature } from '@opencoast/shared';
import type { PoolClient } from 'pg';
import { pool } from './db.js';

export interface RecordRow {
  id: string;
  revision: number;
  kind: PublicRecord['kind'];
  geometry: Geometry;
  title: string;
  summary: string;
  description: string;
  jurisdiction: string;
  local_category: string;
  access_status: PublicRecord['accessStatus'];
  allowed_activities: string[];
  conditions: string;
  land_route_status: PublicRecord['landRouteStatus'];
  linked_route_ids: string[];
  sources: PublicRecord['sources'];
  observed_at: string | null;
  evidence_level: PublicRecord['evidenceLevel'];
  geometry_precision: PublicRecord['geometryPrecision'];
  moderator_explanation: string;
  last_edited_at: Date;
  last_reviewed_at: Date | null;
}

export const recordSelect = `id, revision, kind, ST_AsGeoJSON(geometry)::json AS geometry, title, summary, description,
  jurisdiction, local_category, access_status, allowed_activities, conditions,
  CASE WHEN access_records.kind='area' THEN
    CASE WHEN EXISTS (
      SELECT 1 FROM access_route_links l JOIN access_records route ON route.id=l.route_id
      WHERE l.area_id=access_records.id AND route.visible AND route.kind='route'
      AND route.evidence_level='document_backed' AND route.access_status IN ('allowed','conditional')
    ) THEN 'verified' ELSE 'not_verified' END
    ELSE access_records.land_route_status END AS land_route_status,
  COALESCE((
    SELECT jsonb_agg(l.route_id ORDER BY l.route_id) FROM access_route_links l
    JOIN access_records route ON route.id=l.route_id
    WHERE l.area_id=access_records.id AND route.visible AND route.kind='route'
  ), '[]'::jsonb) AS linked_route_ids,
  sources, observed_at, evidence_level, geometry_precision, moderator_explanation, last_edited_at, last_reviewed_at`;

export function featureFromRow(row: RecordRow): RecordFeature {
  return {
    type: 'Feature',
    geometry: row.geometry,
    properties: {
      id: row.id,
      revision: row.revision,
      kind: row.kind,
      title: row.title,
      summary: row.summary,
      description: row.description,
      jurisdiction: row.jurisdiction,
      localCategory: row.local_category,
      accessStatus: row.access_status,
      allowedActivities: row.allowed_activities,
      conditions: row.conditions,
      landRouteStatus: row.land_route_status,
      linkedRouteIds: row.linked_route_ids,
      sources: row.sources,
      ...(row.observed_at ? { observedAt: row.observed_at } : {}),
      evidenceLevel: row.evidence_level,
      geometryPrecision: row.geometry_precision,
      moderatorExplanation: row.moderator_explanation,
      lastEditedAt: row.last_edited_at.toISOString(),
      lastReviewedAt: row.last_reviewed_at?.toISOString() ?? null,
    },
  };
}

export async function recordsInViewport(
  bbox: [number, number, number, number],
): Promise<RecordCollection> {
  const [west, south, east, north] = bbox;
  const envelope = `ST_MakeEnvelope($1,$2,$3,$4,4326)`;
  // A split at the antimeridian uses two ordinary indexed envelopes.
  const where =
    west <= east
      ? `geometry && ${envelope} AND ST_Intersects(geometry, ${envelope})`
      : `(ST_Intersects(geometry, ST_MakeEnvelope($1,$2,180,$4,4326)) OR ST_Intersects(geometry, ST_MakeEnvelope(-180,$2,$3,$4,4326)))`;
  const result = await pool.query<RecordRow>(
    `SELECT ${recordSelect} FROM access_records WHERE visible AND ${where} ORDER BY last_edited_at DESC LIMIT 500`,
    [west, south, east, north],
  );
  return { type: 'FeatureCollection', features: result.rows.map(featureFromRow) };
}

export async function publicRecord(client: PoolClient, id: string): Promise<RecordRow | undefined> {
  const result = await client.query<RecordRow>(
    `SELECT ${recordSelect} FROM access_records WHERE id=$1 AND visible`,
    [id],
  );
  return result.rows[0];
}
