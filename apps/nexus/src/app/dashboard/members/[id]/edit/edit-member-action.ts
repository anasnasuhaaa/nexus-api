"use server";

import {
  OrganizationalPosition,
  prisma,
} from "@orma/database";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";

const ORGANIZATIONAL_POSITIONS = Object.values(OrganizationalPosition);

export type UpdateMemberInput = {
  memberId: string;
  membershipId: string | null;
  fullName: string;
  nim: string;
  instagram: string;
  isActive: boolean;
  cabinetPeriodId: string;
  primaryBirdepId: string;
  organizationalPosition: string;
  internalTitle: string;
  subdivision: string;
  programRoles: string;
};

export type UpdateMemberResult = {
  success: boolean;
  message: string;
};

function normalizeInstagram(value: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    return null;
  }

  return trimmed.replace(/^@/, "");
}

function normalizeOptionalText(value: string) {
  const trimmed = value.trim();

  return trimmed ? trimmed : null;
}

function isValidOrganizationalPosition(
  value: string,
): value is OrganizationalPosition {
  return ORGANIZATIONAL_POSITIONS.includes(value as OrganizationalPosition);
}

async function ensureSuperAdmin() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return {
      success: false,
      message: "Session tidak valid. Silakan login ulang.",
      userId: null,
    };
  }

  const currentUser = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      id: true,
      role: true,
    },
  });

  if (!currentUser || currentUser.role !== "SUPER_ADMIN") {
    return {
      success: false,
      message: "Hanya Super Admin yang dapat mengedit data anggota.",
      userId: null,
    };
  }

  return {
    success: true,
    message: "OK",
    userId: currentUser.id,
  };
}

export async function updateMemberAction(
  input: UpdateMemberInput,
): Promise<UpdateMemberResult> {
  const guard = await ensureSuperAdmin();

  if (!guard.success) {
    return {
      success: false,
      message: guard.message,
    };
  }

  const fullName = input.fullName.trim();
  const nim = input.nim.trim();
  const instagram = normalizeInstagram(input.instagram);
  const internalTitle = normalizeOptionalText(input.internalTitle);
  const subdivision = normalizeOptionalText(input.subdivision);
  const programRoles = normalizeOptionalText(input.programRoles);

  if (!fullName) {
    return {
      success: false,
      message: "Nama lengkap wajib diisi.",
    };
  }

  if (!nim) {
    return {
      success: false,
      message: "NIM wajib diisi.",
    };
  }

  if (!input.cabinetPeriodId) {
    return {
      success: false,
      message: "Periode kabinet wajib dipilih.",
    };
  }

  if (!input.primaryBirdepId) {
    return {
      success: false,
      message: "Birdep utama wajib dipilih.",
    };
  }

  if (!isValidOrganizationalPosition(input.organizationalPosition)) {
    return {
      success: false,
      message: "Posisi organisasi tidak valid.",
    };
  }

  const organizationalPosition: OrganizationalPosition =
    input.organizationalPosition;

  const member = await prisma.member.findUnique({
    where: {
      id: input.memberId,
    },
    select: {
      id: true,
    },
  });

  if (!member) {
    return {
      success: false,
      message: "Data anggota tidak ditemukan.",
    };
  }

  const duplicateNim = await prisma.member.findFirst({
    where: {
      nim,
      NOT: {
        id: input.memberId,
      },
    },
    select: {
      id: true,
      fullName: true,
    },
  });

  if (duplicateNim) {
    return {
      success: false,
      message: `NIM sudah digunakan oleh ${duplicateNim.fullName}.`,
    };
  }

  const selectedBirdep = await prisma.birdep.findUnique({
    where: {
      id: input.primaryBirdepId,
    },
    select: {
      id: true,
      cabinetPeriodId: true,
    },
  });

  if (!selectedBirdep) {
    return {
      success: false,
      message: "Birdep yang dipilih tidak ditemukan.",
    };
  }

  if (selectedBirdep.cabinetPeriodId !== input.cabinetPeriodId) {
    return {
      success: false,
      message: "Birdep yang dipilih tidak sesuai dengan periode kabinet.",
    };
  }

  if (input.membershipId) {
    const membership = await prisma.membership.findFirst({
      where: {
        id: input.membershipId,
        memberId: input.memberId,
      },
      select: {
        id: true,
      },
    });

    if (!membership) {
      return {
        success: false,
        message: "Membership anggota tidak ditemukan.",
      };
    }

    const duplicateMembership = await prisma.membership.findFirst({
      where: {
        memberId: input.memberId,
        cabinetPeriodId: input.cabinetPeriodId,
        NOT: {
          id: input.membershipId,
        },
      },
      select: {
        id: true,
      },
    });

    if (duplicateMembership) {
      return {
        success: false,
        message:
          "Anggota ini sudah memiliki membership pada periode kabinet yang dipilih.",
      };
    }
  }

  try {
    await prisma.$transaction(async (tx) => {
      await tx.member.update({
        where: {
          id: input.memberId,
        },
        data: {
          fullName,
          nim,
          instagram,
          isActive: input.isActive,
        },
      });

      if (input.membershipId) {
        await tx.membership.update({
          where: {
            id: input.membershipId,
          },
          data: {
            cabinetPeriodId: input.cabinetPeriodId,
            primaryBirdepId: input.primaryBirdepId,
            organizationalPosition,
            internalTitle,
            subdivision,
            programRoles,
          },
        });
      } else {
        await tx.membership.create({
          data: {
            memberId: input.memberId,
            cabinetPeriodId: input.cabinetPeriodId,
            primaryBirdepId: input.primaryBirdepId,
            organizationalPosition,
            internalTitle,
            subdivision,
            programRoles,
          },
        });
      }

      await tx.user.updateMany({
        where: {
          memberId: input.memberId,
        },
        data: {
          name: fullName,
          updatedAt: new Date(),
        },
      });
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/members");
    revalidatePath(`/dashboard/members/${input.memberId}`);
    revalidatePath(`/dashboard/members/${input.memberId}/edit`);

    return {
      success: true,
      message: "Data anggota berhasil diperbarui.",
    };
  } catch (error) {
    console.error("Gagal update member:", error);

    return {
      success: false,
      message: "Terjadi kesalahan saat memperbarui data anggota.",
    };
  }
}