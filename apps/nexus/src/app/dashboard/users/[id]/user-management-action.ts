"use server";

import { prisma } from "@orma/database";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";

export type UserActionResult = {
  success: boolean;
  message: string;
};

export type UpdateUserRoleInput = {
  userId: string;
  role: string;
};

export type UpdateUserMemberInput = {
  userId: string;
  memberId: string;
};

export type BanUserInput = {
  userId: string;
  banReason: string;
  banExpires: string;
};

const ROLE_OPTIONS = [
  "SUPER_ADMIN",
  "TEVO_ADMIN",
  "BPH",
  "KSATRIA",
  "LAKSANA",
  "ANGGOTA_BIRDEP",
];

function getAppUrl() {
  return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
}

function isValidRole(role: string) {
  return ROLE_OPTIONS.includes(role);
}

function normalizeOptionalText(value: string) {
  const trimmed = value.trim();

  return trimmed ? trimmed : null;
}

async function ensureSuperAdmin() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return {
      success: false,
      message: "Session tidak valid. Silakan login ulang.",
      user: null,
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
      message: "Hanya Super Admin yang dapat mengelola user.",
      user: null,
    };
  }

  return {
    success: true,
    message: "OK",
    user: currentUser,
  };
}

function revalidateUserManagement(userId: string) {
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/users");
  revalidatePath(`/dashboard/users/${userId}`);
}

export async function updateUserRoleAction(
  input: UpdateUserRoleInput,
): Promise<UserActionResult> {
  const guard = await ensureSuperAdmin();

  if (!guard.success || !guard.user) {
    return {
      success: false,
      message: guard.message,
    };
  }

  if (!isValidRole(input.role)) {
    return {
      success: false,
      message: "Role user tidak valid.",
    };
  }

  const targetUser = await prisma.user.findUnique({
    where: {
      id: input.userId,
    },
    select: {
      id: true,
      role: true,
    },
  });

  if (!targetUser) {
    return {
      success: false,
      message: "User tidak ditemukan.",
    };
  }

  if (guard.user.id === input.userId && input.role !== "SUPER_ADMIN") {
    return {
      success: false,
      message:
        "Kamu tidak bisa menurunkan role akun Super Admin yang sedang digunakan.",
    };
  }

  await prisma.user.update({
    where: {
      id: input.userId,
    },
    data: {
      role: input.role,
      updatedAt: new Date(),
    },
  });

  revalidateUserManagement(input.userId);

  return {
    success: true,
    message: "Role user berhasil diperbarui.",
  };
}

export async function updateUserMemberAction(
  input: UpdateUserMemberInput,
): Promise<UserActionResult> {
  const guard = await ensureSuperAdmin();

  if (!guard.success) {
    return {
      success: false,
      message: guard.message,
    };
  }

  const memberId = normalizeOptionalText(input.memberId);

  const targetUser = await prisma.user.findUnique({
    where: {
      id: input.userId,
    },
    select: {
      id: true,
    },
  });

  if (!targetUser) {
    return {
      success: false,
      message: "User tidak ditemukan.",
    };
  }

  if (memberId) {
    const member = await prisma.member.findUnique({
      where: {
        id: memberId,
      },
      select: {
        id: true,
      },
    });

    if (!member) {
      return {
        success: false,
        message: "Member tidak ditemukan.",
      };
    }
  }

  await prisma.user.update({
    where: {
      id: input.userId,
    },
    data: {
      memberId,
      updatedAt: new Date(),
    },
  });

  revalidateUserManagement(input.userId);

  return {
    success: true,
    message: memberId
      ? "User berhasil dihubungkan ke member."
      : "Link user ke member berhasil dihapus.",
  };
}

export async function banUserAction(
  input: BanUserInput,
): Promise<UserActionResult> {
  const guard = await ensureSuperAdmin();

  if (!guard.success || !guard.user) {
    return {
      success: false,
      message: guard.message,
    };
  }

  if (guard.user.id === input.userId) {
    return {
      success: false,
      message: "Kamu tidak bisa melakukan ban pada akun yang sedang digunakan.",
    };
  }

  const targetUser = await prisma.user.findUnique({
    where: {
      id: input.userId,
    },
    select: {
      id: true,
    },
  });

  if (!targetUser) {
    return {
      success: false,
      message: "User tidak ditemukan.",
    };
  }

  const banReason = normalizeOptionalText(input.banReason);

  const banExpires = input.banExpires
    ? new Date(`${input.banExpires}T23:59:59.999Z`)
    : null;

  await prisma.user.update({
    where: {
      id: input.userId,
    },
    data: {
      banned: true,
      banReason,
      banExpires,
      updatedAt: new Date(),
    },
  });

  revalidateUserManagement(input.userId);

  return {
    success: true,
    message: "User berhasil diban.",
  };
}

export async function unbanUserAction(
  userId: string,
): Promise<UserActionResult> {
  const guard = await ensureSuperAdmin();

  if (!guard.success) {
    return {
      success: false,
      message: guard.message,
    };
  }

  const targetUser = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
    },
  });

  if (!targetUser) {
    return {
      success: false,
      message: "User tidak ditemukan.",
    };
  }

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      banned: false,
      banReason: null,
      banExpires: null,
      updatedAt: new Date(),
    },
  });

  revalidateUserManagement(userId);

  return {
    success: true,
    message: "Ban user berhasil dicabut.",
  };
}

export async function sendUserActivationLinkAction(
  userId: string,
): Promise<UserActionResult> {
  const guard = await ensureSuperAdmin();

  if (!guard.success) {
    return {
      success: false,
      message: guard.message,
    };
  }

  const targetUser = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      email: true,
      banned: true,
    },
  });

  if (!targetUser) {
    return {
      success: false,
      message: "User tidak ditemukan.",
    };
  }

  if (targetUser.banned) {
    return {
      success: false,
      message: "User sedang diban. Cabut ban terlebih dahulu sebelum mengirim link aktivasi.",
    };
  }

  try {
    await auth.api.requestPasswordReset({
      body: {
        email: targetUser.email,
        redirectTo: `${getAppUrl()}/reset-password`,
      },
    });

    revalidateUserManagement(userId);

    return {
      success: true,
      message: "Link aktivasi/reset password berhasil dikirim ke email user.",
    };
  } catch (error) {
    console.error("Gagal mengirim link aktivasi user:", error);

    return {
      success: false,
      message: "Gagal mengirim link aktivasi/reset password.",
    };
  }
}