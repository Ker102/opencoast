import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import type { FastifyRequest } from 'fastify';
import { config } from './config.js';
import { validMutationOrigin } from './auth.js';
import { createApp } from './fastify-app.js';

describe('web origins during a domain migration', () => {
  const originalOrigins = config.webOrigins;
  const origins = ['https://opencoast.kaelux.dev', 'https://opencoast-web.vercel.app'];
  let app: ReturnType<typeof createApp>;

  beforeAll(async () => {
    config.webOrigins = origins;
    app = createApp();
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
    config.webOrigins = originalOrigins;
  });

  it('allows each exact origin for moderator mutations, rejecting missing or lookalike origins', () => {
    for (const origin of origins) {
      expect(validMutationOrigin({ headers: { origin } } as FastifyRequest)).toBe(true);
    }
    for (const origin of [undefined, 'null', 'https://opencoast.kaelux.dev.evil.example']) {
      expect(validMutationOrigin({ headers: { origin } } as FastifyRequest)).toBe(false);
    }
  });

  it('allows upload-related API preflights from both origins without allowing unrelated origins', async () => {
    for (const origin of [...origins, 'https://other.example']) {
      const response = await app.inject({
        method: 'OPTIONS',
        url: '/proposals',
        headers: { origin, 'access-control-request-method': 'POST' },
      });
      expect(response.headers['access-control-allow-origin']).toBe(
        origins.includes(origin) ? origin : undefined,
      );
    }
  });
});
