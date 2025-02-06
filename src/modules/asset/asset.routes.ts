import { Router } from "express";
import { postUploadHandler } from "./asset.controller";
import { validateUpload } from "../../middlewares/validate";

const router = Router();

router.post("/upload", validateUpload(""), postUploadHandler);

export default router;
