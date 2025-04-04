import { Request, Response, NextFunction } from "express";
import {
  GetRecordParams,
  PostRecordPasswordBody,
  PostRecordPasswordParams,
  PostMediaRecordBody,
  PostUrlRecordBody,
  PostImageRecordBody,
  PostRecordReportBody,
  PostRecordReportParams,
} from "./record.schema";
import MessageResponse from "../../types/messageResponse.type";
import { Code } from "../../types/code";
import {
  createAssetsRecord,
  createRecordReport,
  createUrlRecord,
  getRecordAllDetail,
  getRecordCount,
  verifyPasswordAndGenerateToken,
} from "./record.service";
import { ShortenTypeEnum } from "../../types/shorten";
import { flattenFiles } from "../../utils";
import { uploadFilesToS3, uploadFilesToS3V2 } from "../asset/asset.service";

export const postUrlRecordHandler = async (
  req: Request<{}, {}, PostUrlRecordBody>,
  res: Response<MessageResponse>,
  next: NextFunction
) => {
  const uniqueId = await createUrlRecord(req.body.content);

  try {
    res.json({
      code: Code.SUCCESS,
      data: { uniqueId },
      message: "success",
    });
  } catch (error) {
    next(error);
  }
};

export const postImageRecordHandler = async (
  req: Request<{}, {}, PostImageRecordBody>,
  res: Response<MessageResponse>,
  next: NextFunction
) => {
  try {
    const files = flattenFiles(req.files);

    if (!files || !files.length) {
      throw new Error(Code.FILE_IS_EMPTY);
    }

    const assetIds = await uploadFilesToS3(files);

    const uniqueId = await createAssetsRecord(ShortenTypeEnum.IMAGE, {
      prompt: req.body.prompt,
      password: req.body.password,
      passwordRequired: req.body.passwordRequired,
      expireIn: req.body.expireIn,
      assetIds: assetIds,
    });

    res.json({
      code: Code.SUCCESS,
      data: { uniqueId },
      message: "success",
    });
  } catch (error) {
    next(error);
  }
};

export const postMediaRecordHandler = async (
  req: Request<{}, {}, PostMediaRecordBody>,
  res: Response<MessageResponse>,
  next: NextFunction
) => {
  try {
    const files = flattenFiles(req.files);

    if (!files || !files.length) {
      throw new Error(Code.FILE_IS_EMPTY);
    }

    const assetIds = await uploadFilesToS3(files);

    const uniqueId = await createAssetsRecord(ShortenTypeEnum.MEDIA, {
      prompt: req.body.prompt,
      password: req.body.password,
      passwordRequired: req.body.passwordRequired,
      expireIn: req.body.expireIn,
      assetIds: assetIds,
    });
    res.json({
      code: Code.SUCCESS,
      data: { uniqueId },
      message: "success",
    });
  } catch (error) {
    next(error);
  }
};

export const getRecordHandler = async (
  req: Request<GetRecordParams, {}>,
  res: Response<MessageResponse>,
  next: NextFunction
) => {
  try {
    const data = await getRecordAllDetail(
      req.params.uniqueId,
      req.headers.authorization || ""
    );

    res.json({
      code: Code.SUCCESS,
      data,
      message: "success",
    });
  } catch (error) {
    next(error);
  }
};

export const getRecordCountHandler = async (
  req: Request<GetRecordParams, {}>,
  res: Response<MessageResponse>,
  next: NextFunction
) => {
  try {
    const data = await getRecordCount(req.params.uniqueId);

    res.json({
      code: Code.SUCCESS,
      data,
      message: "success",
    });
  } catch (error) {
    next(error);
  }
};

export const postRecordPasswordHandler = async (
  req: Request<PostRecordPasswordParams, {}, PostRecordPasswordBody>,
  res: Response<MessageResponse>,
  next: NextFunction
) => {
  try {
    const token = await verifyPasswordAndGenerateToken(
      req.params.uniqueId,
      req.body.password
    );

    res.json({
      code: Code.SUCCESS,
      data: {
        token,
      },
      message: "success",
    });
  } catch (error) {
    next(error);
  }
};

export const postRecordReportHandler = async (
  req: Request<PostRecordReportParams, {}, PostRecordReportBody>,
  res: Response<MessageResponse>,
  next: NextFunction
) => {
  try {
    const { uniqueId } = req.params;
    const { content } = req.body;

    const result = await createRecordReport(uniqueId, content);

    if (!result) throw new Error(Code.ERROR);

    res.json({
      code: Code.SUCCESS,
      data: {},
      message: "success",
    });
  } catch (error) {
    next(error);
  }
};

export const postMediaRecordHandlerV2 = async (
  req: Request<{}, {}, PostMediaRecordBody>,
  res: Response<MessageResponse>,
  next: NextFunction
) => {
  try {
    const files = flattenFiles(req.files);

    if (!files || !files.length) {
      throw new Error(Code.FILE_IS_EMPTY);
    }

    const assetIds = await uploadFilesToS3V2(files, (percentage) => {
      const data = {
        isEnd: false,
        payload: {
          percentage
        },
      };
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    });

    const uniqueId = await createAssetsRecord(ShortenTypeEnum.MEDIA, {
      prompt: req.body.prompt,
      password: req.body.password,
      passwordRequired: req.body.passwordRequired,
      expireIn: req.body.expireIn,
      assetIds: assetIds,
    });

    const data = {
      isEnd: true,
      payload: {
        code: Code.SUCCESS,
        data: { uniqueId },
        message: "success",
      },
    };
    res.write(`data: ${JSON.stringify(data)}\n\n`);
    res.end();
  } catch (error) {
    const data = {
      isEnd: true,
      payload: {
        code: Code.ERROR,
        message: error,
      },
    };
    res.write(`data: ${JSON.stringify(data)}\n\n`);
    res.end();
  }
};
