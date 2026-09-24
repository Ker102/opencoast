import { pool } from './db.js';
import { passwordHash } from './security.js';

const [email, argumentPassword] = process.argv.slice(2);
const password = process.env.MODERATOR_BOOTSTRAP_PASSWORD ?? argumentPassword;
if (!email || !password || password.length < 12) {
  console.error(
    'Usage: MODERATOR_BOOTSTRAP_PASSWORD=<secret> npm run moderator:create -w api -- <email>',
  );
  process.exitCode = 1;
} else {
  try {
    await pool.query(
      'INSERT INTO moderators (email,password_hash) VALUES ($1,$2) ON CONFLICT (email) DO UPDATE SET password_hash=EXCLUDED.password_hash, active=true',
      [email.toLowerCase(), passwordHash(password)],
    );
    console.log(`Moderator ready: ${email.toLowerCase()}`);
  } finally {
    await pool.end();
  }
}
