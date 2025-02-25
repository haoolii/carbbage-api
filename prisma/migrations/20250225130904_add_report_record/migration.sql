-- CreateTable
CREATE TABLE "RecordReport" (
    "id" TEXT NOT NULL,
    "recordId" TEXT NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RecordReport_pkey" PRIMARY KEY ("id")
);
