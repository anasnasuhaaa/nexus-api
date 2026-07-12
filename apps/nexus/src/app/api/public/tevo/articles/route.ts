import { TevoArticleStatus, prisma } from "@orma/database";

import {
  getPublicMediaUrl,
  publicError,
  publicJson,
  publicOptions,
  toIsoString,
} from "@/lib/tevo-public-api";

export async function OPTIONS() {
  return publicOptions();
}

export async function GET() {
  try {
    const articles = await prisma.tevoArticle.findMany({
      where: {
        status: TevoArticleStatus.PUBLISHED,
      },
      orderBy: [
        {
          publishedAt: "desc",
        },
        {
          updatedAt: "desc",
        },
      ],
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        coverUrl: true,
        authorName: true,
        publishedAt: true,
        updatedAt: true,
      },
    });

    return publicJson(
      articles.map((article) => ({
        id: article.id,
        title: article.title,
        slug: article.slug,
        excerpt: article.excerpt,
        coverUrl: getPublicMediaUrl(article.coverUrl),
        authorName: article.authorName,
        publishedAt: toIsoString(article.publishedAt),
        updatedAt: toIsoString(article.updatedAt),
      })),
    );
  } catch (error) {
    console.error("Gagal mengambil public articles Tevo:", error);

    return publicError("Gagal mengambil data artikel Tevo.");
  }
}