import { Router } from "express";
import { fileHandler, postUploadHandler } from "./asset.controller";
import { validateUpload } from "../../middlewares/validate";

const router = Router();

router.post("/upload", validateUpload(""), postUploadHandler);

router.get("/files/:k1/:k2", fileHandler);

export default router;
