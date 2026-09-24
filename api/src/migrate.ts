import { readFile, readdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pool } from './db.js';

const directory = resolve(process.cwd(), 'db');
try {
  for (const file of (await readdir(directory)).filter((name) => name.endsWith('.sql')).sort())
    await pool.query(await readFile(resolve(directory, file), 'utf8'));
  console.log('Database migration complete');
} finally {
  await pool.end();
}
