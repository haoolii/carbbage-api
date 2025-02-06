-- CreateTable
CREATE TABLE "Asset" (
    "id" TEXT NOT NULL,
    "orginialId" TEXT,
    "mimetype" TEXT,
    "destination" TEXT,
    "filename" TEXT,
    "path" TEXT,
    "size" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Asset_pkey" PRIMARY KEY ("id")
);
