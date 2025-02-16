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

export const parseToken = (authorization: string) => {
  try {
    if (!authorization) {
      return false;
    }
  
    if (!authorization.startsWith("Bearer ")) {
      return false;
    }
  
    const token = authorization.split(" ")[1];
  
    return token;
  } catch (err) {
    return false;
  }
};
