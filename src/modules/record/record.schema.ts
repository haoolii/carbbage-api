import { z } from "zod";

export const postUrlRecordBodySchema = z.object({
  content: z.string().url(),
});

export type PostUrlRecordBody = z.infer<typeof postUrlRecordBodySchema>;

export const postImageRecordFormDataSchema = z.object({
  prompt: z.string().optional(),
  password: z.string().optional(),
  passwordRequired: z.string(),
  expireIn: z.string(),
});

export type PostImageRecordFormData = z.infer<
  typeof postImageRecordFormDataSchema
>;

export const postImageRecordBodySchema = z.object({
  prompt: z.string().optional(),
  password: z.string().optional(),
  passwordRequired: z.boolean(),
  expireIn: z.number().nonnegative(),
});

export type PostImageRecordBody = z.infer<typeof postImageRecordBodySchema>;

export const postMediaRecordFormDataSchema = z.object({
  prompt: z.string().optional(),
  password: z.string().optional(),
  passwordRequired: z.string(),
  expireIn: z.string(),
});

export type PostMediaRecordFormData = z.infer<
  typeof postMediaRecordFormDataSchema
>;

export const postMediaRecordBodySchema = z.object({
  prompt: z.string().optional(),
  password: z.string().optional(),
  passwordRequired: z.boolean(),
  expireIn: z.number().nonnegative(),
});

export type PostMediaRecordBody = z.infer<typeof postMediaRecordBodySchema>;

export const getRecordParamsSchema = z.object({
  uniqueId: z.string(),
});

export type GetRecordParams = z.infer<typeof getRecordParamsSchema>;

export const postRecordPasswordParamsSchema = z.object({
  uniqueId: z.string(),
});

export type PostRecordPasswordParams = z.infer<
  typeof postRecordPasswordParamsSchema
>;

export const postRecordPasswordBodySchema = z.object({
  password: z.string(),
});

export type PostRecordPasswordBody = z.infer<
  typeof postRecordPasswordBodySchema
>;

export const postRecordReportParamsSchema = z.object({
  uniqueId: z.string(),
});

export type PostRecordReportParams = z.infer<
  typeof postRecordReportParamsSchema
>;

export const postRecordReportBodySchema = z.object({
    content: z.string(),
  });
  
  export type PostRecordReportBody = z.infer<
    typeof postRecordReportBodySchema
  >;