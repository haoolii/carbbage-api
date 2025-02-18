import { NextFunction, Request, Response } from "express";
import MessageResponse from "../types/messageResponse.type";
import { verify } from "../core/jwt";
import { Code } from "../types/code";

export function assetAuth(
  req: Request<{ k1: string; k2: string }, {}, {}>,
  res: Response<MessageResponse>,
  next: NextFunction
) {
  const { k1, k2 } = req.params;

  const key = `${k1}/${k2}`;

  const authHeader = req.headers.authorization || req.cookies['Authorization'];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next("Unauthorized");
  }

  const token = authHeader.split(" ")[1];

  const payload = verify(token) as {
    uniqueId: string;
    keys: Array<string>;
  };

  if (!payload.keys.includes(key)) {
    throw new Error(Code.NOT_FOUND);
  }

  next();
}
