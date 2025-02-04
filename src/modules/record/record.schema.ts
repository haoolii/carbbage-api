import { z } from 'zod';

export const postUrlRecordBodySchema = z.object({
    content: z.string().url()
});

export type PostUrlRecordBody = z.infer<typeof postUrlRecordBodySchema>;

const fileSchema = z.object({
    fieldname: z.string(),
    originalname: z.string(),
    encoding: z.string(),
    mimetype: z.string(),
    buffer: z.instanceof(Buffer).optional(),
    destination: z.string().optional(),
    filename: z.string().optional(),
    path: z.string().optional(),
    size: z.number(),
  });

export const postImageRecordFormDataSchema = z.object({
    prompt: z.string().optional(),
    password: z.string().optional(),
    passwordRequired: z.string(),
    expireIn: z.string(),
    files: z.array(fileSchema)
});

export type PostImageRecordFormData = z.infer<typeof postImageRecordFormDataSchema>;

export const postImageRecordBodySchema = z.object({
    prompt: z.string().optional(),
    password: z.string().optional(),
    passwordRequired: z.boolean(),
    expireIn: z.number().nonnegative(),
    files: z.array(fileSchema)
});

export type PostImageRecordBody = z.infer<typeof postImageRecordBodySchema>;

export const postMediaRecordBodySchema = z.object({
    prompt: z.string().optional(),
    password: z.string().optional(),
    passwordRequired: z.string(),
    expireIn: z.string(),
    files: z.array(fileSchema)
});

export type PostMediaRecordBody = z.infer<typeof postMediaRecordBodySchema>;

export const getRecordParamsSchema = z.object({
    uniqueId: z.string()
});

export type GetRecordParams = z.infer<typeof getRecordParamsSchema>;

export const postGainRecordParamsSchema = z.object({
    uniqueId: z.string()
});

export type PostGainRecordParams = z.infer<typeof postGainRecordParamsSchema>;


export const postGainRecordBodySchema = z.object({
    password: z.string()
});

export type PostGainRecordBody = z.infer<typeof postGainRecordBodySchema>;
