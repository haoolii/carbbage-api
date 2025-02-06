import { Router } from "express";
import {
  getRecordHandler,
  postGainRecordHandler,
  postImageRecordHandler,
  postMediaRecordHandler,
  postUrlRecordHandler,
} from "./record.controller";
import { validateBody, validateParams } from "../../middlewares/validate";
import {
  getRecordParamsSchema,
  postGainRecordBodySchema,
  postGainRecordParamsSchema,
  postImageRecordBodySchema,
  postMediaRecordBodySchema,
  postUrlRecordBodySchema,
} from "./record.schema";

const router = Router();

router.post(
  "/url",
  validateBody(postUrlRecordBodySchema),
  postUrlRecordHandler
);

router.post(
  "/image",
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

router.post(
  "/:uniqueId",
  validateParams(postGainRecordParamsSchema),
  validateBody(postGainRecordBodySchema),
  postGainRecordHandler
);

export default router;
