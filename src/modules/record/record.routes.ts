import { Router } from "express";
import {
  getRecordHandler,
  postRecordPasswordHandler,
  postMediaRecordHandler,
  postUrlRecordHandler,
  getRecordCountHandler,
  postImageRecordHandler,
  postRecordReportHandler,
  postMediaRecordHandlerV2,
} from "./record.controller";
import {
  validateBody,
  validateCaptchaToken,
  validateEnable,
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
  validateEnable("URL_ENABLE"),
  validateCaptchaToken(),
  validateBody(postUrlRecordBodySchema),
  postUrlRecordHandler
);

router.post(
  "/image",
  validateEnable("IMAGE_ENABLE"),
  validateUpload(""),
  validateCaptchaToken(),
  validateBody(postImageRecordFormDataSchema),
  parseFormData(imageRecordParser),
  validateBody(postImageRecordBodySchema),
  postImageRecordHandler
);

router.post(
  "/media",
  validateEnable("MEDIA_ENABLE"),
  validateUpload(""),
  validateCaptchaToken(),
  validateBody(postMediaRecordFormDataSchema),
  parseFormData(mediaRecordParser),
  validateBody(postMediaRecordBodySchema),
  postMediaRecordHandler
);

router.post(
  "/media/v2",
  validateEnable("MEDIA_ENABLE"),
  validateUpload(""),
  validateCaptchaToken(),
  validateBody(postMediaRecordFormDataSchema),
  parseFormData(mediaRecordParser),
  validateBody(postMediaRecordBodySchema),
  postMediaRecordHandlerV2
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
