import pg from 'pg';
import { config } from './config.js';

const caBase64 = process.env.DATABASE_SSL_CA_B64;
if (config.databaseUrl.includes('supabase.com') && !caBase64)
  throw new Error('Supabase connections require DATABASE_SSL_CA_B64');

export const pool = new pg.Pool({
  connectionString: config.databaseUrl,
  max: process.env.VERCEL ? 1 : 10,
  ssl: caBase64
    ? { ca: Buffer.from(caBase64, 'base64').toString('utf8'), rejectUnauthorized: true }
    : undefined,
});
