import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve, sep } from 'node:path';
import { config } from './config.js';

export function storageReady(): boolean {
  return Boolean(config.localEvidenceDir || (config.s3.accessKeyId && config.s3.secretAccessKey));
}

function localPath(key: string): string {
  if (!config.localEvidenceDir) throw new Error('Local evidence storage not configured');
  const root = resolve(config.localEvidenceDir);
  const path = resolve(root, key);
  if (!path.startsWith(root + sep)) throw new Error('Invalid evidence key');
  return path;
}

export const s3 = new S3Client({
  endpoint: config.s3.endpoint,
  region: config.s3.region,
  forcePathStyle: config.s3.forcePathStyle,
  credentials: storageReady()
    ? { accessKeyId: config.s3.accessKeyId!, secretAccessKey: config.s3.secretAccessKey! }
    : undefined,
});

export async function putObject(key: string, bytes: Buffer, contentType: string): Promise<void> {
  if (config.localEvidenceDir) {
    const path = localPath(key);
    await mkdir(resolve(path, '..'), { recursive: true });
    await writeFile(path, bytes);
    return;
  }
  await s3.send(
    new PutObjectCommand({
      Bucket: config.s3.bucket,
      Key: key,
      Body: bytes,
      ContentType: contentType,
    }),
  );
}

export async function getObject(key: string): Promise<{ bytes: Buffer; contentType: string }> {
  if (config.localEvidenceDir)
    return {
      bytes: await readFile(localPath(key)),
      contentType: key.endsWith('.jpg') ? 'image/jpeg' : 'application/octet-stream',
    };
  const result = await s3.send(new GetObjectCommand({ Bucket: config.s3.bucket, Key: key }));
  if (!result.Body) throw new Error('Object has no body');
  return {
    bytes: Buffer.from(await result.Body.transformToByteArray()),
    contentType: result.ContentType ?? 'application/octet-stream',
  };
}
