/*
  Warnings:

  - You are about to drop the column `originalId` on the `Asset` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Asset" DROP COLUMN "originalId";

-- AlterTable
ALTER TABLE "Original" ADD COLUMN     "assetId" TEXT;
