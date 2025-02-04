import { Router } from "express";
import {
  getRecordHandler,
  postGainRecordHandler,
  postImageRecordHandler,
  postMediaRecordHandler,
  postUrlRecordHandler,
} from "./record.controller";
import {
  validateBody,
  validateParams,
  validateUpload,
} from "../../middlewares/validate";
import {
  getRecordParamsSchema,
  postGainRecordBodySchema,
  postGainRecordParamsSchema,
  postImageRecordBodySchema,
  postImageRecordFormDataSchema,
  postMediaRecordBodySchema,
  postUrlRecordBodySchema,
} from "./record.schema";
import { parseFormData } from "../../middlewares/parse";
import { parsePostImageRecordFormData } from "./utils";

const router = Router();

router.post("/url", validateBody(postUrlRecordBodySchema), postUrlRecordHandler);

router.post(
  "/image",
  validateUpload("image"),
  validateBody(postImageRecordFormDataSchema),
  parseFormData(parsePostImageRecordFormData),
  validateBody(postImageRecordBodySchema),
  postImageRecordHandler
);

router.post(
  "/media",
  validateUpload("media"),
  validateBody(postMediaRecordBodySchema),
  postMediaRecordHandler
);

router.get("/:uniqueId", validateParams(getRecordParamsSchema), getRecordHandler);

router.post(
  "/:uniqueId",
  validateParams(postGainRecordParamsSchema),
  validateBody(postGainRecordBodySchema),
  postGainRecordHandler
);

export default router;
