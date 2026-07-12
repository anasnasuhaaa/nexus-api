import { TevoArticleStatus, prisma } from "@orma/database";

import {
  getPublicMediaUrl,
  publicError,
  publicJson,
  publicNotFound,
  publicOptions,
  toIsoString,
} from "@/lib/tevo-public-api";

type RouteContext = {
  params: Promise<{
    slug: string;
  }>;
};

export async function OPTIONS() {
  return publicOptions();
}

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { slug } = await context.params;

    const article = await prisma.tevoArticle.findFirst({
      where: {
        slug,
        status: TevoArticleStatus.PUBLISHED,
      },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        content: true,
        coverUrl: true,
        authorName: true,
        publishedAt: true,
        updatedAt: true,
      },
    });

    if (!article) {
      return publicNotFound("Artikel Tevo tidak ditemukan.");
    }

    return publicJson({
      id: article.id,
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt,
      content: article.content,
      coverUrl: getPublicMediaUrl(article.coverUrl),
      authorName: article.authorName,
      publishedAt: toIsoString(article.publishedAt),
      updatedAt: toIsoString(article.updatedAt),
    });
  } catch (error) {
    console.error("Gagal mengambil public article detail Tevo:", error);

    return publicError("Gagal mengambil detail artikel Tevo.");
  }
}