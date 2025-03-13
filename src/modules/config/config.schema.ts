import { z } from "zod";

export const putUpdateConfigConfigSchema = z.object({
  key: z.string(),
  value: z.string(),
});

export type PutUpdateConfigBody = z.infer<typeof putUpdateConfigConfigSchema>;