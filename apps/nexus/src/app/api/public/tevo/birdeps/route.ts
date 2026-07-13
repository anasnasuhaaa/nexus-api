import { prisma } from "@orma/database";

import {
  formatOrganizationalPosition,
  formatUnitType,
  publicError,
  publicJson,
  publicOptions,
  toIsoString,
} from "@/lib/tevo-public-api";

const UNIT_ORDER: Record<string, number> = {
  BPH: 1,
  BIRO: 2,
  DEPARTEMEN: 3,
};

const LEADER_POSITIONS = new Set([
  "KETUA_ORGANISASI",
  "WAKIL_KETUA_ORGANISASI",
  "SEKRETARIS_INTERNAL",
  "SEKRETARIS_EKSTERNAL",
  "BENDAHARA_INTERNAL",
  "BENDAHARA_EKSTERNAL",
  "KETUA_BIRDEP",
  "SEKRETARIS_BIRDEP",
  "BENDAHARA_BIRDEP",
]);

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
        slug: true,
        startDate: true,
        endDate: true,
        birdeps: {
          where: {
            isActive: true,
          },
          select: {
            id: true,
            name: true,
            code: true,
            slug: true,
            unitType: true,
            description: true,
            focusArea: true,
            memberships: {
              where: {
                member: {
                  isActive: true,
                },
              },
              select: {
                organizationalPosition: true,
                internalTitle: true,
                subdivision: true,
                member: {
                  select: {
                    id: true,
                    fullName: true,
                    instagram: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!activeCabinet) {
      return publicJson({
        cabinet: null,
        birdeps: [],
      });
    }

    const birdeps = activeCabinet.birdeps
      .map((birdep) => {
        const leaders = birdep.memberships
          .filter((membership) =>
            LEADER_POSITIONS.has(membership.organizationalPosition),
          )
          .map((membership) => ({
            id: membership.member.id,
            fullName: membership.member.fullName,
            instagram: membership.member.instagram,
            position: membership.organizationalPosition,
            positionLabel: formatOrganizationalPosition(
              membership.organizationalPosition,
            ),
            internalTitle: membership.internalTitle,
            subdivision: membership.subdivision,
          }));

        return {
          id: birdep.id,
          name: birdep.name,
          code: birdep.code,
          slug: birdep.slug,
          unitType: birdep.unitType,
          unitTypeLabel: formatUnitType(birdep.unitType),
          description: birdep.description,
          focusArea: birdep.focusArea,
          memberCount: birdep.memberships.length,
          leaders,
        };
      })
      .sort((a, b) => {
        const unitDiff =
          (UNIT_ORDER[a.unitType] ?? 99) - (UNIT_ORDER[b.unitType] ?? 99);

        if (unitDiff !== 0) {
          return unitDiff;
        }

        return a.name.localeCompare(b.name);
      });

    return publicJson({
      cabinet: {
        id: activeCabinet.id,
        name: activeCabinet.name,
        slug: activeCabinet.slug,
        startDate: toIsoString(activeCabinet.startDate),
        endDate: toIsoString(activeCabinet.endDate),
      },
      birdeps,
    });
  } catch (error) {
    console.error("Gagal mengambil public birdeps Tevo:", error);

    return publicError("Gagal mengambil data Birdep Tevo.");
  }
}