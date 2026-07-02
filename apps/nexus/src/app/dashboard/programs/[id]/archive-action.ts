"use server";

import { prisma } from "@orma/database";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";

export type ProgramLifecycleResult = {
  success: boolean;
  message: string;
};

async function getCurrentUserId() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return session?.user.id ?? null;
}

export async function archiveProgramAction(
  programId: string,
): Promise<ProgramLifecycleResult> {
  const userId = await getCurrentUserId();

  if (!userId) {
    return {
      success: false,
      message: "Session tidak valid. Silakan login ulang.",
    };
  }

  const program = await prisma.program.findUnique({
    where: {
      id: programId,
    },
    select: {
      id: true,
      status: true,
    },
  });

  if (!program) {
    return {
      success: false,
      message: "Program kerja tidak ditemukan.",
    };
  }

  if (program.status === "ARCHIVED") {
    return {
      success: false,
      message: "Program kerja ini sudah diarsipkan.",
    };
  }

  await prisma.program.update({
    where: {
      id: programId,
    },
    data: {
      status: "ARCHIVED",
      isPublishedToTevo: false,
      updatedByUserId: userId,
    },
  });

  return {
    success: true,
    message: "Program kerja berhasil diarsipkan.",
  };
}

export async function unarchiveProgramAction(
  programId: string,
): Promise<ProgramLifecycleResult> {
  const userId = await getCurrentUserId();

  if (!userId) {
    return {
      success: false,
      message: "Session tidak valid. Silakan login ulang.",
    };
  }

  const program = await prisma.program.findUnique({
    where: {
      id: programId,
    },
    select: {
      id: true,
      status: true,
    },
  });

  if (!program) {
    return {
      success: false,
      message: "Program kerja tidak ditemukan.",
    };
  }

  if (program.status !== "ARCHIVED") {
    return {
      success: false,
      message: "Hanya program berstatus ARCHIVED yang bisa di-unarchive.",
    };
  }

  await prisma.program.update({
    where: {
      id: programId,
    },
    data: {
      status: "PLANNED",
      isPublishedToTevo: false,
      updatedByUserId: userId,
    },
  });

  return {
    success: true,
    message: "Program kerja berhasil dikembalikan ke status Direncanakan.",
  };
}

export async function deleteProgramPermanentlyAction(
  programId: string,
  confirmationText: string,
): Promise<ProgramLifecycleResult> {
  const userId = await getCurrentUserId();

  if (!userId) {
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

  const program = await prisma.program.findUnique({
    where: {
      id: programId,
    },
    select: {
      id: true,
      status: true,
    },
  });

  if (!program) {
    return {
      success: false,
      message: "Program kerja tidak ditemukan.",
    };
  }

  if (program.status !== "ARCHIVED") {
    return {
      success: false,
      message:
        "Program harus diarsipkan terlebih dahulu sebelum dihapus permanen.",
    };
  }

  await prisma.program.delete({
    where: {
      id: programId,
    },
  });

  return {
    success: true,
    message: "Program kerja berhasil dihapus permanen.",
  };
}