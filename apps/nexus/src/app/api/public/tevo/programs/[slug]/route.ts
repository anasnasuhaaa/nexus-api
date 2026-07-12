import { prisma } from "@orma/database";

import {
  formatUnitType,
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

    const program = await prisma.program.findFirst({
      where: {
        isPublishedToTevo: true,
        publicSlug: slug,
      },
      select: {
        id: true,
        publicTitle: true,
        publicSlug: true,
        publicSummary: true,
        publicDescription: true,
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
            description: true,
            focusArea: true,
          },
        },
      },
    });

    if (!program) {
      return publicNotFound("Program Tevo tidak ditemukan.");
    }

    return publicJson({
      id: program.id,
      title: program.publicTitle,
      slug: program.publicSlug,
      summary: program.publicSummary,
      description: program.publicDescription,
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
        description: program.birdep.description,
        focusArea: program.birdep.focusArea,
      },
    });
  } catch (error) {
    console.error("Gagal mengambil public program detail Tevo:", error);

    return publicError("Gagal mengambil detail program Tevo.");
  }
}