"use server";

import { prisma } from "@orma/database";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

import { auth } from "@/lib/auth";
import { syncProgramProgress } from "@/lib/programs/sync-program-progress";

export type DeleteProgressResult = {
  success: boolean;
  message: string;
};

export async function deleteProgressAction(
  progressId: string,
  confirmationText: string,
): Promise<DeleteProgressResult> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return {
      success: false,
      message: "Session tidak valid. Silakan login ulang.",
    };
  }

  if (confirmationText !== "HAPUS") {
    return {
      success: false,
      message: "Konfirmasi tidak sesuai. Ketik HAPUS untuk melanjutkan.",
    };
  }

  const progress = await prisma.programProgressUpdate.findUnique({
    where: {
      id: progressId,
    },
    select: {
      id: true,
      programId: true,
      program: {
        select: {
          status: true,
        },
      },
    },
  });

  if (!progress) {
    return {
      success: false,
      message: "Progress update tidak ditemukan.",
    };
  }

  if (progress.program.status === "ARCHIVED") {
    return {
      success: false,
      message:
        "Progress dari program yang sudah diarsipkan tidak bisa dihapus.",
    };
  }

  await prisma.programProgressUpdate.delete({
    where: {
      id: progressId,
    },
  });

  await syncProgramProgress(progress.programId, session.user.id);

  revalidatePath("/dashboard/progress");
  revalidatePath("/dashboard/programs");
  revalidatePath(`/dashboard/programs/${progress.programId}`);
  revalidatePath("/dashboard");

  return {
    success: true,
    message: "Progress update berhasil dihapus.",
  };
}
