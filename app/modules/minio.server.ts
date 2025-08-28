import * as Minio from 'minio'

const mc = new Minio.Client({
  endPoint: 'play.min.io',
  port: 9000,
  useSSL: true,
  accessKey: 'Q3AM3UQ867SPQQA43P2F',
  secretKey: 'zuf+tfteSlswRu7BJ86wekitnifILbZam1KYY3TG',
})

const BUCKET = process.env.MINIO_BUCKET!;

export function getDownloadUrl(key: string, expiresSec = 300, filename?: string) {
  return mc.presignedGetObject(BUCKET, key, expiresSec, {
    'response-content-disposition': filename
      ? `attachment; filename="${filename}"`
      : 'attachment',
  });
}

// ---- NEW: bulk sign (for loader)
export async function signKeys(keys: string[], expiresSec = 300) {
  return Promise.all(keys.map(async (k) => {
    if (!k) return '';
    // backward-compat: if it's already a full URL (legacy row), keep it
    if (/^https?:\/\//i.test(k)) return k;
    const filename = k.split('/').pop() || 'download';
    return getDownloadUrl(k, expiresSec, filename);
  }));
}

export function listObjectKeys(prefix = ''): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const keys: string[] = [];
    const s = mc.listObjectsV2(BUCKET, prefix, true);
    s.on('data', (o) => keys.push(o.name));
    s.on('end', () => resolve(keys));
    s.on('error', reject);
  });
}

export async function uploadToMinio(
  fileStream: ReadableStream,
  key: string,
  size: number
): Promise<{ key: string }> {
  if (!(await mc.bucketExists(BUCKET))) await mc.makeBucket(BUCKET);
  await mc.putObject(BUCKET, key, fileStream, size);
  return { key };
}
