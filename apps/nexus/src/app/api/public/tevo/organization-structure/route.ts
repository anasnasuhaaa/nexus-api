import { prisma } from "@orma/database";

import {
  formatOrganizationalPosition,
  formatUnitType,
  publicError,
  publicJson,
  publicOptions,
  toIsoString,
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

const UNIT_ORDER: Record<string, number> = {
  BPH: 1,
  BIRO: 2,
  DEPARTEMEN: 3,
};

function sortByPosition<T extends { position: string }>(items: T[]) {
  return items.sort((a, b) => {
    return (
      (POSITION_ORDER[a.position] ?? 99) - (POSITION_ORDER[b.position] ?? 99)
    );
  });
}

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
                id: true,
                organizationalPosition: true,
                internalTitle: true,
                subdivision: true,
                programRoles: true,
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
        units: [],
      });
    }

    const units = activeCabinet.birdeps
      .map((birdep) => {
        const members = birdep.memberships.map((membership) => ({
          id: membership.member.id,
          fullName: membership.member.fullName,
          instagram: membership.member.instagram,
          position: membership.organizationalPosition,
          positionLabel: formatOrganizationalPosition(
            membership.organizationalPosition,
          ),
          internalTitle: membership.internalTitle,
          subdivision: membership.subdivision,
          programRoles: membership.programRoles,
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
          members: sortByPosition(members),
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
      units,
    });
  } catch (error) {
    console.error("Gagal mengambil public organization structure Tevo:", error);

    return publicError("Gagal mengambil struktur organisasi Tevo.");
  }
}