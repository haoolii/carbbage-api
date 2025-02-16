import { NextFunction, Request, Response } from "express";

// types
import MessageResponse from "../../types/messageResponse.type";
import { Code } from "../../types/code";

// services
import { queryAssets, queryRecords, queryUrls } from "./admin.service";

export const getRecordsHandler = async (
  req: Request<{}, {}, {}, { page: number; size: number }>,
  res: Response<MessageResponse>,
  next: NextFunction
) => {
  try {
    const { page = 0, size = 20 } = req.query;

    const records = await queryRecords({ page: +page, size: +size });

    res.json({
      code: Code.SUCCESS,
      data: {
        records,
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

    res.json({
      code: Code.SUCCESS,
      data: {
        urls,
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

    res.json({
      code: Code.SUCCESS,
      data: {
        assets,
      },
      message: "success",
    });
  } catch (error) {
    next(error);
  }
};
