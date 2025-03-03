import { Router } from "express";
import { deleteRecordHandler, getAssetsHandler, getRecordReportsHandler, getRecordsHandler, getS3FilesHandler, getUrlsHandler, putRecordReportsHandler } from "./admin.controller";
import { adminAuth } from "../../middlewares/adminAuth";
import authRouter from "./auth/auth.routes";

const router = Router();

router.get("/assets", adminAuth, getAssetsHandler);
router.get("/records", adminAuth, getRecordsHandler);
router.delete("/records/:id", adminAuth, deleteRecordHandler);
router.get("/recordReports", adminAuth ,getRecordReportsHandler);
router.put("/recordReports/:recordReportId", adminAuth, putRecordReportsHandler);
router.get("/urls", adminAuth, getUrlsHandler);

router.use("/auth", authRouter)
export default router;
