"use server";

import { prisma } from "@orma/database";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";

export type SendResetPasswordLinkResult = {
  success: boolean;
  message: string;
};

function getAppUrl() {
  return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
}

export async function sendMemberResetPasswordLinkAction(
  memberId: string,
  userId: string,
): Promise<SendResetPasswordLinkResult> {
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
      message: "Hanya Super Admin yang dapat mengirim link reset password.",
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
      name: true,
    },
  });

  if (!targetUser) {
    return {
      success: false,
      message:
        "Akun user tidak ditemukan atau tidak terhubung dengan anggota ini.",
    };
  }

  await auth.api.requestPasswordReset({
    body: {
      email: targetUser.email,
      redirectTo: `${getAppUrl()}/reset-password`,
    },
    headers: await headers(),
  });

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
    message: `Link aktivasi/reset password berhasil dikirim ke ${targetUser.email}.`,
  };
}