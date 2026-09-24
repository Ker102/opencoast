import Fastify, { type FastifyRequest } from 'fastify';
import cookie from '@fastify/cookie';
import cors from '@fastify/cors';
import multipart from '@fastify/multipart';
import rateLimit from '@fastify/rate-limit';
import { fileTypeFromBuffer } from 'file-type';
import { z } from 'zod';
import { proposalInputSchema, reviewInputSchema, routeLinkInputSchema } from '@opencoast/shared';
import { config } from './config.js';
import { pool } from './db.js';
import { hashToken, newToken, verifyPassword } from './security.js';
import { moderatorId, validMutationOrigin } from './auth.js';
import { recordsInViewport, recordSelect, featureFromRow, type RecordRow } from './records.js';
import { proposalData, proposalSelect, type ProposalRow } from './proposals.js';
import { ReviewError, editProposal, reviewProposal } from './review.js';
import { getObject, putObject, storageReady } from './storage.js';
import { replaceRouteLinks, routeCandidates } from './route-links.js';

const uuid = z.uuid();
const idParams = z.object({ id: uuid });
const evidenceParams = z.object({ id: uuid, evidenceId: uuid });

function receiptHash(request: FastifyRequest): string | null {
  const token = request.headers['x-receipt-token'];
  return typeof token === 'string' && token.length >= 40 && token.length <= 100
    ? hashToken(token)
    : null;
}

async function receiptProposal(request: FastifyRequest, id: string) {
  const tokenHash = receiptHash(request);
  if (!tokenHash) return null;
  const result = await pool.query<ProposalRow>(
    `SELECT ${proposalSelect} FROM proposals WHERE id=$1 AND receipt_hash=$2`,
    [id, tokenHash],
  );
  return result.rows[0] ?? null;
}

async function requireModerator(request: FastifyRequest): Promise<string> {
  const id = await moderatorId(request);
  if (!id) throw new ReviewError('Moderator sign-in required', 401);
  return id;
}

export async function createApp() {
  const app = Fastify({ logger: process.env.NODE_ENV !== 'test', bodyLimit: 1_000_000 });
  await app.register(cookie);
  await app.register(cors, { origin: config.webOrigin, credentials: true });
  await app.register(rateLimit, { global: false });
  await app.register(multipart, { limits: { fileSize: 10_485_760, files: 1, fields: 0 } });

  app.addHook('onSend', async (request, reply, payload) => {
    if (request.url.startsWith('/proposals') || request.url.startsWith('/moderation/'))
      reply.header('Cache-Control', 'private,no-store');
    reply.header('Referrer-Policy', 'no-referrer').header('X-Content-Type-Options', 'nosniff');
    return payload;
  });

  app.setErrorHandler((error, _request, reply) => {
    if (error instanceof z.ZodError)
      return reply.code(400).send({ error: 'Invalid input', details: error.issues });
    if (error instanceof ReviewError)
      return reply.code(error.statusCode).send({ error: error.message });
    const databaseError = error as { code?: string };
    if (databaseError.code === '23514' || databaseError.code === '22P02')
      return reply.code(400).send({ error: 'The geometry or submitted values are invalid' });
    if (databaseError.code === '23503')
      return reply.code(400).send({ error: 'A referenced record does not exist' });
    const httpError = error as { statusCode?: number; message?: string };
    if (httpError.statusCode && httpError.statusCode < 500)
      return reply.code(httpError.statusCode).send({ error: httpError.message });
    app.log.error(error);
    return reply.code(500).send({ error: 'Internal server error' });
  });

  app.get('/health', async () => ({ ok: true }));

  app.get('/records', async (request) => {
    const query = z.object({ bbox: z.string() }).parse(request.query);
    const numbers = query.bbox.split(',').map(Number);
    if (numbers.length !== 4 || numbers.some((n) => !Number.isFinite(n)))
      throw new ReviewError('bbox must be west,south,east,north');
    const [west, south, east, north] = numbers;
    if (
      west < -180 ||
      west > 180 ||
      east < -180 ||
      east > 180 ||
      south < -90 ||
      north > 90 ||
      south >= north
    )
      throw new ReviewError('Invalid viewport bounds');
    return recordsInViewport([west, south, east, north]);
  });

  app.get('/records/:id', async (request, reply) => {
    const { id } = idParams.parse(request.params);
    const result = await pool.query<RecordRow>(
      `SELECT ${recordSelect} FROM access_records WHERE id=$1 AND visible`,
      [id],
    );
    if (!result.rows[0]) return reply.code(404).send({ error: 'Record not found' });
    return featureFromRow(result.rows[0]);
  });

  app.get('/records/:id/routes', async (request, reply) => {
    const { id } = idParams.parse(request.params);
    const area = await pool.query(
      'SELECT 1 FROM access_records WHERE id=$1 AND kind=$2 AND visible',
      [id, 'area'],
    );
    if (!area.rowCount) return reply.code(404).send({ error: 'Area not found' });
    const routes = await pool.query<RecordRow>(
      `SELECT ${recordSelect} FROM access_records
       JOIN access_route_links l ON l.route_id=access_records.id
       WHERE l.area_id=$1 AND access_records.visible AND access_records.kind='route'
       ORDER BY access_records.title,access_records.id`,
      [id],
    );
    return { routes: routes.rows.map(featureFromRow) };
  });

  app.get('/records/:id/history', async (request) => {
    const { id } = idParams.parse(request.params);
    const result = await pool.query<{ snapshot: unknown; edited_at: Date; revision: number }>(
      `SELECT r.snapshot,r.edited_at,r.revision FROM access_revisions r JOIN access_records a ON a.id=r.record_id
       WHERE a.id=$1 AND a.visible ORDER BY r.revision DESC`,
      [id],
    );
    return {
      revisions: result.rows.map((row) => ({
        revision: row.revision,
        editedAt: row.edited_at.toISOString(),
        feature: row.snapshot,
      })),
    };
  });

  app.get('/records/:id/evidence', async (request) => {
    const { id } = idParams.parse(request.params);
    const result = await pool.query<{ id: string; original_name: string }>(
      `SELECT DISTINCT e.id,e.original_name FROM proposal_evidence e
       JOIN access_revisions r ON r.proposal_id=e.proposal_id
       JOIN access_records a ON a.id=r.record_id
       WHERE a.id=$1 AND a.visible AND e.public_key IS NOT NULL`,
      [id],
    );
    return {
      evidence: result.rows.map((row, index) => ({
        id: row.id,
        name: `Reviewed image ${index + 1}`,
        url: `/records/${id}/evidence/${row.id}`,
      })),
    };
  });

  app.get('/records/:id/evidence/:evidenceId', async (request, reply) => {
    const { id, evidenceId } = evidenceParams.parse(request.params);
    const result = await pool.query<{ public_key: string }>(
      `SELECT e.public_key FROM proposal_evidence e JOIN access_revisions r ON r.proposal_id=e.proposal_id
       JOIN access_records a ON a.id=r.record_id WHERE a.id=$1 AND a.visible AND e.id=$2 AND e.public_key IS NOT NULL LIMIT 1`,
      [id, evidenceId],
    );
    if (!result.rows[0]) return reply.code(404).send({ error: 'Evidence not found' });
    const object = await getObject(result.rows[0].public_key);
    return reply
      .header('Content-Type', 'image/jpeg')
      .header('Cache-Control', 'public,max-age=3600')
      .send(object.bytes);
  });

  app.post(
    '/proposals',
    { config: { rateLimit: { max: 5, timeWindow: '1 hour' } } },
    async (request, reply) => {
      const input = proposalInputSchema.parse(request.body);
      if (input.targetRecordId) {
        const target = await pool.query('SELECT 1 FROM access_records WHERE id=$1 AND visible', [
          input.targetRecordId,
        ]);
        if (!target.rowCount) throw new ReviewError('Target record not found', 404);
      }
      const token = newToken();
      const result = await pool.query<{ id: string }>(
        `INSERT INTO proposals
      (target_record_id,receipt_hash,kind,geometry,title,summary,description,jurisdiction,local_category,
       access_status,allowed_activities,conditions,land_route_status,sources,observed_at)
      VALUES ($1,$2,$3,ST_GeomFromGeoJSON($4),$5,$6,$7,$8,$9,$10,$11::jsonb,$12,$13,$14::jsonb,$15)
      RETURNING id`,
        [
          input.targetRecordId ?? null,
          hashToken(token),
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
      return reply.code(201).send({ id: result.rows[0].id, receiptToken: token });
    },
  );

  app.get('/proposals/:id/receipt', async (request, reply) => {
    const { id } = idParams.parse(request.params);
    const proposal = await receiptProposal(request, id);
    if (!proposal) return reply.code(404).send({ error: 'Receipt not found' });
    const messages = await pool.query<{ sender: string; message: string; created_at: Date }>(
      'SELECT sender,message,created_at FROM proposal_messages WHERE proposal_id=$1 ORDER BY created_at',
      [id],
    );
    return {
      ...proposalData(proposal),
      messages: messages.rows.map((m) => ({
        sender: m.sender,
        message: m.message,
        createdAt: m.created_at.toISOString(),
      })),
    };
  });

  app.post(
    '/proposals/:id/reply',
    { config: { rateLimit: { max: 10, timeWindow: '1 hour' } } },
    async (request, reply) => {
      const { id } = idParams.parse(request.params);
      const proposal = await receiptProposal(request, id);
      if (!proposal) return reply.code(404).send({ error: 'Receipt not found' });
      if (proposal.status !== 'clarification')
        throw new ReviewError('This proposal is not awaiting clarification', 409);
      const { message } = z
        .object({ message: z.string().trim().min(5).max(3000) })
        .parse(request.body);
      await pool.query(
        'INSERT INTO proposal_messages (proposal_id,sender,message) VALUES ($1,$2,$3)',
        [id, 'contributor', message],
      );
      await pool.query(`UPDATE proposals SET status='pending',updated_at=now() WHERE id=$1`, [id]);
      return reply.code(201).send({ ok: true });
    },
  );

  app.post(
    '/proposals/:id/evidence',
    { config: { rateLimit: { max: 10, timeWindow: '1 hour' } } },
    async (request, reply) => {
      const { id } = idParams.parse(request.params);
      const proposal = await receiptProposal(request, id);
      if (!proposal) return reply.code(404).send({ error: 'Receipt not found' });
      if (!['pending', 'clarification'].includes(proposal.status))
        throw new ReviewError('This proposal is closed', 409);
      if (!storageReady()) throw new ReviewError('Evidence storage is not configured', 503);
      const query = z
        .object({ publishConsent: z.enum(['true', 'false']).default('false') })
        .parse(request.query);
      const part = await request.file();
      if (!part) throw new ReviewError('Choose a file to upload');
      const bytes = await part.toBuffer();
      if (bytes.length === 0 || bytes.length > 10_485_760)
        throw new ReviewError('File must be 1 byte to 10 MB');
      const detected = await fileTypeFromBuffer(bytes);
      if (
        !detected ||
        !['image/jpeg', 'image/png', 'image/webp', 'application/pdf'].includes(detected.mime)
      )
        throw new ReviewError('Only JPEG, PNG, WebP, and PDF evidence is accepted');
      const count = await pool.query<{ count: string }>(
        'SELECT count(*) FROM proposal_evidence WHERE proposal_id=$1',
        [id],
      );
      if (Number(count.rows[0].count) >= 10)
        throw new ReviewError('A proposal can have at most 10 files');
      const key = `private/${id}/${newToken()}`;
      await putObject(key, bytes, detected.mime);
      const saved = await pool.query<{ id: string }>(
        `INSERT INTO proposal_evidence
      (proposal_id,original_name,content_type,byte_size,publish_consent,private_key)
      VALUES ($1,$2,$3,$4,$5,$6) RETURNING id`,
        [
          id,
          part.filename.slice(0, 200),
          detected.mime,
          bytes.length,
          query.publishConsent === 'true',
          key,
        ],
      );
      return reply
        .code(201)
        .send({ id: saved.rows[0].id, name: part.filename, contentType: detected.mime });
    },
  );

  app.post(
    '/moderation/login',
    { config: { rateLimit: { max: 5, timeWindow: '15 minutes' } } },
    async (request, reply) => {
      if (!validMutationOrigin(request)) throw new ReviewError('Invalid request origin', 403);
      const { email, password } = z
        .object({ email: z.email(), password: z.string() })
        .parse(request.body);
      const result = await pool.query<{ id: string; password_hash: string }>(
        'SELECT id,password_hash FROM moderators WHERE email=$1 AND active',
        [email.toLowerCase()],
      );
      if (!result.rows[0] || !verifyPassword(password, result.rows[0].password_hash))
        throw new ReviewError('Invalid credentials', 401);
      const token = newToken();
      await pool.query(
        `INSERT INTO moderator_sessions (token_hash,moderator_id,expires_at)
      VALUES ($1,$2,now()+interval '12 hours')`,
        [hashToken(token), result.rows[0].id],
      );
      return reply
        .setCookie('oc_session', token, {
          httpOnly: true,
          secure: config.cookieSecure,
          sameSite: 'strict',
          path: '/',
          maxAge: 43_200,
        })
        .send({ ok: true });
    },
  );

  app.post('/moderation/logout', async (request, reply) => {
    if (!validMutationOrigin(request)) throw new ReviewError('Invalid request origin', 403);
    const token = request.cookies.oc_session;
    if (token)
      await pool.query('DELETE FROM moderator_sessions WHERE token_hash=$1', [hashToken(token)]);
    return reply.clearCookie('oc_session', { path: '/' }).send({ ok: true });
  });

  app.get('/moderation/me', async (request) => ({
    moderator: Boolean(await moderatorId(request)),
  }));

  app.get('/moderation/proposals', async (request) => {
    await requireModerator(request);
    const result = await pool.query<ProposalRow>(`SELECT ${proposalSelect} FROM proposals
      WHERE status IN ('pending','clarification') ORDER BY created_at ASC LIMIT 100`);
    return { proposals: result.rows.map(proposalData) };
  });

  app.get('/moderation/proposals/:id', async (request, reply) => {
    await requireModerator(request);
    const { id } = idParams.parse(request.params);
    const result = await pool.query<ProposalRow>(
      `SELECT ${proposalSelect} FROM proposals WHERE id=$1`,
      [id],
    );
    if (!result.rows[0]) return reply.code(404).send({ error: 'Proposal not found' });
    const evidence = await pool.query<{
      id: string;
      original_name: string;
      content_type: string;
      byte_size: number;
      publish_consent: boolean;
    }>(
      'SELECT id,original_name,content_type,byte_size,publish_consent FROM proposal_evidence WHERE proposal_id=$1 ORDER BY created_at',
      [id],
    );
    const messages = await pool.query<{ sender: string; message: string; created_at: Date }>(
      'SELECT sender,message,created_at FROM proposal_messages WHERE proposal_id=$1 ORDER BY created_at',
      [id],
    );
    const nearbyRecords = await pool.query<{
      id: string;
      title: string;
      kind: string;
      access_status: string;
      distance_meters: number;
      geometry: unknown;
    }>(
      `SELECT r.id,r.title,r.kind,r.access_status,round(ST_Distance(r.geometry::geography,p.geometry::geography))::integer AS distance_meters,
       ST_AsGeoJSON(r.geometry)::json AS geometry FROM access_records r CROSS JOIN proposals p
       WHERE p.id=$1 AND r.visible AND r.geometry && ST_Expand(p.geometry,0.05)
       AND ST_DWithin(r.geometry::geography,p.geometry::geography,2000)
       ORDER BY distance_meters LIMIT 10`,
      [id],
    );
    const nearbyProposals = await pool.query<{
      id: string;
      title: string;
      status: string;
      distance_meters: number;
    }>(
      `SELECT other.id,other.title,other.status,round(ST_Distance(other.geometry::geography,p.geometry::geography))::integer AS distance_meters
       FROM proposals other CROSS JOIN proposals p WHERE p.id=$1 AND other.id<>p.id
       AND other.status IN ('pending','clarification') AND other.geometry && ST_Expand(p.geometry,0.05)
       AND ST_DWithin(other.geometry::geography,p.geometry::geography,2000)
       ORDER BY distance_meters LIMIT 10`,
      [id],
    );
    return {
      ...proposalData(result.rows[0]),
      evidence: evidence.rows.map((e) => ({
        id: e.id,
        name: e.original_name,
        contentType: e.content_type,
        byteSize: e.byte_size,
        publishConsent: e.publish_consent,
      })),
      messages: messages.rows.map((m) => ({
        sender: m.sender,
        message: m.message,
        createdAt: m.created_at.toISOString(),
      })),
      nearbyRecords: nearbyRecords.rows.map((r) => ({
        id: r.id,
        title: r.title,
        kind: r.kind,
        accessStatus: r.access_status,
        distanceMeters: r.distance_meters,
        geometry: r.geometry,
      })),
      nearbyProposals: nearbyProposals.rows.map((p) => ({
        id: p.id,
        title: p.title,
        status: p.status,
        distanceMeters: p.distance_meters,
      })),
    };
  });

  app.get('/moderation/proposals/:id/evidence/:evidenceId', async (request, reply) => {
    await requireModerator(request);
    const { id, evidenceId } = evidenceParams.parse(request.params);
    const result = await pool.query<{ private_key: string; content_type: string }>(
      'SELECT private_key,content_type FROM proposal_evidence WHERE proposal_id=$1 AND id=$2',
      [id, evidenceId],
    );
    if (!result.rows[0]) return reply.code(404).send({ error: 'Evidence not found' });
    const object = await getObject(result.rows[0].private_key);
    return reply
      .header('Content-Type', result.rows[0].content_type)
      .header(
        'Content-Disposition',
        result.rows[0].content_type === 'application/pdf' ? 'attachment' : 'inline',
      )
      .header('Cache-Control', 'private,no-store')
      .header('X-Content-Type-Options', 'nosniff')
      .send(object.bytes);
  });

  app.post('/moderation/proposals/:id/review', async (request) => {
    if (!validMutationOrigin(request)) throw new ReviewError('Invalid request origin', 403);
    const moderator = await requireModerator(request);
    const { id } = idParams.parse(request.params);
    const input = reviewInputSchema.parse(request.body);
    return reviewProposal(id, moderator, input);
  });

  app.put('/moderation/proposals/:id', async (request) => {
    if (!validMutationOrigin(request)) throw new ReviewError('Invalid request origin', 403);
    const moderator = await requireModerator(request);
    const { id } = idParams.parse(request.params);
    const body = z
      .object({ proposal: proposalInputSchema, reason: z.string().trim().min(10).max(1000) })
      .parse(request.body);
    return editProposal(id, moderator, body.proposal, body.reason);
  });

  app.get('/moderation/records/:id/route-candidates', async (request) => {
    await requireModerator(request);
    const { id } = idParams.parse(request.params);
    return routeCandidates(id);
  });

  app.put('/moderation/records/:id/routes', async (request) => {
    if (!validMutationOrigin(request)) throw new ReviewError('Invalid request origin', 403);
    const moderator = await requireModerator(request);
    const { id } = idParams.parse(request.params);
    const input = routeLinkInputSchema.parse(request.body);
    return replaceRouteLinks(id, moderator, input);
  });

  return app;
}
