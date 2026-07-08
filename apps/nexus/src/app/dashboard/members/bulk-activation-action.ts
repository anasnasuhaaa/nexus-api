"use server";

import { prisma } from "@orma/database";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";

const BULK_ACTIVATION_LIMIT = 80;

type BulkActivationResult = {
  success: boolean;
  message: string;
  sentCount?: number;
  failedCount?: number;
};

function getAppUrl() {
  return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
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
      message: "Hanya Super Admin yang dapat mengirim email aktivasi massal.",
      userId: null,
    };
  }

  return {
    success: true,
    message: "OK",
    userId: currentUser.id,
  };
}

export async function getBulkActivationStatsAction() {
  const guard = await ensureSuperAdmin();

  if (!guard.success) {
    return {
      eligibleCount: 0,
    };
  }

  const eligibleCount = await prisma.user.count({
    where: {
      mustChangePassword: true,
      banned: false,
      memberId: {
        not: null,
      },
    },
  });

  return {
    eligibleCount,
  };
}

export async function bulkSendActivationLinksAction(): Promise<BulkActivationResult> {
  const guard = await ensureSuperAdmin();

  if (!guard.success) {
    return {
      success: false,
      message: guard.message,
    };
  }

  const users = await prisma.user.findMany({
    where: {
      mustChangePassword: true,
      banned: false,
      memberId: {
        not: null,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: BULK_ACTIVATION_LIMIT,
    select: {
      id: true,
      name: true,
      email: true,
    },
  });

  if (!users.length) {
    return {
      success: false,
      message: "Tidak ada user yang perlu dikirim email aktivasi.",
    };
  }

  let sentCount = 0;
  let failedCount = 0;

  const requestHeaders = await headers();

  for (const user of users) {
    try {
      await auth.api.requestPasswordReset({
        body: {
          email: user.email,
          redirectTo: `${getAppUrl()}/reset-password`,
        },
        headers: requestHeaders,
      });

      sentCount += 1;
    } catch (error) {
      console.error(`Gagal mengirim email aktivasi ke ${user.email}:`, error);
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
