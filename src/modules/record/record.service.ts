import { Asset, Record } from "@prisma/client";
import db from "../../config/db";
import { sign, verify } from "../../core/jwt";
import { Code } from "../../types/code";
import { ShortenTypeEnum } from "../../types/shorten";
import { calcExpireAt, generateUniqueId, isExpired } from "../../utils";

export const getUrlByRecordId = async (recordId: string) => {
  return db.url.findMany({ where: { recordId } });
};

export const getAssetsByRecordId = async (recordId: string) => {
  return db.asset.findMany({ where: { recordId } });
};

export const increaseRecordAccessCount = async (recordId: string) => {
  return db.recordAccessCount.upsert({
    where: { recordId },
    create: {
      recordId,
      count: 1,
    },
    update: {
      recordId,
      count: {
        increment: 1,
      },
    },
  });
};

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

export const verifyPasswordAndGenerateToken = async (
  uniqueId: string,
  password: string
) => {
  const record = await getRecordByUniqueId(uniqueId);

  if (password !== record.password) {
    throw new Error(Code.NOT_FOUND);
  }

  const assets = await getAssetsByRecordId(record.id);

  const token = sign({ uniqueId, keys: assets.map((asset) => asset.key) });

  return token;
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

export const createAssetsRecord = async (
  type: ShortenTypeEnum,
  {
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
    assetIds: string[];
  }
) => {
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
        type,
      },
    });

    for (let assetId of assetIds) {
      await prisma.asset.update({
        where: {
          id: assetId,
        },
        data: {
          recordId: record.id,
        },
      });
    }
  });

  return uniqueId;
};

export const collectUrlRecord = async (record: Record) => {
  const urls = await getUrlByRecordId(record.id);

  return {
    uniqueId: record.uniqueId,
    type: record.type,
    prompt: record.prompt,
    passwordRequired: record.passwordRequired,
    createdAt: record.createdAt,
    urls: urls,
    assets: [],
  };
};

export const collectAssetRecordFullFields = async (
  record: Record,
  assets: Asset[]
) => {
  return {
    uniqueId: record.uniqueId,
    type: record.type,
    prompt: record.prompt,
    passwordRequired: record.passwordRequired,
    createdAt: record.createdAt,
    urls: [],
    assets: assets,
  };
};

export const collectAssetRecordPartialFields = async (record: Record) => {
  return {
    uniqueId: record.uniqueId,
    type: record.type,
    prompt: record.prompt,
    passwordRequired: record.passwordRequired,
    createdAt: record.createdAt,
  };
};

export const collectToken = (authorization: string) => {
  if (!authorization) {
    return false;
  }

  if (!authorization.startsWith("Bearer ")) {
    return false;
  }

  const token = authorization.split(" ")[1];

  return token;
};

export const verifyTokenAndRecord = (token: string, uniqueId: string) => {
  try {
    const payload = verify(token) as {
      uniqueId: string;
      keys: Array<string>;
    };

    return payload.uniqueId === uniqueId;
  } catch (err) {
    return false;
  }
};

export const getRecordCount = async (uniqueId: string) => {
  const record = await getRecordByUniqueId(uniqueId);

  const data = await db.recordAccessCount.findUnique({
    where: { recordId: record.id },
  });

  return {
    count: data?.count,
  };
};

export const getRecordAllDetail = async (
  uniqueId: string,
  authorization: string
) => {
  const record = await getRecordByUniqueId(uniqueId);

  if (record.type === "url") {
    await increaseRecordAccessCount(record.id);
    return {
      record: await collectUrlRecord(record),
      tokenVerified: false,
    };
  }

  // expired
  if (record.expireAt && isExpired(record.expireAt)) {
    return null;
  }

  if (!record.passwordRequired) {
    const assets = await getAssetsByRecordId(record.id);
    await increaseRecordAccessCount(record.id);
    return {
      record: await collectAssetRecordFullFields(record, assets),
      tokenVerified: false,
      token: sign({ uniqueId, keys: assets.map((asset) => asset.key) }),
    };
  }

  const token = collectToken(authorization);

  if (!token) {
    return {
      record: await collectAssetRecordPartialFields(record),
      tokenVerified: false,
    };
  }

  const verified = verifyTokenAndRecord(token, record.uniqueId);

  if (!verified) {
    return {
      record: await collectAssetRecordPartialFields(record),
      tokenVerified: false,
    };
  }

  await increaseRecordAccessCount(record.id);
  const assets = await getAssetsByRecordId(record.id);

  return {
    record: await collectAssetRecordFullFields(record, assets),
    token: token,
    tokenVerified: true,
  };

  // v無密碼 Get                 => return  全部資料 + token
  // v有密碼 無token Get         => return  部分資料 tokenVerified = false
  // v有密碼 有token沒Pass Get   => return  部分資料 tokenVerified = false
  //  有密碼 有token且Pass Get   => return  全部資料 tokenVerified = true
};
