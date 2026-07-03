"use server";

import { prisma } from "@orma/database";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";

export type MemberLifecycleResult = {
  success: boolean;
  message: string;
};

export async function updateMemberActiveStatusAction(
  memberId: string,
  isActive: boolean,
): Promise<MemberLifecycleResult> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return {
      success: false,
      message: "Session tidak valid. Silakan login ulang.",
    };
  }

  const member = await prisma.member.findUnique({
    where: {
      id: memberId,
    },
    select: {
      id: true,
      isActive: true,
    },
  });

  if (!member) {
    return {
      success: false,
      message: "Data anggota tidak ditemukan.",
    };
  }

  if (member.isActive === isActive) {
    return {
      success: false,
      message: isActive
        ? "Anggota ini sudah aktif."
        : "Anggota ini sudah nonaktif.",
    };
  }

  await prisma.member.update({
    where: {
      id: memberId,
    },
    data: {
      isActive,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/members");
  revalidatePath(`/dashboard/members/${memberId}`);

  return {
    success: true,
    message: isActive
      ? "Anggota berhasil diaktifkan kembali."
      : "Anggota berhasil dinonaktifkan.",
  };
}