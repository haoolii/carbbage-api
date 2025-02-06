import { z } from 'zod';

export const postUrlRecordBodySchema = z.object({
    content: z.string().url()
});

export type PostUrlRecordBody = z.infer<typeof postUrlRecordBodySchema>;

export const postImageRecordBodySchema = z.object({
    prompt: z.string().optional(),
    password: z.string().optional(),
    passwordRequired: z.boolean(),
    expireIn: z.number().nonnegative(),
    assetIds: z.array(z.string())
});

export type PostImageRecordBody = z.infer<typeof postImageRecordBodySchema>;

export const postMediaRecordBodySchema = z.object({
    prompt: z.string().optional(),
    password: z.string().optional(),
    passwordRequired: z.string(),
    expireIn: z.string(),
    assetIds: z.array(z.string())
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
