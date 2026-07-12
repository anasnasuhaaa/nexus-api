"use server";

import { prisma, TevoArticleStatus } from "@orma/database";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";

export type TevoArticleFormInput = {
  articleId?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverUrl: string;
  status: string;
};

export type TevoArticleActionResult = {
  success: boolean;
  message: string;
};

const ARTICLE_STATUSES = Object.values(TevoArticleStatus);

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

function isValidArticleStatus(value: string): value is TevoArticleStatus {
  return ARTICLE_STATUSES.includes(value as TevoArticleStatus);
}

async function ensureTevoManager() {
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
      email: true,
      role: true,
    },
  });

  if (!currentUser || !isValidRole(currentUser.role)) {
    return {
      success: false,
      message:
        "Hanya Super Admin atau Tevo Admin yang dapat mengelola berita Tevo.",
      user: null,
    };
  }

  return {
    success: true,
    message: "OK",
    user: currentUser,
  };
}

async function validateArticleInput(
  input: TevoArticleFormInput,
  currentArticleId?: string,
) {
  const title = input.title.trim();
  const slug = normalizeSlug(input.slug);
  const excerpt = normalizeOptionalText(input.excerpt);
  const content = input.content.trim();
  const coverUrl = normalizeOptionalText(input.coverUrl);

  if (!title) {
    return {
      success: false as const,
      message: "Judul artikel wajib diisi.",
    };
  }

  if (!slug) {
    return {
      success: false as const,
      message: "Slug artikel wajib diisi.",
    };
  }

  if (!content) {
    return {
      success: false as const,
      message: "Isi artikel wajib diisi.",
    };
  }

  if (!isValidArticleStatus(input.status)) {
    return {
      success: false as const,
      message: "Status artikel tidak valid.",
    };
  }

  const duplicateSlug = await prisma.tevoArticle.findFirst({
    where: {
      slug,
      ...(currentArticleId
        ? {
            NOT: {
              id: currentArticleId,
            },
          }
        : {}),
    },
    select: {
      id: true,
    },
  });

  if (duplicateSlug) {
    return {
      success: false as const,
      message: "Slug artikel sudah digunakan artikel lain.",
    };
  }

  return {
    success: true as const,
    data: {
      title,
      slug,
      excerpt,
      content,
      coverUrl,
      status: input.status,
    },
  };
}

export async function createTevoArticleAction(
  input: TevoArticleFormInput,
): Promise<TevoArticleActionResult> {
  const guard = await ensureTevoManager();

  if (!guard.success || !guard.user) {
    return {
      success: false,
      message: guard.message,
    };
  }

  const validation = await validateArticleInput(input);

  if (!validation.success) {
    return {
      success: false,
      message: validation.message,
    };
  }

  const now = new Date();
  const status = validation.data.status;

  await prisma.tevoArticle.create({
    data: {
      title: validation.data.title,
      slug: validation.data.slug,
      excerpt: validation.data.excerpt,
      content: validation.data.content,
      coverUrl: validation.data.coverUrl,
      status,
      authorUserId: guard.user.id,
      authorName: guard.user.name,
      authorEmail: guard.user.email,
      publishedAt: status === "PUBLISHED" ? now : null,
      archivedAt: status === "ARCHIVED" ? now : null,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/tevo");
  revalidatePath("/dashboard/tevo/news");

  return {
    success: true,
    message: "Artikel Tevo berhasil dibuat.",
  };
}

export async function updateTevoArticleAction(
  input: TevoArticleFormInput,
): Promise<TevoArticleActionResult> {
  const guard = await ensureTevoManager();

  if (!guard.success) {
    return {
      success: false,
      message: guard.message,
    };
  }

  if (!input.articleId) {
    return {
      success: false,
      message: "ID artikel tidak ditemukan.",
    };
  }

  const article = await prisma.tevoArticle.findUnique({
    where: {
      id: input.articleId,
    },
    select: {
      id: true,
      status: true,
      publishedAt: true,
      archivedAt: true,
    },
  });

  if (!article) {
    return {
      success: false,
      message: "Artikel tidak ditemukan.",
    };
  }

  const validation = await validateArticleInput(input, input.articleId);

  if (!validation.success) {
    return {
      success: false,
      message: validation.message,
    };
  }

  const now = new Date();
  const status = validation.data.status;

  await prisma.tevoArticle.update({
    where: {
      id: input.articleId,
    },
    data: {
      title: validation.data.title,
      slug: validation.data.slug,
      excerpt: validation.data.excerpt,
      content: validation.data.content,
      coverUrl: validation.data.coverUrl,
      status,
      publishedAt:
        status === "PUBLISHED" ? article.publishedAt ?? now : null,
      archivedAt: status === "ARCHIVED" ? article.archivedAt ?? now : null,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/tevo");
  revalidatePath("/dashboard/tevo/news");
  revalidatePath(`/dashboard/tevo/news/${input.articleId}/edit`);

  return {
    success: true,
    message: "Artikel Tevo berhasil diperbarui.",
  };
}