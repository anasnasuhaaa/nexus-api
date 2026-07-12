-- CreateEnum
CREATE TYPE "nexus"."MediaCategory" AS ENUM ('GENERAL', 'PROGRAM', 'ARTICLE', 'MEMBER', 'ORGANIZATION', 'HERO');

-- CreateTable
CREATE TABLE "nexus"."MediaAsset" (
    "id" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "sizeBytes" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "altText" TEXT,
    "category" "nexus"."MediaCategory" NOT NULL DEFAULT 'GENERAL',
    "uploadedById" TEXT,
    "uploadedByName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MediaAsset_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MediaAsset_category_idx" ON "nexus"."MediaAsset"("category");

-- CreateIndex
CREATE INDEX "MediaAsset_uploadedById_idx" ON "nexus"."MediaAsset"("uploadedById");

-- CreateIndex
CREATE INDEX "MediaAsset_createdAt_idx" ON "nexus"."MediaAsset"("createdAt");
