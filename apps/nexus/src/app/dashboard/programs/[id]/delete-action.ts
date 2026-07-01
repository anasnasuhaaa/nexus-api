"use server";

import { prisma } from "@orma/database";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export type DeleteProgramResult = {
  success: boolean;
  message: string;
};

export async function deleteProgramAction(
  programId: string,
): Promise<DeleteProgramResult> {
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
    select: { id: true },
  });

  if (!program) {
    return {
      success: false,
      message: "Program kerja tidak ditemukan.",
    };
  }

  // Menghapus program secara permanen
  // Relasi (seperti ProgressUpdates) otomatis terhapus jika Prisma Schema menggunakan onDelete: Cascade
  await prisma.program.delete({
    where: { id: programId },
  });

  return {
    success: true,
    message: "Program kerja berhasil dihapus permanen.",
  };
}