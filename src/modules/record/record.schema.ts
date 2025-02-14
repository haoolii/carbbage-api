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
    passwordRequired: z.boolean(),
    expireIn: z.number().nonnegative(),
    assetIds: z.array(z.string())
});

export type PostMediaRecordBody = z.infer<typeof postMediaRecordBodySchema>;

export const getRecordParamsSchema = z.object({
    uniqueId: z.string()
});

export type GetRecordParams = z.infer<typeof getRecordParamsSchema>;

export const postRecordPasswordParamsSchema = z.object({
    uniqueId: z.string()
});

export type PostRecordPasswordParams = z.infer<typeof postRecordPasswordParamsSchema>;


export const postRecordPasswordBodySchema = z.object({
    password: z.string()
});

export type PostRecordPasswordBody = z.infer<typeof postRecordPasswordBodySchema>;
