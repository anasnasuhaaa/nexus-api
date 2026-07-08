import { prisma } from "@orma/database";
import Link from "next/link";
import { BadgeCheck, Search, Upload, UserRound, UsersRound } from "lucide-react";
import { Button } from "@/components/ui/button";

import { BulkActivationButton } from "./bulk-activation-button";
import { getBulkActivationStatsAction } from "./bulk-activation-action";

import { DataTable } from "@/components/data-table/data-table";

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
      users: {
        select: {
          id: true,
          email: true,
          role: true,
          mustChangePassword: true,
        },
      },
    },
  });
}

export default async function MembersPage() {
  const members = await getMembers();
  const activationStats = await getBulkActivationStatsAction();

  const activeMembers = members.filter((member) => member.isActive);
  const membersWithAccount = members.filter((member) => member.users.length > 0);

  const tableData: MemberTableRow[] = members.map((member, index) => {
    const latestMembership = member.memberships[0];
    const user = member.users[0];

    return {
      id: member.id,
      number: index + 1,
      fullName: member.fullName,
      nim: member.nim,
      instagram: member.instagram,
      birdepName: latestMembership?.primaryBirdep.name ?? "Belum ada membership",
      cabinetName: latestMembership?.cabinetPeriod.name ?? "-",
      position: latestMembership?.organizationalPosition ?? "-",
      internalTitle: latestMembership?.internalTitle ?? null,
      email: user?.email ?? null,
      role: user?.role ?? null,
      isActive: member.isActive,
    };
  });

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
              Halaman ini membaca data langsung dari database. Tabel sudah
              memakai DataTable agar mendukung filter, sorting, dan pagination.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            {/* <div className="flex items-center gap-2 rounded-2xl border bg-background px-3 py-2 text-sm text-muted-foreground">
              <Search className="size-4" />
              Filter aktif berdasarkan nama anggota
            </div> */}
            <BulkActivationButton eligibleCount={activationStats.eligibleCount} />
            <Link href="/dashboard/members/import">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Upload className="size-4" />
                Import XLSX
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
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
          <div className="mb-4 flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
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
            <UserRound className="size-5" />
          </div>

          <p className="text-sm font-medium text-muted-foreground">
            Punya Akun Login
          </p>

          <p className="mt-2 text-3xl font-black tracking-tight">
            {membersWithAccount.length}
          </p>
        </div>
      </section>

      <section className="rounded-3xl border bg-card p-5 shadow-sm">
        <div className="mb-5">
          <h2 className="font-black tracking-tight">Tabel Anggota</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Filter saat ini menggunakan kolom nama.
          </p>
        </div>

        <DataTable
          columns={memberColumns}
          data={tableData}
          searchKey="fullName"
          searchPlaceholder="Cari nama anggota..."
        />
      </section>
    </div>
  );
}