import db from "../../config/db";
import { Code } from "../../types/code";
import { ShortenTypeEnum } from "../../types/shorten";
import { calcExpireAt, generateUniqueId } from "../../utils";
import { PostImageRecordBody } from "./record.schema";

export const getOriginalsByRecordId = async (recordId: string) => {
  return db.original.findMany({
    where: {
      recordId,
    },
  });
};

export const getRecordByUniqueId = async (uniqueId: string) => {
  const reocrd = await db.record.findUnique({
    where: {
      uniqueId,
    },
  });

  if (!reocrd) {
    throw new Error(Code.NOT_FOUND);
  }

  return reocrd;
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

    await prisma.original.create({
      data: {
        content,
        recordId: record.id,
      },
    });
  });

  return uniqueId;
};

// prompt: z.string().optional(),
//   password: z.string().optional(),
//   passwordRequired: z.string(),
//   expireIn: z.number().nonnegative(),
//   files: z.array(fileSchema)

export const createImageRecord = async ({
  prompt,
  password,
  passwordRequired,
  expireIn,
  fileNames,
}: {
  prompt?: string;
  password?: string;
  passwordRequired: boolean;
  expireIn: number;
  fileNames: string[]
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

    await prisma.original.createMany({
      data: fileNames.map((fileName) => ({
        content: fileName,
        recordId: record.id,
      })),
    });
  });

  return uniqueId;
};
