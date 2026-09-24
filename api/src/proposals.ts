import type { ProposalInput } from '@opencoast/shared';
import type { PoolClient } from 'pg';

export const proposalSelect = `id, target_record_id, receipt_hash, status, kind,
  ST_AsGeoJSON(geometry)::json AS geometry, title, summary, description, jurisdiction,
  local_category, access_status, allowed_activities, conditions, land_route_status,
  sources, observed_at, created_at, updated_at, review_message`;

export interface ProposalRow {
  id: string;
  target_record_id: string | null;
  receipt_hash: string;
  status: string;
  kind: ProposalInput['kind'];
  geometry: ProposalInput['geometry'];
  title: string;
  summary: string;
  description: string;
  jurisdiction: string;
  local_category: string;
  access_status: ProposalInput['accessStatus'];
  allowed_activities: string[];
  conditions: string;
  land_route_status: ProposalInput['landRouteStatus'];
  sources: ProposalInput['sources'];
  observed_at: string | null;
  created_at: Date;
  updated_at: Date;
  review_message: string | null;
}

export function proposalData(row: ProposalRow) {
  return {
    id: row.id,
    targetRecordId: row.target_record_id,
    status: row.status,
    kind: row.kind,
    geometry: row.geometry,
    title: row.title,
    summary: row.summary,
    description: row.description,
    jurisdiction: row.jurisdiction,
    localCategory: row.local_category,
    accessStatus: row.access_status,
    allowedActivities: row.allowed_activities,
    conditions: row.conditions,
    landRouteStatus: row.land_route_status,
    sources: row.sources,
    observedAt: row.observed_at,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
    reviewMessage: row.review_message,
  };
}

export async function lockProposal(
  client: PoolClient,
  id: string,
): Promise<ProposalRow | undefined> {
  const result = await client.query<ProposalRow>(
    `SELECT ${proposalSelect} FROM proposals WHERE id=$1 FOR UPDATE`,
    [id],
  );
  return result.rows[0];
}
