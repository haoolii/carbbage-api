import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import { Code } from "../types/code";
import { upload } from "../upload";
import MessageResponse from "../types/messageResponse.type";
import fs from "fs";
import { verifyCaptcha } from "../core/captcha";
import { getConfigs } from "../modules/config/config.service";

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

export const validateFormData =
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
      upload.array("files")(req, res, (err) => {
        if (err) {
          if (err.code === "LIMIT_FILE_COUNT") {
            return next(new Error(Code.LIMIT_FILE_COUNT));
          }

          if (err.code === "LIMIT_FILE_SIZE") {
            return next(new Error(Code.LIMIT_FILE_SIZE));
          }

          return next(err);
        }

        next();
      });
    } catch (error) {
      next(error);
    }
  };

export const validateCaptchaToken =
  () => async (req: Request, res: Response, next: NextFunction) => {
    try {
      const xRealIp = req.headers["x-real-ip"]?.toString();

      const ip = xRealIp || req.ip || undefined;

      console.log("IP:", ip);

      const captchaToken = req.body?.captchaToken || "";

      if (!captchaToken) throw new Error(Code.CAPTCHA_IS_NULL);

      if (!(await verifyCaptcha(captchaToken, ip))) {
        throw new Error(Code.CAPTCHA_INVALID);
      }

      next();
    } catch (error) {
      res.status(400).json({
        code: Code.CAPTCHA_ERROR,
        message: "Captcha token error",
        date: null,
      });
    }
  };

export const validateEnable =
  (key: string) => async (req: Request, res: Response, next: NextFunction) => {
    try {
      const configs = await getConfigs();

      const config = configs.find(
        (c) => `${c.key}`.toUpperCase() === `${key}`.toUpperCase()
      );

      if (!config) {
        return next(new Error(Code.FEATURE_DISABLE));
      }

      if (`${config.value}`.toUpperCase() !== "TRUE") {
        return next(new Error(Code.FEATURE_DISABLE));
      }

      next();
    } catch (error) {
      next(error);
    }
  };
