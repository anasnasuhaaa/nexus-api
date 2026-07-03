"use server";

import { prisma, ProgramStatus } from "@orma/database";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

import { auth } from "@/lib/auth";

export type UpdateProgramResult = {
  success: boolean;
  message: string;
  programId?: string;
};

const VALID_PROGRAM_STATUSES = new Set([
  "PLANNED",
  "ONGOING",
  "COMPLETED",
  "CANCELLED",
  "ARCHIVED",
]);

function normalizeText(value: FormDataEntryValue | null) {
  return String(value ?? "").trim();
}

function createSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function parseBoolean(value: FormDataEntryValue | null) {
  return String(value ?? "").toLowerCase() === "on";
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

function isValidOptionalUrl(value: string) {
  if (!value) {
    return true;
  }

  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export async function updateProgramAction(
  programId: string,
  formData: FormData,
): Promise<UpdateProgramResult> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return {
      success: false,
      message: "Session tidak valid. Silakan login ulang.",
    };
  }

  const existingProgram = await prisma.program.findUnique({
    where: {
      id: programId,
    },
    select: {
      id: true,
    },
  });

  if (!existingProgram) {
    return {
      success: false,
      message: "Program kerja tidak ditemukan.",
    };
  }

  const title = normalizeText(formData.get("title"));
  const rawSlug = normalizeText(formData.get("slug"));
  const birdepId = normalizeText(formData.get("birdepId"));
  const description = normalizeText(formData.get("description"));
  const objective = normalizeText(formData.get("objective"));
  const startDate = normalizeText(formData.get("startDate"));
  const endDate = normalizeText(formData.get("endDate"));
  const status =
    normalizeText(formData.get("status")).toUpperCase() || "PLANNED";
  const progressPercentValue = normalizeText(formData.get("progressPercent"));
  const pressReleaseUrl = normalizeText(formData.get("pressReleaseUrl"));
  const isPublishedToTevo = parseBoolean(formData.get("isPublishedToTevo"));

  const slug = rawSlug ? createSlug(rawSlug) : createSlug(title);
  const progressPercent = Number(progressPercentValue || 0);

  if (!title) {
    return {
      success: false,
      message: "Nama program kerja wajib diisi.",
    };
  }

  if (!slug) {
    return {
      success: false,
      message: "Slug wajib diisi atau title harus bisa dijadikan slug.",
    };
  }

  if (!birdepId) {
    return {
      success: false,
      message: "Birdep wajib dipilih.",
    };
  }

  if (!description) {
    return {
      success: false,
      message: "Deskripsi program kerja wajib diisi.",
    };
  }

  if (!VALID_PROGRAM_STATUSES.has(status)) {
    return {
      success: false,
      message: "Status program tidak valid.",
    };
  }

  if (!isValidDateString(startDate)) {
    return {
      success: false,
      message: "Tanggal mulai wajib diisi dengan format yang valid.",
    };
  }

  if (endDate && !isValidDateString(endDate)) {
    return {
      success: false,
      message: "Tanggal selesai harus menggunakan format yang valid.",
    };
  }

  if (startDate && endDate && parseDate(endDate) < parseDate(startDate)) {
    return {
      success: false,
      message: "Tanggal selesai tidak boleh lebih awal dari tanggal mulai.",
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

  if (!isValidOptionalUrl(pressReleaseUrl)) {
    return {
      success: false,
      message: "Press release URL harus berupa link http/https yang valid.",
    };
  }

  const birdep = await prisma.birdep.findUnique({
    where: {
      id: birdepId,
    },
    select: {
      id: true,
    },
  });

  if (!birdep) {
    return {
      success: false,
      message: "Birdep tidak ditemukan.",
    };
  }

  const duplicateProgram = await prisma.program.findFirst({
    where: {
      id: {
        not: programId,
      },
      birdepId,
      slug,
    },
    select: {
      id: true,
    },
  });

  if (duplicateProgram) {
    return {
      success: false,
      message: "Slug program sudah digunakan oleh Birdep tersebut.",
    };
  }

  await prisma.program.update({
    where: {
      id: programId,
    },
    data: {
      birdepId,
      title,
      slug,
      description,
      objective: objective || null,
      startDate: parseDate(startDate),
      endDate: endDate ? parseDate(endDate) : null,
      status: status as ProgramStatus,
      progressPercent,
      pressReleaseUrl: pressReleaseUrl || null,
      isPublishedToTevo,
      updatedByUserId: session.user.id,
    },
  });

  revalidatePath("/dashboard/programs");
  revalidatePath(`/dashboard/programs/${programId}`);
  revalidatePath("/dashboard");

  return {
    success: true,
    message: "Program kerja berhasil diperbarui.",
    programId,
  };
}
