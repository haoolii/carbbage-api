import jwt from "jsonwebtoken";
import env from "../config/env";

const PRIVATE_KEY = env.PRIVATE_KEY?.replace(/\\n/g, '\n').replace(/\r/g, '');
const PUBLIC_KEY = env.PUBLIC_KEY?.replace(/\\n/g, '\n').replace(/\r/g, '');

export const sign = (payload: string | Buffer | object) => {
  return jwt.sign(payload, PRIVATE_KEY || "", {
    algorithm: "RS256",
    expiresIn: "1h",
  });
};

export const verify = (token: string) => {
  return jwt.verify(token, PUBLIC_KEY || "", { algorithms: ["RS256"] });
};
