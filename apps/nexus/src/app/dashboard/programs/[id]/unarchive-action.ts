"use server";

import { prisma } from "@orma/database";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export type UnarchiveProgramResult = {
  success: boolean;
  message: string;
};

export async function unarchiveProgramAction(
  programId: string,
): Promise<UnarchiveProgramResult> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return {
      success: false,
      message: "Session tidak valid. Silakan login ulang.",
    };
  }

  const program = await prisma.program.findUnique({
    where: { id: programId },
    select: { id: true, status: true },
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
      message: "Program kerja ini tidak dalam status diarsipkan.",
    };
  }

  await prisma.program.update({
    where: { id: programId },
    data: {
      status: "PLANNED", // Mengembalikan status ke default
      updatedByUserId: session.user.id,
    },
  });

  return {
    success: true,
    message: "Program kerja berhasil dipulihkan (Unarchive).",
  };
}