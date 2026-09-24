import type { FastifyRequest } from 'fastify';
import { pool } from './db.js';
import { hashToken } from './security.js';
import { config } from './config.js';

export async function moderatorId(request: FastifyRequest): Promise<string | null> {
  const token = request.cookies.oc_session;
  if (!token) return null;
  const result = await pool.query<{ moderator_id: string }>(
    `SELECT s.moderator_id FROM moderator_sessions s JOIN moderators m ON m.id=s.moderator_id
     WHERE s.token_hash=$1 AND s.expires_at > now() AND m.active`,
    [hashToken(token)],
  );
  return result.rows[0]?.moderator_id ?? null;
}

export function validMutationOrigin(request: FastifyRequest): boolean {
  return request.headers.origin === config.webOrigin;
}
