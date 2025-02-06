import { Router } from "express";

import recordRouter from "../modules/record/record.routes";
import assetRouter from "../modules/asset/asset.routes";

const router = Router();

router.use("/record", recordRouter);
router.use("/asset", assetRouter);

export default router;
