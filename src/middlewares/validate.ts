import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
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
  (type?: string) =>
    (req: Request, res: Response<MessageResponse>, next: NextFunction) => {
      try {
        upload.array("files", 5)(req, res, (err: any) => {

          if (err || !req.files) {
            return next(err);
          }

          // const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
          // const invalidFiles = (req.files as Express.Multer.File[]).filter(
          //   (file) => !allowedTypes.includes(file.mimetype)
          // );

          // if (invalidFiles.length > 0) {
          //   invalidFiles.forEach((file) => {
          //     try {
          //       fs.unlinkSync(file.path);
          //     } catch (err) {
          //       console.error("Error while deleting the file:", err);
          //     }
          //   });

          //   return res.status(400).json({
          //     code: Code.INVALID_REQUEST_DATA,
          //     message: "Invalid file type",
          //     data: null,
          //   });
          // }

          // TODO: check file type
          // req.body.files = req.files;
          next();
        });
      } catch (error) {
        next(error);
      }
    };
