import { Record as DbRecord } from "@prisma/client";
import db from "../../config/db";

export const queryRecords = async ({
  page,
  size,
  orderBy = { createdAt: "desc" },
}: {
  page: number;
  size: number;
  orderBy?: Partial<Record<keyof DbRecord, "asc" | "desc">>;
}) => {
  return db.record.findMany({
    skip: page * size,
    take: size,
    orderBy,
  });
};

export const countRecords = async () => {
  return db.record.count();
};

export const queryAssets = async ({
  page,
  size,
}: {
  page: number;
  size: number;
}) => {
  return db.asset.findMany({
    skip: page * size,
    take: size,
  });
};

export const countAssets = async () => {
  return db.asset.count();
};

export const queryUrls = async ({
  page,
  size,
}: {
  page: number;
  size: number;
}) => {
  return db.url.findMany({
    skip: page * size,
    take: size,
  });
};

export const countUrls = async () => {
  return db.url.count();
};
