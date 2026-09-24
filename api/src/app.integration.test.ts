import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { randomUUID } from 'node:crypto';
import sharp from 'sharp';
import { createApp } from './app.js';
import { pool } from './db.js';
import { passwordHash } from './security.js';

const run = process.env.INTEGRATION_TEST === '1';
const suite = run ? describe : describe.skip;

suite('moderated coastal information flow', () => {
  let app: Awaited<ReturnType<typeof createApp>>;
  let moderatorId: string;
  const marker = randomUUID();
  const email = `test-${marker}@example.org`;
  const password = `long-test-password-${marker}`;
  let cookie = '';
  const origin = 'http://localhost:5173';
  const point = { type: 'Point', coordinates: [18.9, 42.2] };
  const base = {
    kind: 'point',
    geometry: point,
    title: `Integration point ${marker}`,
    summary: 'A test description of this point and its access.',
    description: 'This is a test claim in the isolated test database only.',
    jurisdiction: 'Test jurisdiction',
    accessStatus: 'unknown',
  };

  beforeAll(async () => {
    if (!process.env.DATABASE_URL?.endsWith('/opencoast_test'))
      throw new Error('Integration tests require the isolated opencoast_test database');
    app = await createApp();
    const result = await pool.query<{ id: string }>(
      'INSERT INTO moderators (email,password_hash) VALUES ($1,$2) RETURNING id',
      [email, passwordHash(password)],
    );
    moderatorId = result.rows[0].id;
  });

  afterAll(async () => {
    if (moderatorId) {
      await pool.query(`TRUNCATE proposal_messages, proposal_edits, review_events, access_revisions,
        proposal_evidence, proposals, access_records, moderator_sessions, moderators CASCADE`);
    }
    await app?.close();
    await pool.end();
  });

  it('keeps proposals private, enforces receipt ownership, then publishes a reviewed revision', async () => {
    const invalid = await app.inject({
      method: 'POST',
      url: '/proposals',
      payload: { ...base, kind: 'area' },
    });
    expect(invalid.statusCode).toBe(400);
    const crossing = await app.inject({
      method: 'POST',
      url: '/proposals',
      payload: {
        ...base,
        kind: 'area',
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [18, 42],
              [19, 43],
              [19, 42],
              [18, 43],
              [18, 42],
            ],
          ],
        },
      },
    });
    expect(crossing.statusCode).toBe(400);

    const created = await app.inject({ method: 'POST', url: '/proposals', payload: base });
    expect(created.statusCode).toBe(201);
    const { id, receiptToken } = created.json<{ id: string; receiptToken: string }>();
    expect(receiptToken.length).toBeGreaterThan(40);
    const before = await app.inject('/records?bbox=18,41,20,43');
    expect(
      before
        .json()
        .features.some(
          (feature: { properties: { title: string } }) => feature.properties.title === base.title,
        ),
    ).toBe(false);
    expect(
      (
        await app.inject({
          url: `/proposals/${id}/receipt`,
          headers: { 'x-receipt-token': 'wrong-token' },
        })
      ).statusCode,
    ).toBe(404);
    expect(
      (
        await app.inject({
          url: `/proposals/${id}/receipt`,
          headers: { 'x-receipt-token': receiptToken },
        })
      ).statusCode,
    ).toBe(200);
    expect((await app.inject('/moderation/proposals')).statusCode).toBe(401);

    const login = await app.inject({
      method: 'POST',
      url: '/moderation/login',
      headers: { origin },
      payload: { email, password },
    });
    expect(login.statusCode).toBe(200);
    cookie = String(login.headers['set-cookie']).split(';')[0];
    const queue = await app.inject({ url: '/moderation/proposals', headers: { cookie } });
    expect(queue.json().proposals.some((proposal: { id: string }) => proposal.id === id)).toBe(
      true,
    );
    const detail = await app.inject({ url: `/moderation/proposals/${id}`, headers: { cookie } });
    expect(detail.statusCode).toBe(200);
    expect(detail.json().nearbyRecords).toEqual([]);
    expect(detail.json().nearbyProposals).toEqual([]);

    const png = await sharp({ create: { width: 4, height: 4, channels: 3, background: '#13806b' } })
      .png()
      .toBuffer();
    const upload = async (consent: boolean) => {
      const boundary = `----opencoast-${randomUUID()}`;
      const body = Buffer.concat([
        Buffer.from(
          `--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="test.png"\r\nContent-Type: image/png\r\n\r\n`,
        ),
        png,
        Buffer.from(`\r\n--${boundary}--\r\n`),
      ]);
      return app.inject({
        method: 'POST',
        url: `/proposals/${id}/evidence?publishConsent=${consent}`,
        headers: {
          'x-receipt-token': receiptToken,
          'content-type': `multipart/form-data; boundary=${boundary}`,
        },
        payload: body,
      });
    };
    const privateUpload = await upload(false);
    expect(privateUpload.statusCode).toBe(201);
    const consentedUpload = await upload(true);
    expect(consentedUpload.statusCode).toBe(201);
    const privateId = privateUpload.json().id,
      publicId = consentedUpload.json().id;
    expect((await app.inject(`/records/${id}/evidence/${privateId}`)).statusCode).toBe(404);
    expect(
      (await app.inject({ url: `/moderation/proposals/${id}/evidence/${privateId}` })).statusCode,
    ).toBe(401);

    const noOrigin = await app.inject({
      method: 'POST',
      url: `/moderation/proposals/${id}/review`,
      headers: { cookie },
      payload: {
        action: 'approve',
        explanation: 'Reviewed the claim and found the evidence incomplete.',
        evidenceLevel: 'community_reviewed',
      },
    });
    expect(noOrigin.statusCode).toBe(403);
    const badConsent = await app.inject({
      method: 'POST',
      url: `/moderation/proposals/${id}/review`,
      headers: { cookie, origin },
      payload: {
        action: 'approve',
        explanation: 'Reviewed the submitted evidence and its limits.',
        evidenceLevel: 'community_reviewed',
        publishEvidenceIds: [privateId],
      },
    });
    expect(badConsent.statusCode).toBe(400);
    const noOfficial = await app.inject({
      method: 'POST',
      url: `/moderation/proposals/${id}/review`,
      headers: { cookie, origin },
      payload: {
        action: 'approve',
        explanation: 'Reviewed the submitted details and official sources.',
        evidenceLevel: 'document_backed',
        reviewedSources: true,
      },
    });
    expect(noOfficial.statusCode).toBe(400);

    const approved = await app.inject({
      method: 'POST',
      url: `/moderation/proposals/${id}/review`,
      headers: { cookie, origin },
      payload: {
        action: 'approve',
        explanation: 'Test review notes: status is unknown and no official source was supplied.',
        evidenceLevel: 'community_reviewed',
        publishEvidenceIds: [publicId],
      },
    });
    expect(approved.statusCode).toBe(200);
    const recordId = approved.json().recordId;
    const publicMap = await app.inject('/records?bbox=18,41,20,43');
    const feature = publicMap
      .json()
      .features.find((item: { properties: { id: string } }) => item.properties.id === recordId);
    expect(feature.properties.evidenceLevel).toBe('community_reviewed');
    expect(feature.properties.lastReviewedAt).toBeNull();
    expect(JSON.stringify(feature)).not.toContain(receiptToken);
    const evidence = await app.inject(`/records/${recordId}/evidence`);
    expect(evidence.json().evidence.map((item: { id: string }) => item.id)).toEqual([publicId]);
    expect(
      (await app.inject(`/records/${recordId}/evidence/${publicId}`)).headers['content-type'],
    ).toContain('image/jpeg');
    expect((await app.inject(`/records/${recordId}/evidence/${privateId}`)).statusCode).toBe(404);
    expect((await app.inject(`/records/${recordId}/history`)).json().revisions).toHaveLength(1);

    const revisionInput = {
      ...base,
      title: `Integration point ${marker} revised`,
      targetRecordId: recordId,
      sources: [
        { title: 'Test authority page', url: 'https://example.org/official', kind: 'official' },
      ],
    };
    const revision = await app.inject({
      method: 'POST',
      url: '/proposals',
      payload: revisionInput,
    });
    expect(revision.statusCode).toBe(201);
    const revisionId = revision.json().id;
    const edit = await app.inject({
      method: 'PUT',
      url: `/moderation/proposals/${revisionId}`,
      headers: { cookie, origin },
      payload: {
        proposal: {
          ...revisionInput,
          summary: 'A revised test summary checked against the source.',
        },
        reason: 'Clarified the wording after source review.',
      },
    });
    expect(edit.statusCode).toBe(200);
    const approvedRevision = await app.inject({
      method: 'POST',
      url: `/moderation/proposals/${revisionId}/review`,
      headers: { cookie, origin },
      payload: {
        action: 'approve',
        explanation: 'Official source link reviewed for this test revision.',
        evidenceLevel: 'document_backed',
        reviewedSources: true,
      },
    });
    expect(approvedRevision.statusCode).toBe(200);
    const current = await app.inject(`/records/${recordId}`);
    expect(current.json().properties.revision).toBe(2);
    expect(current.json().properties.lastReviewedAt).toBeTruthy();
    expect((await app.inject(`/records/${recordId}/history`)).json().revisions).toHaveLength(2);
  });
});
