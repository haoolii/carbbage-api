import { Request, Response, NextFunction } from "express";
import {
  GetRecordParams,
  PostRecordPasswordBody,
  PostRecordPasswordParams,
  PostImageRecordBody,
  PostMediaRecordBody,
  PostUrlRecordBody,
} from "./record.schema";
import MessageResponse from "../../types/messageResponse.type";
import { Code } from "../../types/code";
import {
  createAssetsRecord,
  createUrlRecord,
  getRecordAllDetail,
  verifyPasswordAndGenerateToken,
} from "./record.service";
import { ShortenTypeEnum } from "../../types/shorten";

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
    const uniqueId = await createAssetsRecord(ShortenTypeEnum.IMAGE, {
      prompt: req.body.prompt,
      password: req.body.password,
      passwordRequired: req.body.passwordRequired,
      expireIn: req.body.expireIn,
      assetIds: req.body.assetIds,
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
    const uniqueId = await createAssetsRecord(ShortenTypeEnum.MEDIA, {
      prompt: req.body.prompt,
      password: req.body.password,
      passwordRequired: req.body.passwordRequired,
      expireIn: req.body.expireIn,
      assetIds: req.body.assetIds,
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

    const data = await getRecordAllDetail(req.params.uniqueId, req.headers.authorization || "");

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
