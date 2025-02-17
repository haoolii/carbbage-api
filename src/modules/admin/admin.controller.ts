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
  req: Request<{}, {}, {}, { page: number; size: number }>,
  res: Response<MessageResponse>,
  next: NextFunction
) => {
  try {
    const { page = 0, size = 20 } = req.query;

    const records = await queryRecords({ page: +page, size: +size });
    const total = await countRecords();
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
  req: Request<{}, {}, {}, { page: number; size: number }>,
  res: Response<MessageResponse>,
  next: NextFunction
) => {
  try {
    const { page = 0, size = 20 } = req.query;

    const urls = await queryUrls({ page: +page, size: +size });
    const total = await countUrls();
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
  req: Request<{}, {}, {}, { page: number; size: number }>,
  res: Response<MessageResponse>,
  next: NextFunction
) => {
  try {
    const { page = 0, size = 20 } = req.query;

    const assets = await queryAssets({ page: +page, size: +size });
    const total = await countAssets();

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
