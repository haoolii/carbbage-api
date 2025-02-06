import { Request, Response, NextFunction } from "express";
import {
  GetRecordParams,
  PostGainRecordBody,
  PostGainRecordParams,
  PostImageRecordBody,
  PostMediaRecordBody,
  PostUrlRecordBody,
} from "./record.schema";
import MessageResponse from "../../types/messageResponse.type";
import { Code } from "../../types/code";
import {
  createImageRecord,
  createUrlRecord,
  getAssetsByRecordId,
  getRecordByUniqueId,
  getUrlByRecordId,
} from "./record.service";
import { RecordAssetsUrlsDto } from "./record.dto";

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
    const uniqueId = await createImageRecord({
      prompt: req.body.prompt,
      password: req.body.password,
      passwordRequired: req.body.passwordRequired,
      expireIn: req.body.expireIn,
      assetIds: req.body.assetIds
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
    res.json({
      code: Code.SUCCESS,
      data: null,
      message: "Post Media Record",
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
    const uniqueId = req.params.uniqueId;

    const record = await getRecordByUniqueId(uniqueId);

    const assets = await getAssetsByRecordId(record.id);

    const urls = await getUrlByRecordId(record.id);

    res.json({
      code: Code.SUCCESS,
      data: new RecordAssetsUrlsDto(record, assets, urls).getPublic(),
      message: "success",
    });
  } catch (error) {
    next(error);
  }
};

export const postGainRecordHandler = async (
  req: Request<PostGainRecordParams, {}, PostGainRecordBody>,
  res: Response<MessageResponse>,
  next: NextFunction
) => {
  try {
    res.json({
      code: Code.SUCCESS,
      data: null,
      message: "Post Gain Record",
    });
  } catch (error) {
    next(error);
  }
};
