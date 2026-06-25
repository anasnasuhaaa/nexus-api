import "dotenv/config";

import crypto from "node:crypto";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, UnitType } from "../src/generated/prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "DATABASE_URL belum dikonfigurasi. Pastikan file packages/database/.env tersedia.",
  );
}

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({
  adapter,
});

const birdeps = [
  {
    code: "BPH",
    slug: "bph",
    name: "Badan Pengurus Harian",
    unitType: UnitType.BPH,
    description: "Badan Pengurus Harian Ormawa Eksekutif PKU IPB.",
    focusArea: "Koordinasi, pengawasan, dan pengambilan keputusan organisasi.",
  },
  {
    code: "INTERNAL",
    slug: "internal",
    name: "Biro Internal",
    unitType: UnitType.BIRO,
    description: "Biro Internal Ormawa Eksekutif PKU IPB.",
    focusArea: "Akan dilengkapi melalui modul pengelolaan profil Birdep.",
  },
  {
    code: "MEDBRAND",
    slug: "medbrand",
    name: "Biro Media Branding",
    unitType: UnitType.BIRO,
    description: "Biro Media Branding Ormawa Eksekutif PKU IPB.",
    focusArea: "Akan dilengkapi melalui modul pengelolaan profil Birdep.",
  },
  {
    code: "RISTEK",
    slug: "ristek",
    name: "Biro Riset dan Teknologi",
    unitType: UnitType.BIRO,
    description: "Biro Riset dan Teknologi Ormawa Eksekutif PKU IPB.",
    focusArea: "Akan dilengkapi melalui modul pengelolaan profil Birdep.",
  },
  {
    code: "KOMIT",
    slug: "komit",
    name: "Biro Kolaborasi dan Kemitraan",
    unitType: UnitType.BIRO,
    description: "Biro Kolaborasi dan Kemitraan Ormawa Eksekutif PKU IPB.",
    focusArea: "Akan dilengkapi melalui modul pengelolaan profil Birdep.",
  },
  {
    code: "ADKESMAH",
    slug: "adkesmah",
    name: "Departemen Advokasi dan Kesejahteraan Mahasiswa",
    unitType: UnitType.DEPARTEMEN,
    description:
      "Departemen Advokasi dan Kesejahteraan Mahasiswa Ormawa Eksekutif PKU IPB.",
    focusArea: "Akan dilengkapi melalui modul pengelolaan profil Birdep.",
  },
  {
    code: "AKPRES",
    slug: "akpres",
    name: "Departemen Akademik dan Prestasi",
    unitType: UnitType.DEPARTEMEN,
    description: "Departemen Akademik dan Prestasi Ormawa Eksekutif PKU IPB.",
    focusArea: "Akan dilengkapi melalui modul pengelolaan profil Birdep.",
  },
  {
    code: "KASTRAT",
    slug: "kastrat",
    name: "Departemen Kajian dan Aksi Strategis",
    unitType: UnitType.DEPARTEMEN,
    description:
      "Departemen Kajian dan Aksi Strategis Ormawa Eksekutif PKU IPB.",
    focusArea: "Akan dilengkapi melalui modul pengelolaan profil Birdep.",
  },
  {
    code: "PERAGA",
    slug: "peraga",
    name: "Departemen Pemuda dan Olahraga",
    unitType: UnitType.DEPARTEMEN,
    description: "Departemen Pemuda dan Olahraga Ormawa Eksekutif PKU IPB.",
    focusArea: "Akan dilengkapi melalui modul pengelolaan profil Birdep.",
  },
  {
    code: "PSDM",
    slug: "psdm",
    name: "Departemen Pengembangan Sumber Daya Mahasiswa",
    unitType: UnitType.DEPARTEMEN,
    description:
      "Departemen Pengembangan Sumber Daya Mahasiswa Ormawa Eksekutif PKU IPB.",
    focusArea: "Akan dilengkapi melalui modul pengelolaan profil Birdep.",
  },
  {
    code: "SENBUD",
    slug: "senbud",
    name: "Departemen Seni dan Budaya",
    unitType: UnitType.DEPARTEMEN,
    description: "Departemen Seni dan Budaya Ormawa Eksekutif PKU IPB.",
    focusArea: "Akan dilengkapi melalui modul pengelolaan profil Birdep.",
  },
  {
    code: "SLH",
    slug: "slh",
    name: "Departemen Sosial dan Lingkungan Hidup",
    unitType: UnitType.DEPARTEMEN,
    description:
      "Departemen Sosial dan Lingkungan Hidup Ormawa Eksekutif PKU IPB.",
    focusArea: "Akan dilengkapi melalui modul pengelolaan profil Birdep.",
  },
  {
    code: "EKRAF",
    slug: "ekraf",
    name: "Departemen Ekonomi Kreatif",
    unitType: UnitType.DEPARTEMEN,
    description: "Departemen Ekonomi Kreatif Ormawa Eksekutif PKU IPB.",
    focusArea: "Akan dilengkapi melalui modul pengelolaan profil Birdep.",
  },
] as const;

async function main() {
  console.log("Memulai proses seed database...");

  const cabinetPeriod = await prisma.cabinetPeriod.upsert({
    where: {
      slug: "astana-angkasa-2025-2026",
    },
    update: {
      name: "Kabinet Astana Angkasa",
      startDate: new Date("2025-01-01"),
      endDate: new Date("2026-12-31"),
      isActive: true,
    },
    create: {
      name: "Kabinet Astana Angkasa",
      slug: "astana-angkasa-2025-2026",
      startDate: new Date("2025-01-01"),
      endDate: new Date("2026-12-31"),
      isActive: true,
    },
  });

  console.log(`Periode kabinet tersedia: ${cabinetPeriod.name}`);

  for (const birdep of birdeps) {
    await prisma.birdep.upsert({
      where: {
        cabinetPeriodId_code: {
          cabinetPeriodId: cabinetPeriod.id,
          code: birdep.code,
        },
      },
      update: {
        name: birdep.name,
        slug: birdep.slug,
        unitType: birdep.unitType,
        description: birdep.description,
        focusArea: birdep.focusArea,
        isActive: true,
      },
      create: {
        cabinetPeriodId: cabinetPeriod.id,
        code: birdep.code,
        slug: birdep.slug,
        name: birdep.name,
        unitType: birdep.unitType,
        description: birdep.description,
        focusArea: birdep.focusArea,
        isActive: true,
      },
    });
  }
  const superAdminMember = await prisma.member.upsert({
    where: {
      nim: "0000000000",
    },
    update: {
      fullName: "Super Admin Nexus",
      instagram: null,
      isActive: true,
    },
    create: {
      fullName: "Super Admin Nexus",
      nim: "0000000000",
      instagram: null,
      isActive: true,
    },
  });

  await prisma.user.upsert({
    where: {
      email: "superadmin@nexus.local",
    },
    update: {
      name: "Super Admin Nexus",
      emailVerified: true,
      image: null,
      role: "SUPER_ADMIN",
      mustChangePassword: true,
      memberId: superAdminMember.id,
      updatedAt: new Date(),
    },
    create: {
      id: crypto.randomUUID(),
      name: "Super Admin Nexus",
      email: "superadmin@nexus.local",
      emailVerified: true,
      image: null,
      role: "SUPER_ADMIN",
      mustChangePassword: true,
      memberId: superAdminMember.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  console.log("Akun Super Admin awal berhasil disiapkan.");

  console.log(`${birdeps.length} unit organisasi berhasil disiapkan.`);
  console.log("Seed database selesai.");
}

main()
  .catch((error: unknown) => {
    console.error("Seed database gagal:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
