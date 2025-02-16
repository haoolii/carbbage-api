/*
  Warnings:

  - A unique constraint covering the columns `[recordId]` on the table `RecordAccessCount` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "RecordAccessCount_recordId_key" ON "RecordAccessCount"("recordId");
