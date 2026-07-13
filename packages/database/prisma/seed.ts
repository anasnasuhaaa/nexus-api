import "dotenv/config";

import crypto from "node:crypto";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, UnitType } from "../src/generated/prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "DATABASE_URL belum dikonfigurasi. Pastikan environment variable DATABASE_URL tersedia.",
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

const roles = [
  {
    code: "SUPER_ADMIN",
    name: "Super Admin",
    description: "Akses penuh untuk seluruh sistem Nexus.",
  },
  {
    code: "BPH",
    name: "BPH",
    description: "Akses monitoring lintas Birdep dan approval internal.",
  },
  {
    code: "TEVO_ADMIN",
    name: "Tevo Admin",
    description: "Mengelola konten publik yang akan dikonsumsi website Tevo.",
  },
  {
    code: "KETUA_BIRDEP",
    name: "Ketua Birdep",
    description: "Mengelola data dan program kerja Birdep masing-masing.",
  },
  {
    code: "SEKRETARIS_BIRDEP",
    name: "Sekretaris Birdep",
    description: "Membantu pengelolaan administrasi Birdep masing-masing.",
  },
  {
    code: "BENDAHARA_BIRDEP",
    name: "Bendahara Birdep",
    description:
      "Membantu pengelolaan informasi keuangan/program Birdep masing-masing.",
  },
  {
    code: "ANGGOTA_BIRDEP",
    name: "Anggota Birdep",
    description: "Akses baca terbatas untuk anggota organisasi.",
  },
] as const;

const permissions = [
  {
    code: "dashboard.read",
    name: "Lihat Dashboard",
    module: "dashboard",
    description: "Melihat dashboard internal Nexus.",
  },
  {
    code: "member.read",
    name: "Lihat Anggota",
    module: "member",
    description: "Melihat data anggota organisasi.",
  },
  {
    code: "member.create",
    name: "Tambah Anggota",
    module: "member",
    description: "Menambahkan data anggota organisasi.",
  },
  {
    code: "member.update",
    name: "Ubah Anggota",
    module: "member",
    description: "Mengubah data anggota organisasi.",
  },
  {
    code: "member.delete",
    name: "Hapus Anggota",
    module: "member",
    description: "Menghapus atau menonaktifkan data anggota organisasi.",
  },
  {
    code: "birdep.read",
    name: "Lihat Birdep",
    module: "birdep",
    description: "Melihat data biro dan departemen.",
  },
  {
    code: "birdep.update",
    name: "Ubah Birdep",
    module: "birdep",
    description: "Mengubah profil biro atau departemen.",
  },
  {
    code: "program.read",
    name: "Lihat Program Kerja",
    module: "program",
    description: "Melihat data program kerja.",
  },
  {
    code: "program.create",
    name: "Tambah Program Kerja",
    module: "program",
    description: "Menambahkan program kerja.",
  },
  {
    code: "program.update",
    name: "Ubah Program Kerja",
    module: "program",
    description: "Mengubah program kerja.",
  },
  {
    code: "program.delete",
    name: "Hapus Program Kerja",
    module: "program",
    description: "Menghapus atau mengarsipkan program kerja.",
  },
  {
    code: "progress.read",
    name: "Lihat Progress",
    module: "progress",
    description: "Melihat progress program kerja.",
  },
  {
    code: "progress.create",
    name: "Tambah Progress",
    module: "progress",
    description: "Menambahkan laporan progress program kerja.",
  },
  {
    code: "progress.update",
    name: "Ubah Progress",
    module: "progress",
    description: "Mengubah laporan progress program kerja.",
  },
  {
    code: "media.read",
    name: "Lihat Media",
    module: "media",
    description: "Melihat aset media organisasi.",
  },
  {
    code: "media.create",
    name: "Tambah Media",
    module: "media",
    description: "Mengunggah aset media organisasi.",
  },
  {
    code: "media.delete",
    name: "Hapus Media",
    module: "media",
    description: "Menghapus aset media organisasi.",
  },
  {
    code: "tevo.content.read",
    name: "Lihat Konten Tevo",
    module: "tevo",
    description: "Melihat konten publik Tevo.",
  },
  {
    code: "tevo.content.create",
    name: "Tambah Konten Tevo",
    module: "tevo",
    description: "Menambahkan konten publik Tevo.",
  },
  {
    code: "tevo.content.update",
    name: "Ubah Konten Tevo",
    module: "tevo",
    description: "Mengubah konten publik Tevo.",
  },
  {
    code: "tevo.content.approve",
    name: "Approve Konten Tevo",
    module: "tevo",
    description: "Menyetujui konten publik Tevo sebelum publish.",
  },
  {
    code: "user.manage",
    name: "Kelola User",
    module: "user",
    description: "Mengelola akun pengguna Nexus.",
  },
  {
    code: "role.manage",
    name: "Kelola Role",
    module: "role",
    description: "Mengelola role dan permission pengguna.",
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

  const superAdminUser = await prisma.user.upsert({
    where: {
      email: "superadmin@nexus.local",
    },
    update: {
      name: "Super Admin Nexus",
      emailVerified: true,
      image: null,
      role: "SUPER_ADMIN",
      banned: false,
      banReason: null,
      banExpires: null,
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
      banned: false,
      banReason: null,
      banExpires: null,
      mustChangePassword: true,
      memberId: superAdminMember.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  console.log("User Super Admin berhasil dihubungkan ke role SUPER_ADMIN.");

  console.log("Akun Super Admin awal berhasil disiapkan.");

  console.log(`${birdeps.length} unit organisasi berhasil disiapkan.`);

  for (const role of roles) {
    await prisma.role.upsert({
      where: {
        code: role.code,
      },
      update: {
        name: role.name,
        description: role.description,
        isSystem: true,
      },
      create: {
        code: role.code,
        name: role.name,
        description: role.description,
        isSystem: true,
      },
    });
  }

  console.log(`${roles.length} role dasar berhasil disiapkan.`);

  for (const permission of permissions) {
    await prisma.permission.upsert({
      where: {
        code: permission.code,
      },
      update: {
        name: permission.name,
        module: permission.module,
        description: permission.description,
      },
      create: {
        code: permission.code,
        name: permission.name,
        module: permission.module,
        description: permission.description,
      },
    });
  }

  console.log(`${permissions.length} permission dasar berhasil disiapkan.`);

  const superAdminRole = await prisma.role.findUniqueOrThrow({
    where: {
      code: "SUPER_ADMIN",
    },
  });

  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: superAdminUser.id,
        roleId: superAdminRole.id,
      },
    },
    update: {},
    create: {
      userId: superAdminUser.id,
      roleId: superAdminRole.id,
    },
  });

  const allPermissions = await prisma.permission.findMany();

  for (const permission of allPermissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: superAdminRole.id,
          permissionId: permission.id,
        },
      },
      update: {},
      create: {
        roleId: superAdminRole.id,
        permissionId: permission.id,
      },
    });
  }

  console.log(
    `Role SUPER_ADMIN berhasil diberi ${allPermissions.length} permission.`,
  );
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
