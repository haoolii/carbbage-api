import { NextFunction, Request, Response } from "express";
import MessageResponse from "../types/messageResponse.type";

export const parseFormData =
  <T>(parser: (formData: unknown) => T) =>
  (req: Request, res: Response<MessageResponse>, next: NextFunction) => {
    try {
      req.body = parser(req.body);
      next();
    } catch (error) {
      next(error);
    }
  };
