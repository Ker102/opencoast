import { fileTypeFromBuffer } from 'file-type';
import { pool } from './db.js';
import { ReviewError } from './review.js';
import { newToken } from './security.js';
import {
  deleteRemoteObject,
  getObject,
  getRemoteObjectSize,
  putObject,
  signedPutUrl,
} from './storage.js';

const maxBytes = 10_485_760;

export interface EvidenceUploadInput {
  name: string;
  contentType: 'image/jpeg' | 'image/png' | 'image/webp' | 'application/pdf';
  byteSize: number;
  publishConsent: boolean;
}

export async function createEvidenceUploadIntent(proposalId: string, input: EvidenceUploadInput) {
  const client = await pool.connect();
  let intent: { id: string; staging_key: string } | undefined;
  try {
    await client.query('BEGIN');
    const proposal = await client.query<{ status: string }>(
      'SELECT status FROM proposals WHERE id=$1 FOR UPDATE',
      [proposalId],
    );
    if (!proposal.rows[0] || !['pending', 'clarification'].includes(proposal.rows[0].status))
      throw new ReviewError('This proposal is closed', 409);
    const count = await client.query<{ count: string }>(
      `SELECT
        (SELECT count(*) FROM proposal_evidence WHERE proposal_id=$1) +
        (SELECT count(*) FROM evidence_upload_intents
          WHERE proposal_id=$1 AND consumed_at IS NULL AND expires_at > now()) AS count`,
      [proposalId],
    );
    if (Number(count.rows[0].count) >= 10)
      throw new ReviewError('A proposal can have at most 10 files or active uploads');
    const stagingKey = `staging/${proposalId}/${newToken()}`;
    const saved = await client.query<{ id: string; staging_key: string }>(
      `INSERT INTO evidence_upload_intents
        (proposal_id,original_name,content_type,declared_byte_size,publish_consent,staging_key,expires_at)
       VALUES ($1,$2,$3,$4,$5,$6,now() + interval '15 minutes')
       RETURNING id,staging_key`,
      [proposalId, input.name, input.contentType, input.byteSize, input.publishConsent, stagingKey],
    );
    intent = saved.rows[0];
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
  if (!intent) throw new Error('Upload intent was not created');
  return {
    uploadId: intent.id,
    uploadUrl: await signedPutUrl(intent.staging_key, input.contentType),
  };
}

export async function completeEvidenceUpload(proposalId: string, uploadId: string) {
  const client = await pool.connect();
  let finalKey: string | undefined;
  let committed = false;
  let stagingKey: string | undefined;
  try {
    await client.query('BEGIN');
    const result = await client.query<{
      id: string;
      original_name: string;
      content_type: string;
      declared_byte_size: number;
      publish_consent: boolean;
      staging_key: string;
      expires_at: Date;
      consumed_at: Date | null;
      final_evidence_id: string | null;
      proposal_status: string;
    }>(
      `SELECT i.*,p.status AS proposal_status
         FROM evidence_upload_intents i JOIN proposals p ON p.id=i.proposal_id
        WHERE i.id=$1 AND i.proposal_id=$2 FOR UPDATE OF i,p`,
      [uploadId, proposalId],
    );
    const intent = result.rows[0];
    if (!intent) throw new ReviewError('Upload request not found', 404);
    if (intent.final_evidence_id) {
      await client.query('COMMIT');
      committed = true;
      return { id: intent.final_evidence_id, name: intent.original_name };
    }
    if (!['pending', 'clarification'].includes(intent.proposal_status))
      throw new ReviewError('This proposal is closed', 409);
    if (intent.expires_at.getTime() <= Date.now())
      throw new ReviewError('Upload request expired; start a new upload', 409);
    stagingKey = intent.staging_key;
    let size: number;
    try {
      size = await getRemoteObjectSize(stagingKey);
    } catch (error) {
      if ((error as { $metadata?: { httpStatusCode?: number } }).$metadata?.httpStatusCode === 404)
        throw new ReviewError('The file has not reached storage yet', 409);
      throw error;
    }
    if (size < 1 || size > maxBytes || size !== intent.declared_byte_size)
      throw new ReviewError('Uploaded file size does not match the request', 400);
    const object = await getObject(stagingKey);
    const detected = await fileTypeFromBuffer(object.bytes);
    if (
      object.bytes.length !== size ||
      detected?.mime !== intent.content_type ||
      object.contentType !== intent.content_type
    )
      throw new ReviewError('Uploaded file type or size does not match the request', 400);
    finalKey = `private/${proposalId}/${newToken()}`;
    await putObject(finalKey, object.bytes, intent.content_type);
    const saved = await client.query<{ id: string }>(
      `INSERT INTO proposal_evidence
        (proposal_id,original_name,content_type,byte_size,publish_consent,private_key)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING id`,
      [
        proposalId,
        intent.original_name,
        intent.content_type,
        size,
        intent.publish_consent,
        finalKey,
      ],
    );
    await client.query(
      `UPDATE evidence_upload_intents
          SET consumed_at=now(),final_evidence_id=$2 WHERE id=$1`,
      [uploadId, saved.rows[0].id],
    );
    await client.query('COMMIT');
    committed = true;
    return { id: saved.rows[0].id, name: intent.original_name };
  } catch (error) {
    if (!committed) {
      await client.query('ROLLBACK');
      if (finalKey) await deleteRemoteObject(finalKey).catch(() => {});
    }
    throw error;
  } finally {
    client.release();
    if (committed && stagingKey) await deleteRemoteObject(stagingKey).catch(() => {});
  }
}
