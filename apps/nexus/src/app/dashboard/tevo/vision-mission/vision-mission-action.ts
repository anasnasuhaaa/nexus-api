"use server";

import { prisma } from "@orma/database";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";

export type UpdateVisionMissionInput = {
  profileId: string | null;
  siteName: string;
  tagline: string;
  organizationSummary: string;
  vision: string;
  mission: string;
  heroTitle: string;
  heroSubtitle: string;
};

export type UpdateVisionMissionResult = {
  success: boolean;
  message: string;
};

function normalizeOptionalText(value: string) {
  const trimmed = value.trim();

  return trimmed ? trimmed : null;
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

export async function updateVisionMissionAction(
  input: UpdateVisionMissionInput,
): Promise<UpdateVisionMissionResult> {
  const guard = await ensureTevoManager();

  if (!guard.success) {
    return guard;
  }

  const siteName = input.siteName.trim();

  if (!siteName) {
    return {
      success: false,
      message: "Nama website wajib diisi.",
    };
  }

  if (input.profileId) {
    await prisma.tevoSiteProfile.update({
      where: {
        id: input.profileId,
      },
      data: {
        siteName,
        tagline: normalizeOptionalText(input.tagline),
        organizationSummary: normalizeOptionalText(input.organizationSummary),
        vision: normalizeOptionalText(input.vision),
        mission: normalizeOptionalText(input.mission),
        heroTitle: normalizeOptionalText(input.heroTitle),
        heroSubtitle: normalizeOptionalText(input.heroSubtitle),
        isActive: true,
      },
    });
  } else {
    await prisma.tevoSiteProfile.create({
      data: {
        siteName,
        tagline: normalizeOptionalText(input.tagline),
        organizationSummary: normalizeOptionalText(input.organizationSummary),
        vision: normalizeOptionalText(input.vision),
        mission: normalizeOptionalText(input.mission),
        heroTitle: normalizeOptionalText(input.heroTitle),
        heroSubtitle: normalizeOptionalText(input.heroSubtitle),
        isActive: true,
      },
    });
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/tevo");
  revalidatePath("/dashboard/tevo/vision-mission");

  return {
    success: true,
    message: "Visi misi Tevo berhasil diperbarui.",
  };
}