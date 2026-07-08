"use server";

import { prisma } from "@orma/database";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";

export type ChangeOwnPasswordResult = {
  success: boolean;
  message: string;
};

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "Password gagal diperbarui.";
}

export async function changeOwnPasswordAction(
  currentPassword: string,
  newPassword: string,
  confirmPassword: string,
): Promise<ChangeOwnPasswordResult> {
  const requestHeaders = await headers();

  const session = await auth.api.getSession({
    headers: requestHeaders,
  });

  if (!session) {
    return {
      success: false,
      message: "Session tidak valid. Silakan login ulang.",
    };
  }

  if (!currentPassword || !newPassword || !confirmPassword) {
    return {
      success: false,
      message: "Password lama, password baru, dan konfirmasi wajib diisi.",
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
      message: "Konfirmasi password baru tidak sama.",
    };
  }

  if (currentPassword === newPassword) {
    return {
      success: false,
      message: "Password baru tidak boleh sama dengan password lama.",
    };
  }

  try {
    await auth.api.changePassword({
      body: {
        currentPassword,
        newPassword,
        revokeOtherSessions: true,
      },
      headers: requestHeaders,
    });

    await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        mustChangePassword: false,
        updatedAt: new Date(),
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/profile");
    revalidatePath("/dashboard/profile/change-password");

    return {
      success: true,
      message: "Password berhasil diperbarui.",
    };
  } catch (error) {
    return {
      success: false,
      message: getErrorMessage(error),
    };
  }
}