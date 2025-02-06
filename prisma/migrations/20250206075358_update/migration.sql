/*
  Warnings:

  - You are about to drop the column `orginialId` on the `Asset` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Asset" DROP COLUMN "orginialId",
ADD COLUMN     "originalId" TEXT;
