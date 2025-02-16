import jwt from "jsonwebtoken";
import env from "../config/env";

export const sign = (payload: string | Buffer | object) => {
  return jwt.sign(payload, env.PRIVATE_KEY || "", {
    algorithm: "RS256",
    expiresIn: "1h",
  });
};

export const verify = (token: string) => {
  return jwt.verify(token, env.PUBLIC_KEY || "", { algorithms: ["RS256"] });
};
