"use server";

import { prisma } from "@orma/database";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";

export type ResetPasswordResult = {
  success: boolean;
  message: string;
};

export async function resetMemberUserPasswordAction(
  memberId: string,
  userId: string,
  newPassword: string,
  confirmPassword: string,
): Promise<ResetPasswordResult> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return {
      success: false,
      message: "Session tidak valid. Silakan login ulang.",
    };
  }

  const currentUser = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      role: true,
    },
  });

  if (!currentUser || currentUser.role !== "SUPER_ADMIN") {
    return {
      success: false,
      message: "Hanya Super Admin yang dapat mereset password user.",
    };
  }

  const targetUser = await prisma.user.findFirst({
    where: {
      id: userId,
      memberId,
    },
    select: {
      id: true,
      email: true,
    },
  });

  if (!targetUser) {
    return {
      success: false,
      message:
        "Akun user tidak ditemukan atau tidak terhubung dengan anggota ini.",
    };
  }

  if (!newPassword || !confirmPassword) {
    return {
      success: false,
      message: "Password baru dan konfirmasi password wajib diisi.",
    };
  }

  if (newPassword.length < 8) {
    return {
      success: false,
      message: "Password baru minimal 8 karakter.",
    };
  }

  if (newPassword !== confirmPassword) {
    return {
      success: false,
      message: "Konfirmasi password tidak sama.",
    };
  }

  const authContext = await auth.$context;
  const hashedPassword = await authContext.password.hash(newPassword);

  const existingCredentialAccount = await prisma.account.findFirst({
    where: {
      userId: targetUser.id,
      providerId: "credential",
    },
    select: {
      id: true,
    },
  });

  if (existingCredentialAccount) {
    await prisma.account.update({
      where: {
        id: existingCredentialAccount.id,
      },
      data: {
        password: hashedPassword,
        updatedAt: new Date(),
      },
    });
  } else {
    await prisma.account.create({
      data: {
        id: crypto.randomUUID(),
        userId: targetUser.id,
        accountId: targetUser.email,
        providerId: "credential",
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }

  await prisma.user.update({
    where: {
      id: targetUser.id,
    },
    data: {
      mustChangePassword: true,
      updatedAt: new Date(),
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/members");
  revalidatePath(`/dashboard/members/${memberId}`);

  return {
    success: true,
    message:
      "Password user berhasil direset. User wajib mengganti password saat login berikutnya.",
  };
}