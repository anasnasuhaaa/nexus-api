"use server";

import { prisma } from "@orma/database";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";

const SELECTED_ACTIVATION_LIMIT = 80;

export type SelectedActivationResult = {
  success: boolean;
  message: string;
  sentCount?: number;
  failedCount?: number;
};

function getAppUrl() {
  return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "Terjadi kesalahan tidak diketahui.";
}

async function ensureSuperAdmin() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return {
      success: false,
      message: "Session tidak valid. Silakan login ulang.",
      userId: null,
    };
  }

  const currentUser = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      id: true,
      role: true,
    },
  });

  if (!currentUser || currentUser.role !== "SUPER_ADMIN") {
    return {
      success: false,
      message: "Hanya Super Admin yang dapat mengirim email aktivasi.",
      userId: null,
    };
  }

  return {
    success: true,
    message: "OK",
    userId: currentUser.id,
  };
}

export async function sendSelectedActivationLinksAction(
  userIds: string[],
): Promise<SelectedActivationResult> {
  const guard = await ensureSuperAdmin();

  if (!guard.success || !guard.userId) {
    return {
      success: false,
      message: guard.message,
    };
  }

  const uniqueUserIds = Array.from(new Set(userIds)).slice(
    0,
    SELECTED_ACTIVATION_LIMIT,
  );

  if (!uniqueUserIds.length) {
    return {
      success: false,
      message: "Pilih minimal satu user untuk dikirim email aktivasi.",
    };
  }

  const users = await prisma.user.findMany({
    where: {
      id: {
        in: uniqueUserIds,
      },
      mustChangePassword: true,
      banned: false,
      memberId: {
        not: null,
      },
    },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });

  if (!users.length) {
    return {
      success: false,
      message:
        "Tidak ada user terpilih yang memenuhi syarat untuk dikirim email aktivasi.",
    };
  }

  const requestHeaders = await headers();

  let sentCount = 0;
  let failedCount = 0;

  for (const user of users) {
    try {
      await auth.api.requestPasswordReset({
        body: {
          email: user.email,
          redirectTo: `${getAppUrl()}/reset-password`,
        },
        headers: requestHeaders,
      });

      await prisma.userActivationEmailLog.create({
        data: {
          targetUserId: user.id,
          senderUserId: guard.userId,
          targetEmail: user.email,
          targetName: user.name,
          status: "SUCCESS",
        },
      });

      sentCount += 1;
    } catch (error) {
      const errorMessage = getErrorMessage(error);

      await prisma.userActivationEmailLog.create({
        data: {
          targetUserId: user.id,
          senderUserId: guard.userId,
          targetEmail: user.email,
          targetName: user.name,
          status: "FAILED",
          errorMessage,
        },
      });

      console.error(`Gagal mengirim aktivasi ke ${user.email}:`, error);
      failedCount += 1;
    }
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/members");

  return {
    success: sentCount > 0,
    message:
      failedCount > 0
        ? `${sentCount} email berhasil dikirim, ${failedCount} email gagal.`
        : `${sentCount} email aktivasi berhasil dikirim.`,
    sentCount,
    failedCount,
  };
}