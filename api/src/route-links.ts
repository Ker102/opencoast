import type { RouteLinkInput } from '@opencoast/shared';
import { pool } from './db.js';
import { featureFromRow, recordSelect, type RecordRow } from './records.js';
import { ReviewError } from './review.js';

export async function routeCandidates(areaId: string) {
  const area = await pool.query<{ id: string }>(
    "SELECT id FROM access_records WHERE id=$1 AND kind='area' AND visible",
    [areaId],
  );
  if (!area.rowCount) throw new ReviewError('Area not found', 404);
  const result = await pool.query<{
    id: string;
    title: string;
    access_status: string;
    evidence_level: string;
    distance_meters: number;
    selected: boolean;
    geometry: RecordRow['geometry'];
  }>(
    `SELECT route.id,route.title,route.access_status,route.evidence_level,
     round(ST_Distance(route.geometry::geography,area.geometry::geography))::integer AS distance_meters,
     (link.route_id IS NOT NULL) AS selected,ST_AsGeoJSON(route.geometry)::json AS geometry
     FROM access_records area CROSS JOIN access_records route
     LEFT JOIN access_route_links link ON link.area_id=area.id AND link.route_id=route.id
     WHERE area.id=$1 AND area.kind='area' AND area.visible
     AND route.kind='route' AND route.visible
     AND ((route.geometry && ST_Expand(area.geometry,0.05)
       AND ST_DWithin(route.geometry::geography,area.geometry::geography,2000))
       OR link.route_id IS NOT NULL)
     ORDER BY selected DESC,distance_meters,route.id LIMIT 30`,
    [areaId],
  );
  return {
    routes: result.rows.map((row) => ({
      id: row.id,
      title: row.title,
      accessStatus: row.access_status,
      evidenceLevel: row.evidence_level,
      distanceMeters: row.distance_meters,
      selected: row.selected,
      geometry: row.geometry,
    })),
  };
}

export async function replaceRouteLinks(
  areaId: string,
  moderatorId: string,
  input: RouteLinkInput,
) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const area = await client.query<{ id: string }>(
      "SELECT id FROM access_records WHERE id=$1 AND kind='area' AND visible FOR UPDATE",
      [areaId],
    );
    if (!area.rowCount) throw new ReviewError('Area not found', 404);
    const ids = [...input.routeIds].sort();
    const selected = await client.query<{ id: string }>(
      "SELECT id FROM access_records WHERE id=ANY($1::uuid[]) AND kind='route' AND visible ORDER BY id FOR UPDATE",
      [ids],
    );
    if (selected.rows.length !== ids.length)
      throw new ReviewError('Only published route records can be linked');
    const prior = await client.query<{ route_id: string }>(
      'SELECT route_id FROM access_route_links WHERE area_id=$1 ORDER BY route_id',
      [areaId],
    );
    const before = prior.rows.map((row) => row.route_id);
    if (before.length === ids.length && before.every((id, index) => id === ids[index]))
      throw new ReviewError('Route links are unchanged', 409);
    await client.query(
      'DELETE FROM access_route_links WHERE area_id=$1 AND NOT (route_id=ANY($2::uuid[]))',
      [areaId, ids],
    );
    for (const routeId of ids)
      await client.query(
        `INSERT INTO access_route_links (area_id,route_id,created_by) VALUES ($1,$2,$3)
         ON CONFLICT (area_id,route_id) DO NOTHING`,
        [areaId, routeId, moderatorId],
      );
    const time = await client.query<{ now: Date }>('SELECT now()');
    const now = time.rows[0].now;
    await client.query(
      `INSERT INTO route_link_events (area_id,moderator_id,before_route_ids,after_route_ids,reason,created_at)
       VALUES ($1,$2,$3::uuid[],$4::uuid[],$5,$6)`,
      [areaId, moderatorId, before, ids, input.reason, now],
    );
    await client.query(
      'UPDATE access_records SET revision=revision+1,last_edited_at=$2 WHERE id=$1',
      [areaId, now],
    );
    const record = await client.query<RecordRow>(
      `SELECT ${recordSelect} FROM access_records WHERE id=$1`,
      [areaId],
    );
    const feature = featureFromRow(record.rows[0]);
    await client.query(
      `INSERT INTO access_revisions (record_id,revision,snapshot,edited_at)
       VALUES ($1,$2,$3::jsonb,$4)`,
      [areaId, record.rows[0].revision, JSON.stringify(feature), now],
    );
    await client.query('COMMIT');
    return { ok: true, feature };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}
