/*
  Warnings:

  - A unique constraint covering the columns `[publicSlug]` on the table `Program` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "tevo";

-- AlterTable
ALTER TABLE "nexus"."Program" ADD COLUMN     "archivedFromTevoAt" TIMESTAMP(3),
ADD COLUMN     "publicCoverUrl" TEXT,
ADD COLUMN     "publicDescription" TEXT,
ADD COLUMN     "publicSlug" TEXT,
ADD COLUMN     "publicSummary" TEXT,
ADD COLUMN     "publicTitle" TEXT,
ADD COLUMN     "publishedToTevoAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "tevo"."TevoSiteProfile" (
    "id" TEXT NOT NULL,
    "siteName" TEXT NOT NULL DEFAULT 'Tevo',
    "tagline" TEXT,
    "organizationSummary" TEXT,
    "vision" TEXT,
    "mission" TEXT,
    "heroTitle" TEXT,
    "heroSubtitle" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TevoSiteProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Program_publicSlug_key" ON "nexus"."Program"("publicSlug");
