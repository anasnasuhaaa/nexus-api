-- CreateTable
CREATE TABLE "nexus"."UserActivationEmailLog" (
    "id" TEXT NOT NULL,
    "targetUserId" TEXT NOT NULL,
    "senderUserId" TEXT,
    "targetEmail" TEXT NOT NULL,
    "targetName" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserActivationEmailLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UserActivationEmailLog_targetUserId_idx" ON "nexus"."UserActivationEmailLog"("targetUserId");

-- CreateIndex
CREATE INDEX "UserActivationEmailLog_senderUserId_idx" ON "nexus"."UserActivationEmailLog"("senderUserId");

-- CreateIndex
CREATE INDEX "UserActivationEmailLog_status_idx" ON "nexus"."UserActivationEmailLog"("status");

-- CreateIndex
CREATE INDEX "UserActivationEmailLog_createdAt_idx" ON "nexus"."UserActivationEmailLog"("createdAt");
