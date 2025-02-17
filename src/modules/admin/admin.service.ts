import db from "../../config/db";

export const queryRecords = async ({
  page,
  size,
}: {
  page: number;
  size: number;
}) => {
  return db.record.findMany({
    skip: page * size,
    take: size,
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