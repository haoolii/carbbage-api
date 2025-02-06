/*
  Warnings:

  - You are about to drop the `Original` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "Asset" ADD COLUMN     "recordId" TEXT;

-- DropTable
DROP TABLE "Original";

-- CreateTable
CREATE TABLE "Url" (
    "id" TEXT NOT NULL,
    "recordId" TEXT,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Url_pkey" PRIMARY KEY ("id")
);
