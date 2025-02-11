/*
  Warnings:

  - You are about to drop the column `destination` on the `Asset` table. All the data in the column will be lost.
  - You are about to drop the column `filename` on the `Asset` table. All the data in the column will be lost.
  - You are about to drop the column `mimetype` on the `Asset` table. All the data in the column will be lost.
  - You are about to drop the column `path` on the `Asset` table. All the data in the column will be lost.
  - You are about to drop the column `size` on the `Asset` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Asset" DROP COLUMN "destination",
DROP COLUMN "filename",
DROP COLUMN "mimetype",
DROP COLUMN "path",
DROP COLUMN "size",
ADD COLUMN     "key" TEXT NOT NULL DEFAULT '';
