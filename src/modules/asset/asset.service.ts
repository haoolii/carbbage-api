import {
  GetObjectCommand,
  PutObjectCommand,
  ListObjectsV2Command,
  DeleteObjectCommand,
  DeleteObjectsCommand,
} from "@aws-sdk/client-s3";
import { v4 as uuid } from "uuid";
import { Stream } from "stream";
import path from "path";
import { bucket, s3Client } from "../../config/s3";
import db from "../../config/db";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

dayjs.extend(utc);

export const uploadFilesToS3 = async (files: Express.Multer.File[]) => {
  const tempUploadFiles = files.map((file) => {
    return {
      file: file,
      key: `${dayjs().utc().format("YYYY-MM-DD")}/${uuid()}${path.extname(
        file.originalname
      )}`,
    };
  });

  const keys = tempUploadFiles.map((tempUploadFile) => tempUploadFile.key);

  let assetIds: Array<string> = [];
  for (let key of keys) {
    const asset = await db.asset.create({
      data: {
        key,
      },
    });
    assetIds.push(asset.id);
  }

  const uploadPromises = tempUploadFiles.map((tempUploadFile) => {
    return new Promise<string>((resolve, reject) => {
      const { file, key } = tempUploadFile;
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
          console.log("err", err);
        });
    });
  });

  await Promise.all(uploadPromises);

  return assetIds;
};

export const getFileFromS3 = async (key: string) => {
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  const fileStream = await s3Client.send(command);

  return {
    fileStream,
  };
};

// 刪除 S3 物件的函式
export const deleteDateFolderS3Object = async (prefix: string) => {
  try {
    // 先列出目錄下的所有物件
    const listCommand = new ListObjectsV2Command({
      Bucket: bucket,
      Prefix: prefix, // 目錄的前綴
    });

    const { Contents } = await s3Client.send(listCommand);

    if (!Contents || Contents.length === 0) {
      console.log("目錄是空的，無需刪除");
      return;
    }

    // 提取所有物件的 Key
    const objectsToDelete = Contents.map((obj) => ({ Key: obj.Key }));

    // 使用 DeleteObjects 刪除物件
    const deleteCommand = new DeleteObjectsCommand({
      Bucket: bucket,
      Delete: {
        Objects: objectsToDelete,
        Quiet: false, // 設定為 false 會返回每個刪除操作的詳細訊息
      },
    });

    const deleteResponse = await s3Client.send(deleteCommand);
    console.log("刪除成功:", deleteResponse);
  } catch (err) {
    console.error("刪除失敗:", err);
  }
};

// 刪除 S3 物件的函式
export const deleteS3Object = async (key: string) => {
  try {
    const command = new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    });

    await s3Client.send(command);
  } catch (err) {
    throw new Error(`刪除 S3 物件錯誤: ${err}`);
  }
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
};

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

export const getS3PreSignedUrl = async () => {
  try {
    const expiresIn = 300; // Presigned URL 5 分鐘內有效

    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: `test/${uuid()}`,
      ContentType: "video/mp4",
    });

    return await getSignedUrl(s3Client, command, { expiresIn });
  } catch (err) {
    throw new Error(`產生 Presigned URL 錯誤: ${err}`);
  }
};
