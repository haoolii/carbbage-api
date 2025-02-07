import fs from 'fs';

export const PRIVATE_KEY = fs.readFileSync("./private.pem", "utf8");

export const PUBLIC_KEY = fs.readFileSync("./public.pem", "utf8");