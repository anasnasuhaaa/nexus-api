-- CreateEnum
CREATE TYPE "tevo"."TevoArticleStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateTable
CREATE TABLE "tevo"."TevoArticle" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "excerpt" TEXT,
    "content" TEXT NOT NULL,
    "coverUrl" TEXT,
    "status" "tevo"."TevoArticleStatus" NOT NULL DEFAULT 'DRAFT',
    "authorUserId" TEXT,
    "authorName" TEXT,
    "authorEmail" TEXT,
    "publishedAt" TIMESTAMP(3),
    "archivedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TevoArticle_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TevoArticle_slug_key" ON "tevo"."TevoArticle"("slug");

-- CreateIndex
CREATE INDEX "TevoArticle_status_idx" ON "tevo"."TevoArticle"("status");

-- CreateIndex
CREATE INDEX "TevoArticle_publishedAt_idx" ON "tevo"."TevoArticle"("publishedAt");

-- CreateIndex
CREATE INDEX "TevoArticle_createdAt_idx" ON "tevo"."TevoArticle"("createdAt");
