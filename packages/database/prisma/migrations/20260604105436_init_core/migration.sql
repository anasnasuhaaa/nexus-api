-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "core";

-- CreateEnum
CREATE TYPE "core"."UnitType" AS ENUM ('BPH', 'BIRO', 'DEPARTEMEN');

-- CreateTable
CREATE TABLE "core"."CabinetPeriod" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "startDate" DATE NOT NULL,
    "endDate" DATE NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CabinetPeriod_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "core"."Birdep" (
    "id" TEXT NOT NULL,
    "cabinetPeriodId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "unitType" "core"."UnitType" NOT NULL,
    "description" TEXT NOT NULL,
    "focusArea" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Birdep_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CabinetPeriod_slug_key" ON "core"."CabinetPeriod"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Birdep_cabinetPeriodId_code_key" ON "core"."Birdep"("cabinetPeriodId", "code");

-- CreateIndex
CREATE UNIQUE INDEX "Birdep_cabinetPeriodId_slug_key" ON "core"."Birdep"("cabinetPeriodId", "slug");

-- AddForeignKey
ALTER TABLE "core"."Birdep" ADD CONSTRAINT "Birdep_cabinetPeriodId_fkey" FOREIGN KEY ("cabinetPeriodId") REFERENCES "core"."CabinetPeriod"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
