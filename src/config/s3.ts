import { S3Client } from "@aws-sdk/client-s3";
import env from "./env";

export const s3Client = new S3Client({
  region: env.S3_CLIENT_REGION,
  endpoint: env.S3_CLIENT_ENDPOINT,
  credentials: {
    accessKeyId: env.S3_CLIENT_CREDENTIALS_ACCESSKEYID || "",
    secretAccessKey: env.S3_CLIENT_CREDENTIALS_SECRET_ACCESS_KEY || "",
  },
});

export const bucket = env.S3_CLIENT_BUCKET;