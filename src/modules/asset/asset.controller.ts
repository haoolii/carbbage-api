import { NextFunction, Request, Response } from "express";
import MessageResponse from "../../types/messageResponse.type";
import { Code } from "../../types/code";
import { flattenFiles } from "../../utils";
import { createAssets } from "./asset.service";

export const postUploadHandler = async (
    req: Request<{}, {}, {}>,
    res: Response<MessageResponse>,
    next: NextFunction
) => {
    const files = flattenFiles(req.files);

    const assets = await createAssets(files);

    try {
        res.json({
            code: Code.SUCCESS,
            data: {
                assets
            },
            message: "success",
        });
    } catch (error) {
        next(error);
    }
};
