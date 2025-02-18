import { NextFunction, Request, Response } from "express";

// types
import MessageResponse from "../../../types/messageResponse.type";
import { Code } from "../../../types/code";
import bcrypt from "bcryptjs";
import { createAdmin, getAdminByEmail } from "./auth.service";
import jwt from "jsonwebtoken";
import { sign } from "../../../core/jwt";
import { verifyCaptcha } from "../../../core/captcha";

const SALT = 3;
// services

export const postLoginHandler = async (
  req: Request<{}, {}, { email: string; password: string, captchToken: string }>,
  res: Response<MessageResponse>,
  next: NextFunction
) => {
  try {
    const { email, password, captchToken } = req.body;
    
    const ip = req.ip || "";

    if(!await verifyCaptcha(captchToken, ip)) {
      return res.status(401).json({
        code: Code.UNAUTHORIZED,
        message: "Invalid email or password",
      });
    }

    const admin = await getAdminByEmail(email);

    if (!admin) {
      return res.status(401).json({
        code: Code.UNAUTHORIZED,
        message: "Invalid email or password",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        code: Code.UNAUTHORIZED,
        message: "Invalid email or password",
      });
    }

    const token = sign({ id: admin.id, email: admin.email });

    // Generate token logic here
    res.json({
      code: Code.SUCCESS,
      data: {
        token
      },
      message: "success",
    });
  } catch (error) {
    next(error);
  }
};

export const postRegisterHandler = async (
  req: Request<{}, {}, { email: string; password: string }>,
  res: Response<MessageResponse>,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    const hash = await bcrypt.hash(password, SALT);

    await createAdmin(email, hash);

    res.json({
      code: Code.SUCCESS,
      data: {},
      message: "success",
    });
  } catch (error) {
    next(error);
  }
};
