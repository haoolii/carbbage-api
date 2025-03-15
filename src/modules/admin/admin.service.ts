import { Record as DbRecord, RecordReport } from "@prisma/client";
import db from "../../config/db";
import dayjs from "dayjs";
import { deleteS3Object } from "../asset/asset.service";

export const queryRecords = async ({
  page,
  size,
  uniqueId,
  orderBy = { createdAt: "desc" },
  from,
  to,
}: {
  page: number;
  size: number;
  uniqueId?: string;
  from?: string;
  to?: string;
  orderBy?: Partial<Record<keyof DbRecord, "asc" | "desc">>;
}) => {
  return db.record.findMany({
    skip: page * size,
    take: size,
    orderBy,
    where: {
      uniqueId: {
        contains: uniqueId,
      },
      createdAt: {
        gte: from || undefined,
        lte: to || undefined,
      },
    },
  });
};
export const deleteRecord = async (id: string, soft = true) => {
  if (soft) {
    return db.record.update({
      where: {
        id,
      },
      data: {
        isDeleted: true,
      },
    });
  } else {
    await db.$transaction(async (prisma) => {
      // 刪除 record 本身
      await prisma.record.deleteMany({
        where: {
          id: id,
        },
      });

      // 刪除 record 觀看數
      await prisma.recordAccessCount.deleteMany({
        where: {
          recordId: id,
        },
      });

      // 刪除 record 回報
      await prisma.recordReport.deleteMany({
        where: {
          recordId: id,
        },
      });

      // 刪除 record 的 assets
      const assets = await prisma.asset.findMany({
        where: {
          recordId: id,
        },
      });

      // 刪除 Assets
      await prisma.asset.deleteMany({
        where: {
          recordId: id,
        },
      });

      // 刪除 S3 上的物件
      for (let asset of assets) {
        await deleteS3Object(asset.key);
      }
    });
  }
};

export const countRecords = async ({
  uniqueId,
  createdAtGt,
  createdAtLt,
  from,
  to
}: {
  uniqueId?: string;
  createdAtLt?: string;
  createdAtGt?: string;
  from?: string;
  to?: string;
}) => {
  return db.record.count({
    where: {
      uniqueId: {
        contains: uniqueId,
      },
      createdAt: {
        gte: from || undefined,
        lte: to || undefined,
      },
    },
  });
};

export const queryAssets = async ({
  page,
  size,
  recordId,
  key,
  from,
  to
}: {
  page: number;
  size: number;
  recordId: string;
  key: string;
  from?: string;
  to?: string;
}) => {
  return db.asset.findMany({
    skip: page * size,
    take: size,
    where: {
      recordId: {
        contains: recordId,
      },
      key: {
        contains: key,
      },
      createdAt: {
        gte: from || undefined,
        lte: to || undefined,
      },
    },
  });
};

export const countAssets = async ({
  recordId,
  key,
  from,
  to,
}: {
  recordId?: string;
  key?: string;
  from?: string;
  to?: string;
}) => {
  return db.asset.count({
    where: {
      recordId: {
        contains: recordId,
      },
      key: {
        contains: key,
      },
      createdAt: {
        gte: from || undefined,
        lte: to || undefined,
      },
    },
  });
};

export const queryUrls = async ({
  page,
  size,
  recordId,
  content,
  from,
  to,
}: {
  page: number;
  size: number;
  recordId?: string;
  content?: string;
  from?: string;
  to?: string;
}) => {
  return db.url.findMany({
    skip: page * size,
    take: size,
    where: {
      recordId: {
        contains: recordId,
      },
      content: {
        contains: content,
      },
      createdAt: {
        gte: from || undefined,
        lte: to || undefined,
      },
    },
  });
};

export const countUrls = async ({
  recordId,
  content,
  from,
  to,
}: {
  recordId?: string;
  content?: string;
  from?: string;
  to?: string;
}) => {
  return db.url.count({
    where: {
      recordId: {
        contains: recordId,
      },
      content: {
        contains: content,
      },
      createdAt: {
        gte: from || undefined,
        lte: to || undefined,
      },
    },
  });
};

export const queryRecordReports = async ({
  page,
  size,
  from,
  to,
}: {
  page: number;
  size: number;
  from?: string;
  to?: string;
}) => {
  const recordReports = await db.recordReport.findMany({
    skip: page * size,
    take: size,
    where: {
      createdAt: {
        gte: from || undefined,
        lte: to || undefined,
      },
    },
  });

  return await Promise.all(
    recordReports.map(async (recordReport) => {
      const record = await db.record.findUnique({
        where: { id: recordReport.recordId },
      });
      return {
        ...recordReport,
        record,
      };
    })
  );
};

export const countRecordReports = async ({
  from,
  to,
}: {
  from?: string;
  to?: string;
}) => {
  return db.recordReport.count({
    where: {
      createdAt: {
        gte: from || undefined,
        lte: to || undefined,
      },
    },
  });
};

export const putRecordReport = async (
  recordReportId: string,
  recordReport: RecordReport
) => {
  return db.recordReport.update({
    where: {
      id: recordReportId,
    },
    data: {
      content: recordReport.content,
      isDeleted: recordReport.isDeleted,
    },
  });
};

export const deleteOldRecord = async (days: number) => {
  const records = await db.record.findMany({
    where: {
      type: {
        not: "url",
      },
      createdAt: {
        lt: dayjs().subtract(days, "day").toISOString(),
      },
    },
  });

  for (let record of records) {
    await db.$transaction(async (prisma) => {
      // 刪除 record 本身
      await prisma.record.deleteMany({
        where: {
          id: record.id,
        },
      });

      // 刪除 record 觀看數
      await prisma.recordAccessCount.deleteMany({
        where: {
          recordId: record.id,
        },
      });

      // 刪除 record 回報
      await prisma.recordReport.deleteMany({
        where: {
          recordId: record.id,
        },
      });

      // 刪除 record 的 assets
      const assets = await prisma.asset.findMany({
        where: {
          recordId: record.id,
        },
      });

      // 刪除 Assets
      await prisma.asset.deleteMany({
        where: {
          recordId: record.id,
        },
      });

      // 刪除 S3 上的物件
      for (let asset of assets) {
        await deleteS3Object(asset.key);
      }
    });
  }

  return records.length;
};

export const deleteExpiredRecord = async () => {
  const records = await db.record.findMany({
    where: {
      type: {
        not: "url",
      },
      expireAt: {
        lt: new Date().toISOString(), // 取得目前的 UTC 時間
      },
    },
  });

  for (let record of records) {
    await db.$transaction(async (prisma) => {
      // 刪除 record 本身
      await prisma.record.deleteMany({
        where: {
          id: record.id,
        },
      });

      // 刪除 record 觀看數
      await prisma.recordAccessCount.deleteMany({
        where: {
          recordId: record.id,
        },
      });

      // 刪除 record 回報
      await prisma.recordReport.deleteMany({
        where: {
          recordId: record.id,
        },
      });

      // 刪除 record 的 assets
      const assets = await prisma.asset.findMany({
        where: {
          recordId: record.id,
        },
      });

      // 刪除 Assets
      await prisma.asset.deleteMany({
        where: {
          recordId: record.id,
        },
      });

      // 刪除 S3 上的物件
      for (let asset of assets) {
        await deleteS3Object(asset.key);
      }
    });
  }

  return records.length;
};
