"use server";

import { MediaCategory, prisma } from "@orma/database";
import crypto from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";

export type MediaActionResult = {
  success: boolean;
  message: string;
};

const MAX_FILE_SIZE = 4 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const MEDIA_CATEGORIES = Object.values(MediaCategory);

function isValidCategory(value: string): value is MediaCategory {
  return MEDIA_CATEGORIES.includes(value as MediaCategory);
}

function isValidRole(role: string | null | undefined) {
  return role === "SUPER_ADMIN" || role === "TEVO_ADMIN";
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "Terjadi kesalahan tidak diketahui.";
}

function getNexusPublicDirectory() {
  const cwd = process.cwd();

  if (cwd.endsWith(path.join("apps", "nexus"))) {
    return path.join(cwd, "public");
  }

  return path.join(cwd, "apps", "nexus", "public");
}

function getMediaUploadDirectory() {
  return path.join(getNexusPublicDirectory(), "uploads", "media");
}

function getFileExtension(file: File) {
  const originalExtension = path
    .extname(file.name)
    .replace(".", "")
    .toLowerCase();

  if (originalExtension) {
    return originalExtension === "jpeg" ? "jpg" : originalExtension;
  }

  if (file.type === "image/png") {
    return "png";
  }

  if (file.type === "image/webp") {
    return "webp";
  }

  return "jpg";
}

async function ensureMediaManager() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return {
      success: false,
      message: "Session tidak valid. Silakan login ulang.",
      user: null,
    };
  }

  const currentUser = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      id: true,
      name: true,
      role: true,
    },
  });

  if (!currentUser || !isValidRole(currentUser.role)) {
    return {
      success: false,
      message:
        "Hanya Super Admin atau Tevo Admin yang dapat mengelola media.",
      user: null,
    };
  }

  return {
    success: true,
    message: "OK",
    user: currentUser,
  };
}

export async function uploadMediaAction(
  formData: FormData,
): Promise<MediaActionResult> {
  const guard = await ensureMediaManager();

  if (!guard.success || !guard.user) {
    return {
      success: false,
      message: guard.message,
    };
  }

  const file = formData.get("file");
  const altText = String(formData.get("altText") ?? "").trim();
  const categoryValue = String(formData.get("category") ?? "GENERAL");

  if (!(file instanceof File)) {
    return {
      success: false,
      message: "File gambar wajib dipilih.",
    };
  }

  if (!file.size) {
    return {
      success: false,
      message: "File gambar tidak valid.",
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      success: false,
      message: "Ukuran gambar maksimal 4 MB.",
    };
  }

  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return {
      success: false,
      message: "Format gambar harus JPG, JPEG, PNG, atau WebP.",
    };
  }

  if (!isValidCategory(categoryValue)) {
    return {
      success: false,
      message: "Kategori media tidak valid.",
    };
  }

  try {
    const uploadDirectory = getMediaUploadDirectory();
    await mkdir(uploadDirectory, {
      recursive: true,
    });

    const extension = getFileExtension(file);
    const fileName = `${crypto.randomUUID()}.${extension}`;
    const filePath = path.join(uploadDirectory, fileName);
    const publicUrl = `/uploads/media/${fileName}`;

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    await writeFile(filePath, buffer);

    await prisma.mediaAsset.create({
      data: {
        fileName,
        originalName: file.name,
        mimeType: file.type,
        sizeBytes: file.size,
        url: publicUrl,
        altText: altText || null,
        category: categoryValue,
        uploadedById: guard.user.id,
        uploadedByName: guard.user.name,
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/media");
    revalidatePath("/dashboard/tevo");
    revalidatePath("/dashboard/tevo/programs");
    revalidatePath("/dashboard/tevo/news");

    return {
      success: true,
      message: "Media berhasil diupload.",
    };
  } catch (error) {
    console.error("Gagal upload media:", error);

    return {
      success: false,
      message: getErrorMessage(error),
    };
  }
}

export async function deleteMediaAction(
  mediaId: string,
): Promise<MediaActionResult> {
  const guard = await ensureMediaManager();

  if (!guard.success) {
    return {
      success: false,
      message: guard.message,
    };
  }

  const media = await prisma.mediaAsset.findUnique({
    where: {
      id: mediaId,
    },
    select: {
      id: true,
      fileName: true,
    },
  });

  if (!media) {
    return {
      success: false,
      message: "Media tidak ditemukan.",
    };
  }

  try {
    const filePath = path.join(getMediaUploadDirectory(), media.fileName);

    await prisma.mediaAsset.delete({
      where: {
        id: media.id,
      },
    });

    await unlink(filePath).catch(() => null);

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/media");
    revalidatePath("/dashboard/tevo");
    revalidatePath("/dashboard/tevo/programs");
    revalidatePath("/dashboard/tevo/news");

    return {
      success: true,
      message: "Media berhasil dihapus.",
    };
  } catch (error) {
    console.error("Gagal hapus media:", error);

    return {
      success: false,
      message: getErrorMessage(error),
    };
  }
}