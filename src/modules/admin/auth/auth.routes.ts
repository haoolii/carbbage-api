import { Router } from "express";
import { postLoginHandler, postRegisterHandler } from "./auth.controller";

const router = Router();

router.post("/login", postLoginHandler);
router.post("/register", postRegisterHandler);

export default router;
