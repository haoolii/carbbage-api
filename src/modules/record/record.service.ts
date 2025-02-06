import db from "../../config/db";
import { Code } from "../../types/code";
import { ShortenTypeEnum } from "../../types/shorten";
import { calcExpireAt, generateUniqueId } from "../../utils";
import { PostImageRecordBody } from "./record.schema";

export const getUrlByRecordId = async (recordId: string) => {
  return db.url.findMany({ where: { recordId } })
}

export const getAssetsByRecordId = async (recordId: string) => {
  return db.asset.findMany({ where: { recordId } })
}

export const getRecordByUniqueId = async (uniqueId: string) => {
  const record = await db.record.findUnique({
    where: {
      uniqueId,
    },
  });

  if (!record) {
    throw new Error(Code.NOT_FOUND);
  }

  return record;
};

/**
 *
 * @param content URL
 * @returns { Promise<string> } uniqueId
 */
export const createUrlRecord = async (content: string) => {
  const uniqueId = await generateUniqueId();

  await db.$transaction(async (prisma) => {
    const record = await prisma.record.create({
      data: {
        uniqueId,
        type: ShortenTypeEnum.URL,
      },
    });

    await prisma.url.create({
      data: {
        content,
        recordId: record.id,
      },
    });
  });

  return uniqueId;
};
export const createImageRecord = async ({
  prompt,
  password,
  passwordRequired,
  expireIn,
  assetIds,
}: {
  prompt?: string;
  password?: string;
  passwordRequired: boolean;
  expireIn: number;
  assetIds: string[]
}) => {
  const uniqueId = await generateUniqueId();

  await db.$transaction(async (prisma) => {
    const record = await prisma.record.create({
      data: {
        uniqueId,
        prompt,
        password,
        passwordRequired,
        expireIn,
        expireAt: calcExpireAt(expireIn),
        type: ShortenTypeEnum.IMAGE,
      },
    });

    for (let assetId of assetIds) {
      await prisma.asset.update({
        where: {
          id: assetId
        },
        data: {
          recordId: record.id
        }
      })
    }

  });

  return uniqueId;
};
