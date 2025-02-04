import { Code } from "./code";

export default interface MessageResponse<T = unknown> {
  message: string;
  data?: T | null;
  code: Code;
  error?: unknown;
}
