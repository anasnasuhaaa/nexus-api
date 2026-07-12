import { prisma } from "@orma/database";

import {
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
    const profile = await prisma.tevoSiteProfile.findFirst({
      where: {
        isActive: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
      select: {
        id: true,
        siteName: true,
        tagline: true,
        organizationSummary: true,
        vision: true,
        mission: true,
        heroTitle: true,
        heroSubtitle: true,
        updatedAt: true,
      },
    });

    if (!profile) {
      return publicJson(null);
    }

    return publicJson({
      id: profile.id,
      siteName: profile.siteName,
      tagline: profile.tagline,
      organizationSummary: profile.organizationSummary,
      vision: profile.vision,
      mission: profile.mission,
      heroTitle: profile.heroTitle,
      heroSubtitle: profile.heroSubtitle,
      updatedAt: toIsoString(profile.updatedAt),
    });
  } catch (error) {
    console.error("Gagal mengambil public site profile Tevo:", error);

    return publicError("Gagal mengambil data site profile Tevo.");
  }
}