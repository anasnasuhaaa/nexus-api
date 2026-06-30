import { prisma } from "@orma/database";
import {
  Building2,
  Landmark,
  Network,
  Search,
  UsersRound,
} from "lucide-react";

import { DataTable } from "@/components/data-table/data-table";

import { birdepColumns, BirdepTableRow } from "./columns";

async function getBirdeps() {
  return prisma.birdep.findMany({
    orderBy: [
      {
        unitType: "asc",
      },
      {
        name: "asc",
      },
    ],
    include: {
      cabinetPeriod: true,
      memberships: {
        select: {
          id: true,
        },
      },
    },
  });
}

export default async function BirdepPage() {
  const birdeps = await getBirdeps();

  const activeBirdeps = birdeps.filter((birdep) => birdep.isActive);
  const biroCount = birdeps.filter((birdep) => birdep.unitType === "BIRO").length;
  const departemenCount = birdeps.filter(
    (birdep) => birdep.unitType === "DEPARTEMEN",
  ).length;

  const tableData: BirdepTableRow[] = birdeps.map((birdep, index) => {
    return {
      id: birdep.id,
      number: index + 1,
      name: birdep.name,
      code: birdep.code,
      slug: birdep.slug,
      unitType: birdep.unitType,
      cabinetName: birdep.cabinetPeriod.name,
      description: birdep.description,
      focusArea: birdep.focusArea,
      memberCount: birdep.memberships.length,
      isActive: birdep.isActive,
    };
  });

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
              Master Organisasi
            </p>

            <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              Data Birdep
            </h1>

            <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">
              Halaman ini menampilkan 13 unit organisasi yang sudah disiapkan
              melalui seed database. Modul ini masih read-only dan akan menjadi
              dasar untuk pengelolaan profil Birdep berikutnya.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-2xl border bg-background px-3 py-2 text-sm text-muted-foreground">
            <Search className="size-4" />
            Filter aktif berdasarkan nama Birdep
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-3xl border bg-card p-5 shadow-sm">
          <div className="mb-4 flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Landmark className="size-5" />
          </div>

          <p className="text-sm font-medium text-muted-foreground">
            Total Birdep
          </p>

          <p className="mt-2 text-3xl font-black tracking-tight">
            {birdeps.length}
          </p>
        </div>

        <div className="rounded-3xl border bg-card p-5 shadow-sm">
          <div className="mb-4 flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Building2 className="size-5" />
          </div>

          <p className="text-sm font-medium text-muted-foreground">
            Total Biro
          </p>

          <p className="mt-2 text-3xl font-black tracking-tight">
            {biroCount}
          </p>
        </div>

        <div className="rounded-3xl border bg-card p-5 shadow-sm">
          <div className="mb-4 flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Network className="size-5" />
          </div>

          <p className="text-sm font-medium text-muted-foreground">
            Total Departemen
          </p>

          <p className="mt-2 text-3xl font-black tracking-tight">
            {departemenCount}
          </p>
        </div>

        <div className="rounded-3xl border bg-card p-5 shadow-sm">
          <div className="mb-4 flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <UsersRound className="size-5" />
          </div>

          <p className="text-sm font-medium text-muted-foreground">
            Birdep Aktif
          </p>

          <p className="mt-2 text-3xl font-black tracking-tight">
            {activeBirdeps.length}
          </p>
        </div>
      </section>

      <section className="rounded-3xl border bg-card p-5 shadow-sm">
        <div className="mb-5">
          <h2 className="font-black tracking-tight">Tabel Birdep</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            DataTable ini menggunakan komponen reusable yang sama dengan modul
            Data Anggota.
          </p>
        </div>

        <DataTable
          columns={birdepColumns}
          data={tableData}
          searchKey="name"
          searchPlaceholder="Cari nama Birdep..."
        />
      </section>
    </div>
  );
}