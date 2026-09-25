import { randomUUID } from 'node:crypto';
import { config as loadEnv } from 'dotenv';
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';

loadEnv({ path: '../.env.local', quiet: true });
const { S3_ENDPOINT, S3_REGION, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY, S3_BUCKET } = process.env;
if (!S3_ENDPOINT || !S3_ACCESS_KEY_ID || !S3_SECRET_ACCESS_KEY || !S3_BUCKET)
  throw new Error('Missing R2 configuration');

const client = new S3Client({
  endpoint: S3_ENDPOINT,
  region: S3_REGION ?? 'auto',
  credentials: { accessKeyId: S3_ACCESS_KEY_ID, secretAccessKey: S3_SECRET_ACCESS_KEY },
});
const key = `staging/deployment-check-${randomUUID()}.txt`;
try {
  await client.send(
    new PutObjectCommand({
      Bucket: S3_BUCKET,
      Key: key,
      Body: Buffer.from('OpenCoast R2 check'),
      ContentType: 'text/plain',
    }),
  );
  const read = await client.send(new GetObjectCommand({ Bucket: S3_BUCKET, Key: key }));
  if ((await read.Body?.transformToString()) !== 'OpenCoast R2 check')
    throw new Error('R2 readback did not match');
  console.log('R2 private object write and read succeeded');
} finally {
  await client.send(new DeleteObjectCommand({ Bucket: S3_BUCKET, Key: key }));
}
