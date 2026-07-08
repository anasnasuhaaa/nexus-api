import { prisma } from "@orma/database";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";

import { EditMemberForm, EditMemberInitialData } from "./edit-member-form";

type EditMemberPageProps = {
  params: Promise<{
    id: string;
  }>;
};

function formatDate(date: Date | null | undefined) {
  if (!date) {
    return "-";
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

async function getEditMemberData(memberId: string) {
  const [member, cabinetPeriods, birdeps] = await Promise.all([
    prisma.member.findUnique({
      where: {
        id: memberId,
      },
      include: {
        memberships: {
          orderBy: {
            createdAt: "desc",
          },
          include: {
            cabinetPeriod: true,
            primaryBirdep: true,
          },
        },
      },
    }),
    prisma.cabinetPeriod.findMany({
      orderBy: {
        startDate: "desc",
      },
      select: {
        id: true,
        name: true,
        startDate: true,
        endDate: true,
      },
    }),
    prisma.birdep.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        name: "asc",
      },
      select: {
        id: true,
        name: true,
        code: true,
        cabinetPeriodId: true,
      },
    }),
  ]);

  return {
    member,
    cabinetPeriods,
    birdeps,
  };
}

export default async function EditMemberPage({ params }: EditMemberPageProps) {
  const { id } = await params;
  const { member, cabinetPeriods, birdeps } = await getEditMemberData(id);

  if (!member) {
    notFound();
  }

  const latestMembership = member.memberships[0];

  const firstCabinetPeriodId = cabinetPeriods[0]?.id ?? "";
  const initialCabinetPeriodId =
    latestMembership?.cabinetPeriodId ?? firstCabinetPeriodId;

  const firstBirdepInSelectedPeriod =
    birdeps.find((birdep) => birdep.cabinetPeriodId === initialCabinetPeriodId)
      ?.id ?? "";

  const initialData: EditMemberInitialData = {
    memberId: member.id,
    membershipId: latestMembership?.id ?? null,
    fullName: member.fullName,
    nim: member.nim,
    instagram: member.instagram ?? "",
    isActive: member.isActive,
    cabinetPeriodId: initialCabinetPeriodId,
    primaryBirdepId:
      latestMembership?.primaryBirdepId ?? firstBirdepInSelectedPeriod,
    organizationalPosition:
      latestMembership?.organizationalPosition ?? "ANGGOTA_BIRDEP",
    internalTitle: latestMembership?.internalTitle ?? "",
    subdivision: latestMembership?.subdivision ?? "",
    programRoles: latestMembership?.programRoles ?? "",
  };

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border bg-card p-6 shadow-sm">
        <div className="mb-4">
          <Link href={`/dashboard/members/${member.id}`}>
            <Button variant="outline">
              <ArrowLeft className="size-4" />
              Kembali ke Detail Anggota
            </Button>
          </Link>
        </div>

        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
              Edit Anggota
            </p>

            <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              {member.fullName}
            </h1>

            <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">
              Perbarui data anggota dan membership organisasi. Pastikan Birdep
              yang dipilih sesuai dengan periode kabinet.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-2xl border bg-background px-4 py-3 text-sm text-muted-foreground">
            <Pencil className="size-4 text-primary" />
            Terakhir diperbarui: {formatDate(member.updatedAt)}
          </div>
        </div>
      </section>

      <EditMemberForm
        initialData={initialData}
        cabinetPeriods={cabinetPeriods.map((period) => ({
          id: period.id,
          name: period.name,
          startDate: formatDate(period.startDate),
          endDate: formatDate(period.endDate),
        }))}
        birdeps={birdeps}
      />
    </div>
  );
}