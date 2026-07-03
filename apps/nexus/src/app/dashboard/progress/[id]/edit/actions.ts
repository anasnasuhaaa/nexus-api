"use server";

import { prisma, ProgressUpdateStatus } from "@orma/database";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

import { auth } from "@/lib/auth";
import { syncProgramProgress } from "@/lib/programs/sync-program-progress";

export type UpdateProgressResult = {
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

export async function updateProgressAction(
  progressId: string,
  formData: FormData,
): Promise<UpdateProgressResult> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return {
      success: false,
      message: "Session tidak valid. Silakan login ulang.",
    };
  }

  const existingProgress = await prisma.programProgressUpdate.findUnique({
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

  if (!existingProgress) {
    return {
      success: false,
      message: "Progress update tidak ditemukan.",
    };
  }

  if (existingProgress.program.status === "ARCHIVED") {
    return {
      success: false,
      message:
        "Progress dari program yang sudah diarsipkan tidak bisa diperbarui.",
    };
  }

  const title = normalizeText(formData.get("title"));
  const note = normalizeText(formData.get("note"));
  const obstacle = normalizeText(formData.get("obstacle"));
  const nextStep = normalizeText(formData.get("nextStep"));
  const progressPercentValue = normalizeText(formData.get("progressPercent"));
  const status =
    normalizeText(formData.get("status")).toUpperCase() || "ON_TRACK";
  const reportedAt = normalizeText(formData.get("reportedAt"));

  const progressPercent = Number(progressPercentValue);

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

  await prisma.programProgressUpdate.update({
    where: {
      id: progressId,
    },
    data: {
      title,
      note,
      obstacle: obstacle || null,
      nextStep: nextStep || null,
      progressPercent,
      status: status as ProgressUpdateStatus,
      reportedAt: parseDate(reportedAt),
      authorUserId: session.user.id,
    },
  });

  await syncProgramProgress(existingProgress.programId, session.user.id);

  revalidatePath("/dashboard/progress");
  revalidatePath(`/dashboard/progress/${progressId}`);
  revalidatePath("/dashboard/programs");
  revalidatePath(`/dashboard/programs/${existingProgress.programId}`);
  revalidatePath("/dashboard");

  return {
    success: true,
    message: "Progress update berhasil diperbarui.",
    progressId,
  };
}
