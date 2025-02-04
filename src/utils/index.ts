import crypto from "crypto";
import dayjs from "dayjs";
import { Code } from "../types/code";
import db from "../config/db";

export function randomUnique(length = 5): Promise<string> {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(3, (err, buffer) => {
      if (err) return reject(err);
      const uniqueId = buffer.toString("hex").slice(0, length);
      resolve(uniqueId);
    });
  });
}

/**
 * generate unique id
 */
export async function generateUniqueId(length = 5): Promise<string> {
  let uniqueId;
  let count;
  let retries = 0;
  const maxRetries = 10;
  do {
    if (retries >= maxRetries) {
      throw new Error(Code.GENERATE_UNIQUE_ID_FAILED);
    }
    uniqueId = await randomUnique(length);
    count = await db.record.count({ where: { uniqueId } });
    retries++;
  } while (count > 0);
  return uniqueId;
}

/**
 * calculate expireAt
 */
export function calcExpireAt(expireIn: number): string | null {
  if (!expireIn) {
    return null;
  }

  return dayjs().add(expireIn, "seconds").toISOString();
}


/**
 * 
 * @param files 
 * @returns Express.Multer.File[]
 */
export function flattenFiles(
  files:
    | {
        [fieldname: string]: Express.Multer.File[];
      }
    | Express.Multer.File[]
    | undefined
): Express.Multer.File[] {
  return files
    ? Array.isArray(files)
      ? files
      : Object.values(files).flat()
    : [];
}
