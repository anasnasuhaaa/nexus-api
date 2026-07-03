"use server";

import { prisma, ProgressUpdateStatus, ProgramStatus } from "@orma/database";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

import { auth } from "@/lib/auth";

export type CreateProgressResult = {
  success: boolean;
  message: string;
  progressId?: string;
};

const VALID_PROGRESS_STATUSES = new Set([
  "ON_TRACK",
  "AT_RISK",
  "BLOCKED",
  "DONE",
]);

function normalizeText(value: FormDataEntryValue | null) {
  return String(value ?? "").trim();
}

function parseDate(value: string) {
  return new Date(`${value}T00:00:00.000Z`);
}

function isValidDateString(value: string) {
  if (!value) {
    return false;
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const date = parseDate(value);

  return !Number.isNaN(date.getTime());
}

function getProgramStatusFromProgress(status: string): ProgramStatus | null {
  if (status === "DONE") {
    return "COMPLETED";
  }

  return null;
}

export async function createProgressAction(
  formData: FormData,
): Promise<CreateProgressResult> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return {
      success: false,
      message: "Session tidak valid. Silakan login ulang.",
    };
  }

  const programId = normalizeText(formData.get("programId"));
  const title = normalizeText(formData.get("title"));
  const note = normalizeText(formData.get("note"));
  const obstacle = normalizeText(formData.get("obstacle"));
  const nextStep = normalizeText(formData.get("nextStep"));
  const progressPercentValue = normalizeText(formData.get("progressPercent"));
  const status =
    normalizeText(formData.get("status")).toUpperCase() || "ON_TRACK";
  const reportedAt = normalizeText(formData.get("reportedAt"));

  const progressPercent = Number(progressPercentValue);

  if (!programId) {
    return {
      success: false,
      message: "Program kerja wajib dipilih.",
    };
  }

  if (!title) {
    return {
      success: false,
      message: "Judul progress wajib diisi.",
    };
  }

  if (!note) {
    return {
      success: false,
      message: "Catatan progress wajib diisi.",
    };
  }

  if (
    !Number.isFinite(progressPercent) ||
    progressPercent < 0 ||
    progressPercent > 100
  ) {
    return {
      success: false,
      message: "Progress harus berupa angka 0 sampai 100.",
    };
  }

  if (!VALID_PROGRESS_STATUSES.has(status)) {
    return {
      success: false,
      message: "Status progress tidak valid.",
    };
  }

  if (!isValidDateString(reportedAt)) {
    return {
      success: false,
      message: "Tanggal laporan wajib diisi dengan format yang valid.",
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
      message:
        "Program kerja yang sudah diarsipkan tidak bisa ditambahkan progress baru.",
    };
  }

  const progress = await prisma.programProgressUpdate.create({
    data: {
      programId,
      authorUserId: session.user.id,
      title,
      note,
      obstacle: obstacle || null,
      nextStep: nextStep || null,
      progressPercent,
      status: status as ProgressUpdateStatus,
      reportedAt: parseDate(reportedAt),
    },
    select: {
      id: true,
    },
  });

  const nextProgramStatus = getProgramStatusFromProgress(status);

  await prisma.program.update({
    where: {
      id: programId,
    },
    data: {
      progressPercent,
      ...(nextProgramStatus
        ? {
            status: nextProgramStatus,
          }
        : {}),
      updatedByUserId: session.user.id,
    },
  });

  revalidatePath("/dashboard/progress");
  revalidatePath("/dashboard/programs");
  revalidatePath(`/dashboard/programs/${programId}`);
  revalidatePath("/dashboard");

  return {
    success: true,
    message: "Progress update berhasil ditambahkan.",
    progressId: progress.id,
  };
}
