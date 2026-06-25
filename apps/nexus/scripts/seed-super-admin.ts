import "dotenv/config";

import path from "node:path";
import { fileURLToPath } from "node:url";

import { config } from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const nexusEnvPath = path.resolve(__dirname, "../.env.local");
const databaseEnvPath = path.resolve(__dirname, "../../../packages/database/.env");

config({
  path: nexusEnvPath,
  override: false,
});

config({
  path: databaseEnvPath,
  override: false,
});

process.env.ALLOW_AUTH_SEED_SIGNUP = "true";

const SUPER_ADMIN_EMAIL = "superadmin@nexus.local";
const SUPER_ADMIN_PASSWORD = "SuperAdmin12345!";

async function main() {
  const { auth } = await import("../src/lib/auth");
  const { prisma } = await import("@orma/database");

  console.log("Menyiapkan akun login Super Admin...");

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

  const existingUser = await prisma.user.findUnique({
    where: {
      email: SUPER_ADMIN_EMAIL,
    },
    include: {
      accounts: true,
    },
  });

  if (existingUser && existingUser.accounts.length === 0) {
    console.log("User lama tanpa password ditemukan. Menghapus user lama...");

    await prisma.user.delete({
      where: {
        id: existingUser.id,
      },
    });
  }

  if (!existingUser || existingUser.accounts.length === 0) {
    console.log("Membuat akun Super Admin melalui Better Auth...");

    await auth.api.signUpEmail({
      body: {
        name: "Super Admin Nexus",
        email: SUPER_ADMIN_EMAIL,
        password: SUPER_ADMIN_PASSWORD,
      },
    });
  } else {
    console.log(
      "Akun Super Admin sudah memiliki password. Melewati pembuatan password.",
    );
  }

  await prisma.user.update({
    where: {
      email: SUPER_ADMIN_EMAIL,
    },
    data: {
      name: "Super Admin Nexus",
      emailVerified: true,
      image: null,
      role: "SUPER_ADMIN",
      mustChangePassword: true,
      memberId: superAdminMember.id,
      updatedAt: new Date(),
    },
  });

  console.log("Akun login Super Admin siap digunakan.");
  console.log(`Email    : ${SUPER_ADMIN_EMAIL}`);
  console.log(`Password : ${SUPER_ADMIN_PASSWORD}`);
}

main()
  .catch((error: unknown) => {
    console.error("Gagal menyiapkan akun login Super Admin:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    const { prisma } = await import("@orma/database");
    await prisma.$disconnect();
  });