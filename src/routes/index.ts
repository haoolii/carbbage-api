import { Router } from "express";

import recordRouter from "../modules/record/record.routes";
import assetRouter from "../modules/asset/asset.routes";
import configRouter from "../modules/config/config.routes";
import adminRouter from "../modules/admin/admin.routes";

const router = Router();

router.use("/record", recordRouter);
router.use("/asset", assetRouter);
router.use("/config", configRouter);
router.use("/admin", adminRouter);

export default router;
