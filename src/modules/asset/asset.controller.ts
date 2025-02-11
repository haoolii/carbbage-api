import { NextFunction, Request, Response } from "express";

// service
import {
  getFileFromS3,
  uploadFilesToS3,
  webStreamToNodeStream,
} from "./asset.service";

// types
import MessageResponse from "../../types/messageResponse.type";
import { Code } from "../../types/code";

// utils
import { flattenFiles } from "../../utils";

export const postUploadHandler = async (
  req: Request<{}, {}, {}>,
  res: Response<MessageResponse>,
  next: NextFunction
) => {
  const files = flattenFiles(req.files);

  if (!files || !files.length) {
    throw new Error(Code.FILE_IS_EMPTY);
  }

  const keys = await uploadFilesToS3(files);

  try {
    res.json({
      code: Code.SUCCESS,
      data: {
        keys,
      },
      message: "success",
    });
  } catch (error) {
    next(error);
  }
};

export const fileHandler = async (
  req: Request<{ k1: string; k2: string }, {}, {}>,
  res: Response<MessageResponse>,
  next: NextFunction
) => {
  try {
    // const authHeader = req.cookies.Authorization || req.headers.authorization;
    //   if (!authHeader || !authHeader.startsWith("Bearer ")) {
    //     return next("Unauthorized")
    //   }
    //   try {
    //     const token = authHeader.split(" ")[1];
    //     const payload = verify(token, PUBLIC_KEY, { algorithms: ["RS256"] });
    //     TODO: Filter
    //     next();
    //   } catch (err) {
    //     return next(err);
    //   }
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
