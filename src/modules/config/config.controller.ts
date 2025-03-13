import { Request, Response, NextFunction } from "express";
import MessageResponse from "../../types/messageResponse.type";
import { getConfigs, updaetConfig } from "./config.service";
import { Code } from "../../types/code";
import { PutUpdateConfigBody } from "./config.schema";

export const getConfigListHandler = async (
  req: Request<{}, {}>,
  res: Response<MessageResponse>,
  next: NextFunction
) => {
  try {
    const configs = await getConfigs();

    res.json({
      code: Code.SUCCESS,
      data: {
        configs,
      },
      message: "success",
    });
  } catch (error) {
    next(error);
  }
};

export const putUpdateConfigHandler = async (
  req: Request<{}, {}, PutUpdateConfigBody>,
  res: Response<MessageResponse>,
  next: NextFunction
) => {
  try {
    const { key, value } = req.body;

    await updaetConfig(key, value);

    res.json({
      code: Code.SUCCESS,
      data: null,
      message: "success",
    });
  } catch (error) {
    next(error);
  }
};
