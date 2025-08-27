import pkg from "aws-sdk";
const { S3 } = pkg;
import { Readable } from "stream";

const {
  MINIO_ENDPOINT = "http://minio:9000",
  MINIO_ACCESS_KEY = "minioadmin",
  MINIO_SECRET_KEY = "minioadmin",
  MINIO_BUCKET = "cards",
} = process.env;

export const s3 = new S3({
  endpoint: MINIO_ENDPOINT,
  accessKeyId: MINIO_ACCESS_KEY,
  secretAccessKey: MINIO_SECRET_KEY,
  s3ForcePathStyle: true,
  signatureVersion: "v4",
});

async function ensureBucketExists() {
  try {
    await s3.headBucket({ Bucket: MINIO_BUCKET }).promise();
  } catch (error: any) {
    if (error.statusCode === 404) {
      await s3.createBucket({ Bucket: MINIO_BUCKET }).promise();
      console.log(`Bucket ${MINIO_BUCKET} created successfully`);
    } else {
      console.error("Error checking/creating bucket:", error);
      throw error;
    }
  }
}

export async function uploadToMinio(
  fileStream: Readable,
  key: string,
  contentType: string
): Promise<string> {
  // Убеждаемся что bucket существует
  await ensureBucketExists();
  
  await s3
    .upload({
      Bucket: MINIO_BUCKET,
      Key: key,
      Body: fileStream,
      ContentType: contentType,
      ACL: "public-read",
    })
    .promise();

  return `${MINIO_ENDPOINT}/${MINIO_BUCKET}/${encodeURIComponent(key)}`;
}

export async function loadFromMinio(url: string): Promise<string> {
  // Проверяем что URL не пустой
  if (!url || url.trim() === "") {
    console.warn("Empty URL provided to loadFromMinio");
    return "";
  }
  
  try {
    const pathname = new URL(url).pathname.split("/").slice(2).join("/");
    const key = decodeURIComponent(pathname);
    
    if (!key) {
      console.warn("Invalid key extracted from URL:", url);
      return "";
    }
    
    const { Body } = await s3
      .getObject({ Bucket: MINIO_BUCKET, Key: key })
      .promise();
    return Body?.toString("utf-8") ?? "";
  } catch (error) {
    console.error("Error loading from MinIO:", error);
    return "";
  }
}