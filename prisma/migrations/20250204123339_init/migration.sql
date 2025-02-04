-- CreateTable
CREATE TABLE "Record" (
    "id" TEXT NOT NULL,
    "uniqueId" TEXT NOT NULL,
    "prompt" TEXT,
    "password" TEXT,
    "passwordRequired" BOOLEAN NOT NULL DEFAULT false,
    "type" TEXT NOT NULL,
    "expireIn" INTEGER,
    "expireAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Record_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Original" (
    "id" TEXT NOT NULL,
    "recordId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "meta" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Original_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Record_uniqueId_key" ON "Record"("uniqueId");
