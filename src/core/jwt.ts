import jwt from "jsonwebtoken";
import { PRIVATE_KEY, PUBLIC_KEY } from "./auth";

export const sign = (payload: string | Buffer | object) => {
  return jwt.sign(payload, PRIVATE_KEY, {
    algorithm: "RS256",
    expiresIn: "1h",
  });
};

export const verify = (token: string) => {
  return jwt.verify(token, PUBLIC_KEY, { algorithms: ["RS256"] });
};
