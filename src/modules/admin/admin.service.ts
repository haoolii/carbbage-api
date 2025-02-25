import { Record as DbRecord, RecordReport } from "@prisma/client";
import db from "../../config/db";

export const queryRecords = async ({
  page,
  size,
  uniqueId,
  orderBy = { createdAt: "desc" },
}: {
  page: number;
  size: number;
  uniqueId?: string;
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
    },
  });
};

export const countRecords = async ({ uniqueId }: { uniqueId?: string }) => {
  return db.record.count({
    where: {
      uniqueId: {
        contains: uniqueId,
      },
    },
  });
};

export const queryAssets = async ({
  page,
  size,
  recordId,
  key,
}: {
  page: number;
  size: number;
  recordId: string;
  key: string;
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
    },
  });
};

export const countAssets = async ({
  recordId,
  key,
}: {
  recordId?: string;
  key?: string;
}) => {
  return db.asset.count({
    where: {
      recordId: {
        contains: recordId,
      },
      key: {
        contains: key,
      },
    },
  });
};

export const queryUrls = async ({
  page,
  size,
  recordId,
  content,
}: {
  page: number;
  size: number;
  recordId?: string;
  content?: string;
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
    },
  });
};

export const countUrls = async ({
  recordId,
  content,
}: {
  recordId?: string;
  content?: string;
}) => {
  return db.url.count({
    where: {
      recordId: {
        contains: recordId,
      },
      content: {
        contains: content,
      },
    },
  });
};

export const queryRecordReports = async ({
  page,
  size,
}: {
  page: number;
  size: number;
}) => {
  return db.recordReport.findMany({
    skip: page * size,
    take: size,
  });
};

export const countRecordReports = async () => {
  return db.recordReport.count({});
};

export const putRecordReport = async (recordReportId: string, recordReport: RecordReport) => {
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
