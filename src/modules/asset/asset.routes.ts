import { Router } from "express";
import { fileHandler } from "./asset.controller";
import { assetAuth } from "../../middlewares/assetAuth";

const router = Router();

router.get("/files/:k1/:k2", assetAuth, fileHandler);

export default router;
