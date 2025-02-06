import db from "../../config/db";
import { AssetFileType } from "../../types/asset.type";

export const createAssets = async (files: AssetFileType[]) => {
    return db.$transaction(async (prisma) => {
        const assetIds: string[] = [];
        for (let file of files) {
            const asset = await prisma.asset.create({
                data: {
                    mimetype: file.mimetype,
                    destination: file.destination,
                    filename: file.filename,
                    path: file.path,
                    size: file.size
                }
            });
            assetIds.push(asset.id);
        }

        return assetIds;
    });
}
