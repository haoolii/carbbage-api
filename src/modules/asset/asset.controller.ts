import { NextFunction, Request, Response } from "express";

// service
import {
  getFileFromS3,
  getS3PreSignedUrl,
  uploadFilesToS3,
  webStreamToNodeStream,
} from "./asset.service";

// types
import MessageResponse from "../../types/messageResponse.type";
import { Code } from "../../types/code";

// utils
import { flattenFiles } from "../../utils";

export const getPresignedUrlHandler = async (
  req: Request<{}, {}, {}>,
  res: Response<MessageResponse>,
  next: NextFunction
) => {
  try {
    res.json({
      code: Code.SUCCESS,
      data: {
        presignedUrl: await getS3PreSignedUrl(),
      },
      message: "success",
    });
  } catch (error) {
    next(error);
  }
};

export const postUploadHandler = async (
  req: Request<{}, {}, {}>,
  res: Response<MessageResponse>,
  next: NextFunction
) => {
  try {
    const files = flattenFiles(req.files);

    if (!files || !files.length) {
      throw new Error(Code.FILE_IS_EMPTY);
    }

    const assetIds = await uploadFilesToS3(files);

    res.json({
      code: Code.SUCCESS,
      data: {
        assetIds,
      },
      message: "success",
    });
  } catch (error) {
    res.write("event: error\n");
    next(error);
  }
};

export const fileHandler = async (
  req: Request<{ k1: string; k2: string }, {}, {}>,
  res: Response<MessageResponse>,
  next: NextFunction
) => {
  try {
    const { k1, k2 } = req.params;

    const key = `${k1}/${k2}`;

    const { fileStream } = await getFileFromS3(key);

    if (!(fileStream.ContentType && fileStream.Body)) {
      throw new Error(Code.NOT_FOUND);
    }

    const webStream = fileStream.Body.transformToWebStream();

    const nodeStream = webStreamToNodeStream(webStream);

    res.setHeader("Content-Type", fileStream.ContentType);

    nodeStream.pipe(res);
  } catch (error) {
    next(error);
  }
};
