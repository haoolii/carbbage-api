import { Router } from "express";
import {
  getRecordHandler,
  postRecordPasswordHandler,
  postImageRecordHandler,
  postMediaRecordHandler,
  postUrlRecordHandler,
  getRecordCountHandler,
} from "./record.controller";
import { validateBody, validateParams } from "../../middlewares/validate";
import {
  getRecordParamsSchema,
  postRecordPasswordBodySchema,
  postRecordPasswordParamsSchema,
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
