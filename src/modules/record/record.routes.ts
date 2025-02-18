import { Router } from "express";
import {
  getRecordHandler,
  postRecordPasswordHandler,
  postMediaRecordHandler,
  postUrlRecordHandler,
  getRecordCountHandler,
  postImageRecordHandler,
} from "./record.controller";
import { validateBody, validateParams, validateUpload } from "../../middlewares/validate";
import {
  getRecordParamsSchema,
  postRecordPasswordBodySchema,
  postRecordPasswordParamsSchema,
  postMediaRecordBodySchema,
  postUrlRecordBodySchema,
  postImageRecordFormDataSchema,
  postImageRecordBodySchema,
} from "./record.schema";
import { parseFormData } from "../../middlewares/parse";
import { imageRecordParser } from "./utils";

const router = Router();

router.post(
  "/url",
  validateBody(postUrlRecordBodySchema),
  postUrlRecordHandler
);

router.post(
  "/image",
  validateUpload(""),
  validateBody(postImageRecordFormDataSchema),
  parseFormData(imageRecordParser),
  validateBody(postImageRecordBodySchema),
  postImageRecordHandler
);

router.post(
  "/media",
  validateBody(postMediaRecordBodySchema),
  postMediaRecordHandler
);

router.get(
  "/:uniqueId",
  validateParams(getRecordParamsSchema),
  getRecordHandler
);

router.get(
  "/:uniqueId/count",
  getRecordCountHandler
);

router.post(
  "/:uniqueId/password",
  validateParams(postRecordPasswordParamsSchema),
  validateBody(postRecordPasswordBodySchema),
  postRecordPasswordHandler
);

export default router;
