import { prisma } from "@orma/database";
import Link from "next/link";
import {
  BadgeCheck,
  Building2,
  Landmark,
  Upload,
  UserRound,
  UsersRound,
} from "lucide-react";

import { DataTable } from "@/components/data-table/data-table";
import { Button } from "@/components/ui/button";

import { memberColumns, MemberTableRow } from "./columns";

async function getMembers() {
  return prisma.member.findMany({
    orderBy: {
      fullName: "asc",
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
  });
}

function getPositionLabel(position: string) {
  const labels: Record<string, string> = {
    KETUA_ORGANISASI: "Ketua Organisasi",
    WAKIL_KETUA_ORGANISASI: "Wakil Ketua Organisasi",
    SEKRETARIS_INTERNAL: "Sekretaris Internal",
    SEKRETARIS_EKSTERNAL: "Sekretaris Eksternal",
    BENDAHARA_INTERNAL: "Bendahara Internal",
    BENDAHARA_EKSTERNAL: "Bendahara Eksternal",
    KETUA_BIRDEP: "Ketua Birdep",
    SEKRETARIS_BIRDEP: "Sekretaris Birdep",
    BENDAHARA_BIRDEP: "Bendahara Birdep",
    ANGGOTA_BIRDEP: "Anggota Birdep",
  };

  return labels[position] ?? position.replaceAll("_", " ");
}

function getUniqueOptions<T>(
  data: T[],
  getValue: (item: T) => string,
  getLabel: (item: T) => string,
) {
  return Array.from(
    new Map(
      data.map((item) => {
        const value = getValue(item);

        return [
          value,
          {
            label: getLabel(item),
            value,
          },
        ];
      }),
    ).values(),
  );
}

export default async function MembersPage() {
  const members = await getMembers();

  const activeMembers = members.filter((member) => member.isActive);
  const inactiveMembers = members.filter((member) => !member.isActive);
  const membersWithMembership = members.filter(
    (member) => member.memberships.length > 0,
  );
  const membersWithoutMembership = members.filter(
    (member) => member.memberships.length === 0,
  );

  const tableData: MemberTableRow[] = members.map((member, index) => {
    const latestMembership = member.memberships[0];

    return {
      id: member.id,
      number: index + 1,
      fullName: member.fullName,
      nim: member.nim,
      instagram: member.instagram,
      birdepName:
        latestMembership?.primaryBirdep.name ?? "Belum ada membership",
      birdepCode: latestMembership?.primaryBirdep.code ?? "-",
      cabinetName: latestMembership?.cabinetPeriod.name ?? "-",
      position: latestMembership?.organizationalPosition ?? "-",
      positionLabel: latestMembership?.organizationalPosition
        ? getPositionLabel(latestMembership.organizationalPosition)
        : "-",
      internalTitle: latestMembership?.internalTitle ?? null,
      isActive: member.isActive,
      membershipCount: member.memberships.length,
    };
  });

  const birdepOptions = getUniqueOptions(
    tableData,
    (member) => member.birdepName,
    (member) => member.birdepName,
  ).filter((option) => option.value !== "Belum ada membership");

  const positionOptions = getUniqueOptions(
    tableData,
    (member) => member.position,
    (member) => member.positionLabel,
  ).filter((option) => option.value !== "-");

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
              Data Anggota
            </p>

            <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              Anggota Organisasi
            </h1>

            <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">
              Kelola identitas anggota, status keanggotaan, Birdep, jabatan,
              dan periode organisasi. Pengaturan akun login, aktivasi, reset
              password, role akses, dan ban user dikelola terpisah melalui menu
              Akun & Akses.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Link href="/dashboard/members/import">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Upload className="size-4" />
                Import XLSX
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-3xl border bg-card p-5 shadow-sm">
          <div className="mb-4 flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <UsersRound className="size-5" />
          </div>

          <p className="text-sm font-medium text-muted-foreground">
            Total Anggota
          </p>

          <p className="mt-2 text-3xl font-black tracking-tight">
            {members.length}
          </p>
        </div>

        <div className="rounded-3xl border bg-card p-5 shadow-sm">
          <div className="mb-4 flex size-11 items-center justify-center rounded-2xl bg-status-active-soft text-status-active">
            <BadgeCheck className="size-5" />
          </div>

          <p className="text-sm font-medium text-muted-foreground">
            Anggota Aktif
          </p>

          <p className="mt-2 text-3xl font-black tracking-tight">
            {activeMembers.length}
          </p>
        </div>

        <div className="rounded-3xl border bg-card p-5 shadow-sm">
          <div className="mb-4 flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Landmark className="size-5" />
          </div>

          <p className="text-sm font-medium text-muted-foreground">
            Punya Membership
          </p>

          <p className="mt-2 text-3xl font-black tracking-tight">
            {membersWithMembership.length}
          </p>
        </div>

        <div className="rounded-3xl border bg-card p-5 shadow-sm">
          <div className="mb-4 flex size-11 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
            <UserRound className="size-5" />
          </div>

          <p className="text-sm font-medium text-muted-foreground">
            Belum Ada Membership
          </p>

          <p className="mt-2 text-3xl font-black tracking-tight">
            {membersWithoutMembership.length}
          </p>
        </div>
      </section>

      {inactiveMembers.length ? (
        <section className="rounded-3xl border border-status-inactive/20 bg-status-inactive-soft p-5 text-status-inactive shadow-sm">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-black tracking-tight">
                Ada {inactiveMembers.length} anggota nonaktif
              </h2>
              <p className="mt-1 text-sm leading-7">
                Anggota nonaktif tetap tersimpan sebagai arsip, tetapi tidak
                diprioritaskan untuk tampilan aktif organisasi.
              </p>
            </div>
          </div>
        </section>
      ) : null}

      <section className="rounded-3xl border bg-card p-5 shadow-sm">
        <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h2 className="font-black tracking-tight">Tabel Anggota</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Gunakan pencarian nama serta filter Birdep dan jabatan untuk
              melihat struktur keanggotaan organisasi.
            </p>
          </div>

          <div className="flex w-fit items-center gap-2 rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
            <Building2 className="size-3.5" />
            Fokus data organisasi
          </div>
        </div>

        <DataTable
          columns={memberColumns}
          data={tableData}
          searchKey="fullName"
          searchPlaceholder="Cari nama anggota..."
          filters={[
            {
              columnId: "birdepName",
              label: "Birdep",
              options: [
                {
                  label: "Semua Birdep",
                  value: "ALL",
                },
                ...birdepOptions,
              ],
            },
            {
              columnId: "position",
              label: "Jabatan",
              options: [
                {
                  label: "Semua Jabatan",
                  value: "ALL",
                },
                ...positionOptions,
              ],
            },
          ]}
          sortOptions={[
            {
              label: "Nama A-Z",
              value: "name-asc",
              columnId: "fullName",
              desc: false,
            },
            {
              label: "Nama Z-A",
              value: "name-desc",
              columnId: "fullName",
              desc: true,
            },
          ]}
        />
      </section>
    </div>
  );
}