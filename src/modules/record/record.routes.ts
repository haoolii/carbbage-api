import { Router } from "express";
import {
  getRecordHandler,
  postRecordPasswordHandler,
  postMediaRecordHandler,
  postUrlRecordHandler,
  getRecordCountHandler,
  postImageRecordHandler,
  postRecordReportHandler,
} from "./record.controller";
import {
  validateBody,
  validateCaptchaToken,
  validateParams,
  validateUpload,
} from "../../middlewares/validate";
import {
  getRecordParamsSchema,
  postRecordPasswordBodySchema,
  postRecordPasswordParamsSchema,
  postMediaRecordBodySchema,
  postUrlRecordBodySchema,
  postImageRecordFormDataSchema,
  postImageRecordBodySchema,
  postMediaRecordFormDataSchema,
  postRecordReportParamsSchema,
  postRecordReportBodySchema,
} from "./record.schema";
import { parseFormData } from "../../middlewares/parse";
import { imageRecordParser, mediaRecordParser } from "./utils";

const router = Router();

router.post(
  "/url",
  validateCaptchaToken(),
  validateBody(postUrlRecordBodySchema),
  postUrlRecordHandler
);

router.post(
  "/image",
  validateUpload(""),
  validateCaptchaToken(),
  validateBody(postImageRecordFormDataSchema),
  parseFormData(imageRecordParser),
  validateBody(postImageRecordBodySchema),
  postImageRecordHandler
);

router.post(
  "/media",
  validateUpload(""),
  validateCaptchaToken(),
  validateBody(postMediaRecordFormDataSchema),
  parseFormData(mediaRecordParser),
  validateBody(postMediaRecordBodySchema),
  postMediaRecordHandler
);

router.get(
  "/:uniqueId",
  validateParams(getRecordParamsSchema),
  getRecordHandler
);

router.get("/:uniqueId/count", getRecordCountHandler);

router.post(
  "/:uniqueId/password",
  validateCaptchaToken(),
  validateParams(postRecordPasswordParamsSchema),
  validateBody(postRecordPasswordBodySchema),
  postRecordPasswordHandler
);

router.post("/:uniqueId/report",
  validateCaptchaToken(),
  validateParams(postRecordReportParamsSchema),
  validateBody(postRecordReportBodySchema),
  postRecordReportHandler
);

export default router;
