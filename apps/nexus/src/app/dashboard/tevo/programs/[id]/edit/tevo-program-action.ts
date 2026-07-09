"use server";

import { prisma } from "@orma/database";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";

export type UpdateTevoProgramInput = {
  programId: string;
  publicTitle: string;
  publicSlug: string;
  publicSummary: string;
  publicDescription: string;
  publicCoverUrl: string;
  isPublishedToTevo: boolean;
};

export type UpdateTevoProgramResult = {
  success: boolean;
  message: string;
};

function normalizeOptionalText(value: string) {
  const trimmed = value.trim();

  return trimmed ? trimmed : null;
}

function normalizeSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function isValidRole(role: string | null | undefined) {
  return role === "SUPER_ADMIN" || role === "TEVO_ADMIN";
}

async function ensureTevoManager() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return {
      success: false,
      message: "Session tidak valid. Silakan login ulang.",
    };
  }

  const currentUser = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      role: true,
    },
  });

  if (!currentUser || !isValidRole(currentUser.role)) {
    return {
      success: false,
      message:
        "Hanya Super Admin atau Tevo Admin yang dapat mengelola konten Tevo.",
    };
  }

  return {
    success: true,
    message: "OK",
  };
}

export async function updateTevoProgramAction(
  input: UpdateTevoProgramInput,
): Promise<UpdateTevoProgramResult> {
  const guard = await ensureTevoManager();

  if (!guard.success) {
    return guard;
  }

  const publicTitle = input.publicTitle.trim();
  const publicSlug = normalizeSlug(input.publicSlug);
  const publicSummary = normalizeOptionalText(input.publicSummary);
  const publicDescription = normalizeOptionalText(input.publicDescription);
  const publicCoverUrl = normalizeOptionalText(input.publicCoverUrl);

  const program = await prisma.program.findUnique({
    where: {
      id: input.programId,
    },
    select: {
      id: true,
      isPublishedToTevo: true,
    },
  });

  if (!program) {
    return {
      success: false,
      message: "Program kerja tidak ditemukan.",
    };
  }

  if (input.isPublishedToTevo) {
    if (!publicTitle || !publicSlug || !publicSummary || !publicDescription) {
      return {
        success: false,
        message:
          "Judul, slug, ringkasan, dan deskripsi publik wajib diisi sebelum publish.",
      };
    }
  }

  if (publicSlug) {
    const duplicateSlug = await prisma.program.findFirst({
      where: {
        publicSlug,
        NOT: {
          id: input.programId,
        },
      },
      select: {
        id: true,
      },
    });

    if (duplicateSlug) {
      return {
        success: false,
        message: "Slug publik sudah digunakan program lain.",
      };
    }
  }

  const now = new Date();

  await prisma.program.update({
    where: {
      id: input.programId,
    },
    data: {
      publicTitle: publicTitle || null,
      publicSlug: publicSlug || null,
      publicSummary,
      publicDescription,
      publicCoverUrl,
      isPublishedToTevo: input.isPublishedToTevo,
      publishedToTevoAt:
        input.isPublishedToTevo && !program.isPublishedToTevo ? now : undefined,
      archivedFromTevoAt: input.isPublishedToTevo ? null : now,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/tevo");
  revalidatePath("/dashboard/tevo/programs");
  revalidatePath(`/dashboard/tevo/programs/${input.programId}/edit`);

  return {
    success: true,
    message: input.isPublishedToTevo
      ? "Program berhasil dipublish ke Tevo."
      : "Program berhasil disimpan sebagai draft / tidak tampil di Tevo.",
  };
}