"use server";

import { prisma } from "@orma/database";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";

export type ArchiveProgramResult = {
  success: boolean;
  message: string;
};

export async function archiveProgramAction(
  programId: string,
): Promise<ArchiveProgramResult> {
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
      updatedByUserId: session.user.id,
    },
  });

  return {
    success: true,
    message: "Program kerja berhasil diarsipkan.",
  };
}