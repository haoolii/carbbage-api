import { GetObjectCommand, PutObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { v4 as uuid } from "uuid";
import { Stream } from "stream";
import path from "path";
import { bucket, s3Client } from "../../config/s3";
import db from "../../config/db";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

export const uploadFilesToS3 = async (files: Express.Multer.File[]) => {
  const uploadPromises = files.map((file) => {
    return new Promise<string>((resolve, reject) => {
      const key = `${dayjs()
        .utc()
        .format("YYYY-MM-DD")}/${uuid()}${path.extname(file.originalname)}`;
      const uploadParams = {
        Bucket: bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        ALC: "authenticated-read",
      };
      s3Client
        .send(new PutObjectCommand(uploadParams))
        .then(() => {
          resolve(key);
        })
        .catch((err) => {
          // TODO: TBD
          console.log('err', err);
        });
    });
  });

  const keys = await Promise.all(uploadPromises);

  let assetIds: Array<string> = [];
  for (let key of keys) {
    const asset = await db.asset.create({
      data: {
        key
      }
    });
    assetIds.push(asset.id);
  }

  return assetIds;
};

export const getFileFromS3 = async (key: string) => {
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  const fileStream = await s3Client.send(command);

  return {
    fileStream
  };
};

export const getFileListFromS3 = async () => {
  let continuationToken = undefined;
  let files: any[] = [];

  const command = new ListObjectsV2Command({
    Bucket: bucket,
    // Prefix: prefix, // 可以設置前綴來篩選特定目錄
    MaxKeys: 20, // 每次最大返回檔案數量
    ContinuationToken: continuationToken, // 用來實現分頁
  });

  try {
    const data = await s3Client.send(command);
    files = files.concat(data.Contents); // 添加當前頁的檔案
    continuationToken = data.NextContinuationToken; // 取得下一頁的 continuationToken
  } catch (err) {
    console.error("列出檔案錯誤:", err);
  }

  return files;
}

export function webStreamToNodeStream(
  webStream: ReadableStream
): NodeJS.ReadableStream {
  const reader = webStream.getReader();
  return new Stream.Readable({
    async read() {
      const { done, value } = await reader.read();
      if (done) {
        this.push(null);
      } else {
        this.push(Buffer.from(value));
      }
    },
  });
}
