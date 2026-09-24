import type { ReviewInput, ProposalInput } from '@opencoast/shared';
import sharp from 'sharp';
import { pool } from './db.js';
import { getObject, putObject } from './storage.js';
import { lockProposal, proposalData } from './proposals.js';
import { featureFromRow, publicRecord, recordSelect, type RecordRow } from './records.js';

export class ReviewError extends Error {
  constructor(
    message: string,
    public statusCode = 400,
  ) {
    super(message);
  }
}

export async function reviewProposal(id: string, moderatorId: string, input: ReviewInput) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const proposal = await lockProposal(client, id);
    if (!proposal) throw new ReviewError('Proposal not found', 404);
    if (!['pending', 'clarification'].includes(proposal.status))
      throw new ReviewError('This proposal was already reviewed', 409);
    if (input.action === 'approve') {
      if (
        input.evidenceLevel === 'document_backed' &&
        (!input.reviewedSources || !proposal.sources.some((source) => source.kind === 'official'))
      )
        throw new ReviewError('Document-backed publication needs a reviewed official source');
      const selected = input.publishEvidenceIds.length
        ? await client.query<{
            id: string;
            content_type: string;
            private_key: string;
            publish_consent: boolean;
          }>(
            'SELECT id,content_type,private_key,publish_consent FROM proposal_evidence WHERE proposal_id=$1 AND id = ANY($2::uuid[])',
            [id, input.publishEvidenceIds],
          )
        : { rows: [] };
      if (selected.rows.length !== input.publishEvidenceIds.length)
        throw new ReviewError('Selected evidence does not belong to this proposal');
      for (const evidence of selected.rows) {
        if (!evidence.publish_consent)
          throw new ReviewError('Contributor did not consent to publish selected evidence');
        if (!evidence.content_type.startsWith('image/'))
          throw new ReviewError('Only inspected images can be published');
        const original = await getObject(evidence.private_key);
        const derivative = await sharp(original.bytes)
          .rotate()
          .resize({ width: 2000, height: 2000, fit: 'inside', withoutEnlargement: true })
          .jpeg({ quality: 82 })
          .toBuffer();
        const key = `public/${id}/${evidence.id}.jpg`;
        await putObject(key, derivative, 'image/jpeg');
        await client.query('UPDATE proposal_evidence SET public_key=$1 WHERE id=$2', [
          key,
          evidence.id,
        ]);
      }
      const dateResult = await client.query<{ now: Date }>('SELECT now()');
      const now = dateResult.rows[0].now;
      const lastReviewed = input.reviewedSources && proposal.sources.length ? now : null;
      const fields = [
        proposal.kind,
        JSON.stringify(proposal.geometry),
        proposal.title,
        proposal.summary,
        proposal.description,
        proposal.jurisdiction,
        proposal.local_category,
        proposal.access_status,
        JSON.stringify(proposal.allowed_activities),
        proposal.conditions,
        proposal.land_route_status,
        JSON.stringify(proposal.sources),
        proposal.observed_at,
        input.evidenceLevel,
        input.explanation,
        now,
        lastReviewed,
      ];
      let recordId: string;
      if (proposal.target_record_id) {
        const prior = await publicRecord(client, proposal.target_record_id);
        if (!prior) throw new ReviewError('Target record not found', 404);
        const updated = await client.query<{ id: string }>(
          `UPDATE access_records SET
          revision=revision+1, kind=$1, geometry=ST_GeomFromGeoJSON($2), title=$3, summary=$4,
          description=$5, jurisdiction=$6, local_category=$7, access_status=$8,
          allowed_activities=$9::jsonb, conditions=$10, land_route_status=$11, sources=$12::jsonb,
          observed_at=$13, evidence_level=$14, moderator_explanation=$15, last_edited_at=$16,
          last_reviewed_at=COALESCE($17,last_reviewed_at), geometry_precision='approximate'
          WHERE id=$18 RETURNING id`,
          [...fields, proposal.target_record_id],
        );
        recordId = updated.rows[0].id;
      } else {
        const inserted = await client.query<{ id: string }>(
          `INSERT INTO access_records
          (kind,geometry,title,summary,description,jurisdiction,local_category,access_status,
           allowed_activities,conditions,land_route_status,sources,observed_at,evidence_level,
           moderator_explanation,last_edited_at,last_reviewed_at)
          VALUES ($1,ST_GeomFromGeoJSON($2),$3,$4,$5,$6,$7,$8,$9::jsonb,$10,$11,$12::jsonb,$13,$14,$15,$16,$17)
          RETURNING id`,
          fields,
        );
        recordId = inserted.rows[0].id;
      }
      const record = await client.query<RecordRow>(
        `SELECT ${recordSelect} FROM access_records WHERE id=$1`,
        [recordId],
      );
      await client.query(
        'INSERT INTO access_revisions (record_id,revision,snapshot,edited_at,proposal_id) VALUES ($1,$2,$3::jsonb,$4,$5)',
        [
          recordId,
          record.rows[0].revision,
          JSON.stringify(featureFromRow(record.rows[0])),
          now,
          id,
        ],
      );
      await client.query(
        `UPDATE proposals SET status='approved', updated_at=$2, review_message=$3 WHERE id=$1`,
        [id, now, input.explanation],
      );
      await client.query(
        `INSERT INTO review_events (proposal_id,moderator_id,action,explanation,evidence_level,reviewed_sources)
        VALUES ($1,$2,'approve',$3,$4,$5)`,
        [id, moderatorId, input.explanation, input.evidenceLevel, input.reviewedSources],
      );
      await client.query('COMMIT');
      return { status: 'approved', recordId };
    }
    await client.query(
      'UPDATE proposals SET status=$2, updated_at=now(), review_message=$3 WHERE id=$1',
      [id, input.action === 'reject' ? 'rejected' : 'clarification', input.explanation],
    );
    await client.query(
      'INSERT INTO review_events (proposal_id,moderator_id,action,explanation,reviewed_sources) VALUES ($1,$2,$3,$4,$5)',
      [id, moderatorId, input.action, input.explanation, input.reviewedSources],
    );
    await client.query(
      'INSERT INTO proposal_messages (proposal_id,sender,message) VALUES ($1,$2,$3)',
      [id, 'moderator', input.explanation],
    );
    await client.query('COMMIT');
    return { status: input.action === 'reject' ? 'rejected' : 'clarification' };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

export async function editProposal(
  id: string,
  moderatorId: string,
  input: ProposalInput,
  reason: string,
) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const prior = await lockProposal(client, id);
    if (!prior) throw new ReviewError('Proposal not found', 404);
    if (!['pending', 'clarification'].includes(prior.status))
      throw new ReviewError('Reviewed proposals cannot be edited', 409);
    await client.query(
      `UPDATE proposals SET target_record_id=$2,kind=$3,geometry=ST_GeomFromGeoJSON($4),title=$5,summary=$6,
      description=$7,jurisdiction=$8,local_category=$9,access_status=$10,allowed_activities=$11::jsonb,
      conditions=$12,land_route_status=$13,sources=$14::jsonb,observed_at=$15,updated_at=now() WHERE id=$1`,
      [
        id,
        input.targetRecordId ?? null,
        input.kind,
        JSON.stringify(input.geometry),
        input.title,
        input.summary,
        input.description,
        input.jurisdiction,
        input.localCategory,
        input.accessStatus,
        JSON.stringify(input.allowedActivities),
        input.conditions,
        input.landRouteStatus,
        JSON.stringify(input.sources),
        input.observedAt ?? null,
      ],
    );
    await client.query(
      'INSERT INTO proposal_edits (proposal_id,moderator_id,before,after,reason) VALUES ($1,$2,$3::jsonb,$4::jsonb,$5)',
      [id, moderatorId, JSON.stringify(proposalData(prior)), JSON.stringify(input), reason],
    );
    await client.query('COMMIT');
    return { ok: true };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}
