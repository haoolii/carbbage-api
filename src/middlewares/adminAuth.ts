import { NextFunction, Request, Response } from "express";
import MessageResponse from "../types/messageResponse.type";
import { verify } from "../core/jwt";
import { Code } from "../types/code";
import { parseToken } from "./parse";

export function adminAuth(
  req: Request<{}, {}, {}, { page: number; size: number }>,
  res: Response<MessageResponse>,
  next: NextFunction
) {
  try {
    const token = parseToken(req.headers.authorization || "");

    if (!token) {
    throw new Error(Code.UNAUTHORIZED);
    }

    const payload = verify(token) as {
      id: string;
      email: string;
    };

    if (!payload.email) {
      throw new Error(Code.UNAUTHORIZED)
    }
    next();
  } catch (err) {
    throw new Error(Code.UNAUTHORIZED)
  }
}
