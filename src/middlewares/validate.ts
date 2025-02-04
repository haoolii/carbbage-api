import { Request, Response, NextFunction } from "express";
import { date, ZodSchema } from "zod";
import { Code } from "../types/code";
import { upload } from "../upload";
import MessageResponse from "../types/messageResponse.type";
import fs from "fs";

export const validateBody =
  (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (req.files && Array.isArray(req.files)) {
        // if found error and files exist
        req.files.forEach((file: Express.Multer.File) => {
          try {
            fs.unlinkSync(file.path);
          } catch (err) {
            console.error("Error while deleting the file:", err);
          }
        });
      }

      res.status(400).json({
        code: Code.INVALID_REQUEST_DATA,
        message: "Invalid request data",
        date: null,
      });
    }
  };

export const validateParams =
  (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.params);
      next();
    } catch (error) {
      res.status(400).json({
        code: Code.INVALID_REQUEST_DATA,
        message: "Invalid request data",
        date: null,
      });
    }
  };

export const validateUpload =
  (type: string) =>
  (req: Request, res: Response<MessageResponse>, next: NextFunction) => {
    try {
      upload.array("files", 2)(req, res, (err: any) => {
        if (err || !req.files) {
          return next(err);
        }
        // TODO: check file type
        req.body.files = req.files;
        next();
      });
    } catch (error) {
      next(error);
    }
  };
