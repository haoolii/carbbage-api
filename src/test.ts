import { PutObjectCommand }  from "@aws-sdk/client-s3";
import { bucket, s3Client } from "./config/s3";
import { v4 as uuid } from "uuid";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";


const run = async () => {
  const key = `uploads/${uuid()}-${"fileName"}`;
  const expiresIn = 300; // Presigned URL 5 分鐘內有效

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ContentType: "fileType",
  });
  const url = await getSignedUrl(s3Client, command, { expiresIn: 300 });

  console.log('url', url)

};

run();
