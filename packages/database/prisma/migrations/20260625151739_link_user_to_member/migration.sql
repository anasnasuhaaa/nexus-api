-- AlterTable
ALTER TABLE "nexus"."user" ADD COLUMN     "memberId" TEXT,
ADD COLUMN     "mustChangePassword" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'ANGGOTA_BIRDEP';

-- CreateIndex
CREATE INDEX "user_memberId_idx" ON "nexus"."user"("memberId");

-- AddForeignKey
ALTER TABLE "nexus"."user" ADD CONSTRAINT "user_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "core"."Member"("id") ON DELETE SET NULL ON UPDATE CASCADE;
