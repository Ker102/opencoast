import { config as loadEnv } from 'dotenv';
import { resolve } from 'node:path';

loadEnv({ path: resolve(process.cwd(), '../.env') });
loadEnv();

export const config = {
  databaseUrl:
    process.env.DATABASE_URL ?? 'postgres://opencoast:opencoast_local@localhost:54329/opencoast',
  port: Number(
    process.env.NODE_ENV === 'production'
      ? (process.env.PORT ?? (process.env.VERCEL ? 3000 : 8080))
      : (process.env.API_PORT ?? 4000),
  ),
  webOrigin: process.env.WEB_ORIGIN ?? 'http://localhost:5173',
  cookieSecure: process.env.COOKIE_SECURE !== 'false' && process.env.NODE_ENV === 'production',
  localEvidenceDir:
    process.env.LOCAL_EVIDENCE_DIR ??
    (process.env.NODE_ENV === 'production'
      ? undefined
      : resolve(process.cwd(), '../.local-evidence')),
  s3: {
    endpoint: process.env.S3_ENDPOINT,
    region: process.env.S3_REGION ?? 'auto',
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    bucket: process.env.S3_BUCKET ?? 'opencoast-evidence',
    forcePathStyle: process.env.S3_FORCE_PATH_STYLE === 'true',
  },
};
