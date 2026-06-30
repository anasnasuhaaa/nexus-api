import { prisma } from "@orma/database";
import {
  Activity,
  CheckCircle2,
  FileText,
  Plus,
  Search,
  Timer,
} from "lucide-react";

import { DataTable } from "@/components/data-table/data-table";
import { Button } from "@/components/ui/button";

import { programColumns, ProgramTableRow } from "./columns";

function formatDate(date: Date | null) {
  if (!date) {
    return "-";
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

async function getPrograms() {
  return prisma.program.findMany({
    orderBy: [
      {
        createdAt: "desc",
      },
    ],
    include: {
      birdep: {
        select: {
          name: true,
          code: true,
        },
      },
      progressUpdates: {
        select: {
          id: true,
        },
      },
    },
  });
}

export default async function ProgramsPage() {
  const programs = await getPrograms();

  const ongoingPrograms = programs.filter(
    (program) => program.status === "ONGOING",
  );

  const completedPrograms = programs.filter(
    (program) => program.status === "COMPLETED",
  );

  const totalProgressUpdates = programs.reduce((total, program) => {
    return total + program.progressUpdates.length;
  }, 0);

  const tableData: ProgramTableRow[] = programs.map((program, index) => {
    return {
      id: program.id,
      number: index + 1,
      title: program.title,
      slug: program.slug,
      birdepName: program.birdep.name,
      birdepCode: program.birdep.code,
      status: program.status,
      progressPercent: program.progressPercent,
      startDate: formatDate(program.startDate),
      endDate: formatDate(program.endDate),
      isPublishedToTevo: program.isPublishedToTevo,
    };
  });

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
              Manajemen Program
            </p>

            <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              Program Kerja
            </h1>

            <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">
              Kelola dan pantau daftar program kerja dari setiap Birdep dalam
              satu halaman terpusat. Data ini akan menjadi dasar monitoring
              progress dan publikasi informasi ke Tevo.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="flex items-center gap-2 rounded-2xl border bg-card px-3 py-2 text-sm text-muted-foreground">
              <Search className="size-4" />
              Filter aktif berdasarkan nama program
            </div>

            <Button disabled className="bg-primary text-primary-foreground">
              <Plus className="size-4" />
              Tambah Program
            </Button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-3xl border bg-card p-5 shadow-sm">
          <div className="mb-4 flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <FileText className="size-5" />
          </div>

          <p className="text-sm font-medium text-muted-foreground">
            Total Program
          </p>

          <p className="mt-2 text-3xl font-black tracking-tight">
            {programs.length}
          </p>
        </div>

        <div className="rounded-3xl border bg-card p-5 shadow-sm">
          <div className="mb-4 flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Timer className="size-5" />
          </div>

          <p className="text-sm font-medium text-muted-foreground">
            Sedang Berjalan
          </p>

          <p className="mt-2 text-3xl font-black tracking-tight">
            {ongoingPrograms.length}
          </p>
        </div>

        <div className="rounded-3xl border bg-card p-5 shadow-sm">
          <div className="mb-4 flex size-11 items-center justify-center rounded-2xl bg-status-active-soft text-status-active">
            <CheckCircle2 className="size-5" />
          </div>

          <p className="text-sm font-medium text-muted-foreground">
            Selesai
          </p>

          <p className="mt-2 text-3xl font-black tracking-tight">
            {completedPrograms.length}
          </p>
        </div>

        <div className="rounded-3xl border bg-card p-5 shadow-sm">
          <div className="mb-4 flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Activity className="size-5" />
          </div>

          <p className="text-sm font-medium text-muted-foreground">
            Progress Update
          </p>

          <p className="mt-2 text-3xl font-black tracking-tight">
            {totalProgressUpdates}
          </p>
        </div>
      </section>

      <section className="rounded-3xl border bg-card p-5 shadow-sm">
        <div className="mb-5">
          <h2 className="font-black tracking-tight">Tabel Program Kerja</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Daftar program kerja yang tersimpan dalam database Nexus.
          </p>
        </div>

        <DataTable
          columns={programColumns}
          data={tableData}
          searchKey="title"
          searchPlaceholder="Cari nama program kerja..."
        />
      </section>
    </div>
  );
}