import pkg from "aws-sdk";
const { S3 } = pkg;
import { Readable } from "stream";

const {
  MINIO_ENDPOINT = "http://localhost:9000",
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

export async function uploadToMinio(
  fileStream: Readable,
  key: string,
  contentType: string
): Promise<string> {
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
