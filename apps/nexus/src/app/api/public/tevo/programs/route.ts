import { prisma } from "@orma/database";

import {
  formatUnitType,
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
    const programs = await prisma.program.findMany({
      where: {
        isPublishedToTevo: true,
        publicSlug: {
          not: null,
        },
      },
      orderBy: [
        {
          publishedToTevoAt: "desc",
        },
        {
          updatedAt: "desc",
        },
      ],
      select: {
        id: true,
        publicTitle: true,
        publicSlug: true,
        publicSummary: true,
        publicCoverUrl: true,
        publishedToTevoAt: true,
        updatedAt: true,
        birdep: {
          select: {
            id: true,
            name: true,
            code: true,
            slug: true,
            unitType: true,
          },
        },
      },
    });

    return publicJson(
      programs.map((program) => ({
        id: program.id,
        title: program.publicTitle,
        slug: program.publicSlug,
        summary: program.publicSummary,
        coverUrl: getPublicMediaUrl(program.publicCoverUrl),
        publishedAt: toIsoString(program.publishedToTevoAt),
        updatedAt: toIsoString(program.updatedAt),
        birdep: {
          id: program.birdep.id,
          name: program.birdep.name,
          code: program.birdep.code,
          slug: program.birdep.slug,
          unitType: program.birdep.unitType,
          unitTypeLabel: formatUnitType(program.birdep.unitType),
        },
      })),
    );
  } catch (error) {
    console.error("Gagal mengambil public programs Tevo:", error);

    return publicError("Gagal mengambil data program Tevo.");
  }
}