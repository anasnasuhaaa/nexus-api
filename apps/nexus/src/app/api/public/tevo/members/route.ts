import { prisma } from "@orma/database";

import {
  formatOrganizationalPosition,
  formatUnitType,
  publicError,
  publicJson,
  publicOptions,
} from "@/lib/tevo-public-api";

const POSITION_ORDER: Record<string, number> = {
  KETUA_ORGANISASI: 1,
  WAKIL_KETUA_ORGANISASI: 2,
  SEKRETARIS_INTERNAL: 3,
  SEKRETARIS_EKSTERNAL: 4,
  BENDAHARA_INTERNAL: 5,
  BENDAHARA_EKSTERNAL: 6,
  KETUA_BIRDEP: 7,
  SEKRETARIS_BIRDEP: 8,
  BENDAHARA_BIRDEP: 9,
  ANGGOTA_BIRDEP: 10,
};

export async function OPTIONS() {
  return publicOptions();
}

export async function GET() {
  try {
    const activeCabinet = await prisma.cabinetPeriod.findFirst({
      where: {
        isActive: true,
      },
      orderBy: {
        startDate: "desc",
      },
      select: {
        id: true,
        name: true,
      },
    });

    if (!activeCabinet) {
      return publicJson({
        cabinet: null,
        members: [],
      });
    }

    const members = await prisma.member.findMany({
      where: {
        isActive: true,
        memberships: {
          some: {
            cabinetPeriodId: activeCabinet.id,
          },
        },
      },
      orderBy: {
        fullName: "asc",
      },
      select: {
        id: true,
        fullName: true,
        instagram: true,
        memberships: {
          where: {
            cabinetPeriodId: activeCabinet.id,
          },
          select: {
            organizationalPosition: true,
            internalTitle: true,
            subdivision: true,
            programRoles: true,
            primaryBirdep: {
              select: {
                id: true,
                name: true,
                code: true,
                slug: true,
                unitType: true,
              },
            },
          },
        },
      },
    });

    const mappedMembers = members
      .map((member) => {
        const membership = member.memberships[0];

        return {
          id: member.id,
          fullName: member.fullName,
          instagram: member.instagram,
          position: membership?.organizationalPosition ?? null,
          positionLabel: membership
            ? formatOrganizationalPosition(membership.organizationalPosition)
            : null,
          internalTitle: membership?.internalTitle ?? null,
          subdivision: membership?.subdivision ?? null,
          programRoles: membership?.programRoles ?? null,
          birdep: membership
            ? {
                id: membership.primaryBirdep.id,
                name: membership.primaryBirdep.name,
                code: membership.primaryBirdep.code,
                slug: membership.primaryBirdep.slug,
                unitType: membership.primaryBirdep.unitType,
                unitTypeLabel: formatUnitType(
                  membership.primaryBirdep.unitType,
                ),
              }
            : null,
        };
      })
      .sort((a, b) => {
        const positionDiff =
          (POSITION_ORDER[a.position ?? ""] ?? 99) -
          (POSITION_ORDER[b.position ?? ""] ?? 99);

        if (positionDiff !== 0) {
          return positionDiff;
        }

        return a.fullName.localeCompare(b.fullName);
      });

    return publicJson({
      cabinet: {
        id: activeCabinet.id,
        name: activeCabinet.name,
      },
      members: mappedMembers,
    });
  } catch (error) {
    console.error("Gagal mengambil public members Tevo:", error);

    return publicError("Gagal mengambil data anggota Tevo.");
  }
}