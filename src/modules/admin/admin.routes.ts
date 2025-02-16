import { Router } from "express";
import { getAssetsHandler, getRecordsHandler, getUrlsHandler } from "./admin.controller";
import { adminAuth } from "../../middlewares/adminAuth";
import authRouter from "./auth/auth.routes";

const router = Router();

router.get("/assets", adminAuth, getAssetsHandler);
router.get("/records", adminAuth, getRecordsHandler);
router.get("/urls", adminAuth, getUrlsHandler);

router.use("/auth", authRouter)
export default router;
