import { Router } from "express";
import { postLoginHandler } from "./auth.controller";
import { validateCaptchaToken } from "../../../middlewares/validate";

const router = Router();

router.post("/login", validateCaptchaToken(), postLoginHandler);

export default router;
