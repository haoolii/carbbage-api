import { NextFunction, Request, Response } from "express";

// types
import MessageResponse from "../../types/messageResponse.type";
import { Code } from "../../types/code";

// services
import {
  countAssets,
  countRecords,
  countUrls,
  queryAssets,
  queryRecords,
  queryUrls,
} from "./admin.service";

export const getRecordsHandler = async (
  req: Request<{}, {}, {}, { page: number; size: number; uniqueId: string }>,
  res: Response<MessageResponse>,
  next: NextFunction
) => {
  try {
    const { page = 0, size = 20, uniqueId } = req.query;

    const records = await queryRecords({ page: +page, size: +size, uniqueId });
    const total = await countRecords({ uniqueId });
    res.json({
      code: Code.SUCCESS,
      data: {
        records,
        total,
      },
      message: "success",
    });
  } catch (error) {
    res.write("event: error\n");
    next(error);
  }
};

export const getUrlsHandler = async (
  req: Request<
    {},
    {},
    {},
    { page: number; size: number; recordId: string; content: string }
  >,
  res: Response<MessageResponse>,
  next: NextFunction
) => {
  try {
    const { page = 0, size = 20, recordId, content } = req.query;

    const urls = await queryUrls({
      page: +page,
      size: +size,
      recordId,
      content,
    });
    const total = await countUrls({ recordId, content });
    res.json({
      code: Code.SUCCESS,
      data: {
        urls,
        total,
      },
      message: "success",
    });
  } catch (error) {
    res.write("event: error\n");
    next(error);
  }
};

export const getAssetsHandler = async (
  req: Request<{}, {}, {}, { page: number; size: number, recordId: string, key: string }>,
  res: Response<MessageResponse>,
  next: NextFunction
) => {
  try {
    const { page = 0, size = 20, recordId, key } = req.query;

    const assets = await queryAssets({ page: +page, size: +size, recordId, key });
    const total = await countAssets({ recordId, key });

    res.json({
      code: Code.SUCCESS,
      data: {
        assets,
        total,
      },
      message: "success",
    });
  } catch (error) {
    next(error);
  }
};
