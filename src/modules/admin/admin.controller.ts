import { NextFunction, Request, Response } from "express";

// types
import MessageResponse from "../../types/messageResponse.type";
import { Code } from "../../types/code";

// services
import {
  countAssets,
  countRecordReports,
  countRecords,
  countUrls,
  putRecordReport,
  queryAssets,
  queryRecordReports,
  queryRecords,
  queryUrls,
} from "./admin.service";
import { RecordReport } from "@prisma/client";

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
  req: Request<
    {},
    {},
    {},
    { page: number; size: number; recordId: string; key: string }
  >,
  res: Response<MessageResponse>,
  next: NextFunction
) => {
  try {
    const { page = 0, size = 20, recordId, key } = req.query;

    const assets = await queryAssets({
      page: +page,
      size: +size,
      recordId,
      key,
    });
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

export const getRecordReportsHandler = async (
  req: Request<{}, {}, {}, { page: number; size: number }>,
  res: Response<MessageResponse>,
  next: NextFunction
) => {
  try {
    const { page = 0, size = 20 } = req.query;

    const recordReports = await queryRecordReports({
      page: +page,
      size: +size,
    });
    const total = await countRecordReports();

    res.json({
      code: Code.SUCCESS,
      data: {
        recordReports,
        total,
      },
      message: "success",
    });
  } catch (error) {
    next(error);
  }
};

export const putRecordReportsHandler = async  (
  req: Request<{ recordReportId: string }, {}, RecordReport, {}>,
  res: Response<MessageResponse>,
  next: NextFunction
) => {
  try {

    await putRecordReport(req.params.recordReportId, req.body);

    res.json({
      code: Code.SUCCESS,
      data: {},
      message: "success",
    });
  } catch (error) {
    next(error);
  }
}