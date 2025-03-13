import { Router } from "express";
import { getConfigListHandler } from "./config.controller";

const router = Router();

router.get("/list", getConfigListHandler);

export default router;
