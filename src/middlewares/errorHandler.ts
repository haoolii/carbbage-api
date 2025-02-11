import { NextFunction, Request, Response } from "express";
import ErrorResponse from "../types/errorResponse.type";
import { Code } from "../types/code";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(
  err: Error,
  req: Request,
  res: Response<ErrorResponse>,
  next: NextFunction
) {
  //   const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  //   res.status(statusCode);

  if (Object.values(Code).includes(err.message as unknown as Code)) {
    res.json({
      message: err.message,
      stack: process.env.NODE_ENV === "production" ? "🥞" : err.stack,
      data: null,
      code: err.message as Code,
    });
    return;
  }

  res.json({
    code: Code.ERROR,
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? "🥞" : err.stack,
  });
}
