import Link from "next/link";
import { prisma } from "@orma/database";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Plus,
  Upload,
} from "lucide-react";

import { DataTable } from "@/components/data-table/data-table";
import { Button } from "@/components/ui/button";

import {
  progressUpdateColumns,
  ProgressUpdateTableRow,
} from "./columns";

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

async function getProgressUpdates() {
  return prisma.programProgressUpdate.findMany({
    orderBy: [
      {
        reportedAt: "desc",
      },
      {
        createdAt: "desc",
      },
    ],
    include: {
      author: {
        select: {
          name: true,
          email: true,
        },
      },
      program: {
        select: {
          title: true,
          slug: true,
          birdep: {
            select: {
              name: true,
              code: true,
            },
          },
        },
      },
    },
  });
}

export default async function ProgressPage() {
  const progressUpdates = await getProgressUpdates();

  const onTrackUpdates = progressUpdates.filter(
    (progress) => progress.status === "ON_TRACK",
  );

  const atRiskUpdates = progressUpdates.filter(
    (progress) => progress.status === "AT_RISK",
  );

  const blockedUpdates = progressUpdates.filter(
    (progress) => progress.status === "BLOCKED",
  );

  const tableData: ProgressUpdateTableRow[] = progressUpdates.map(
    (progress, index) => {
      return {
        id: progress.id,
        number: index + 1,
        title: progress.title,
        programTitle: progress.program.title,
        programSlug: progress.program.slug,
        birdepName: progress.program.birdep.name,
        birdepCode: progress.program.birdep.code,
        authorName: progress.author?.name ?? "Tidak diketahui",
        progressPercent: progress.progressPercent,
        status: progress.status,
        reportedAt: formatDate(progress.reportedAt),
      };
    },
  );

  const birdepOptions = getUniqueOptions(
    tableData,
    (progress) => progress.birdepName,
    (progress) => progress.birdepName,
  );

  const programOptions = getUniqueOptions(
    tableData,
    (progress) => progress.programTitle,
    (progress) => progress.programTitle,
  );

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
              Monitoring Program
            </p>

            <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              Progress Update
            </h1>

            <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">
              Pantau laporan perkembangan program kerja dari setiap Birdep
              secara terpusat, termasuk status pelaksanaan, capaian progress,
              kendala, dan tindak lanjut berikutnya.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Link href="/dashboard/progress/import">
              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 sm:w-auto">
                <Upload className="size-4" />
                Import XLSX
              </Button>
            </Link>

            <Link href="/dashboard/progress/new">
              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 sm:w-auto">
                <Plus className="size-4" />
                Tambah Progress
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-3xl border bg-card p-5 shadow-sm">
          <div className="mb-4 flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Activity className="size-5" />
          </div>

          <p className="text-sm font-medium text-muted-foreground">
            Total Update
          </p>

          <p className="mt-2 text-3xl font-black tracking-tight">
            {progressUpdates.length}
          </p>
        </div>

        <div className="rounded-3xl border bg-card p-5 shadow-sm">
          <div className="mb-4 flex size-11 items-center justify-center rounded-2xl bg-status-active-soft text-status-active">
            <CheckCircle2 className="size-5" />
          </div>

          <p className="text-sm font-medium text-muted-foreground">
            Sesuai Rencana
          </p>

          <p className="mt-2 text-3xl font-black tracking-tight">
            {onTrackUpdates.length}
          </p>
        </div>

        <div className="rounded-3xl border bg-card p-5 shadow-sm">
          <div className="mb-4 flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Clock3 className="size-5" />
          </div>

          <p className="text-sm font-medium text-muted-foreground">Berisiko</p>

          <p className="mt-2 text-3xl font-black tracking-tight">
            {atRiskUpdates.length}
          </p>
        </div>

        <div className="rounded-3xl border bg-card p-5 shadow-sm">
          <div className="mb-4 flex size-11 items-center justify-center rounded-2xl bg-status-inactive-soft text-status-inactive">
            <AlertTriangle className="size-5" />
          </div>

          <p className="text-sm font-medium text-muted-foreground">
            Terhambat
          </p>

          <p className="mt-2 text-3xl font-black tracking-tight">
            {blockedUpdates.length}
          </p>
        </div>
      </section>

      <section className="rounded-3xl border bg-card p-5 shadow-sm">
        <div className="mb-5">
          <h2 className="font-black tracking-tight">Tabel Progress Update</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Daftar laporan progress program kerja yang tersimpan dalam database
            Nexus.
          </p>
        </div>

        <DataTable
          columns={progressUpdateColumns}
          data={tableData}
          searchKey="title"
          searchPlaceholder="Cari progress update..."
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
              columnId: "status",
              label: "Status",
              options: [
                {
                  label: "Semua Status",
                  value: "ALL",
                },
                {
                  label: "Sesuai Rencana",
                  value: "ON_TRACK",
                },
                {
                  label: "Berisiko",
                  value: "AT_RISK",
                },
                {
                  label: "Terhambat",
                  value: "BLOCKED",
                },
                {
                  label: "Selesai",
                  value: "DONE",
                },
              ],
            },
            {
              columnId: "programTitle",
              label: "Program",
              options: [
                {
                  label: "Semua Program",
                  value: "ALL",
                },
                ...programOptions,
              ],
            },
          ]}
          sortOptions={[
            {
              label: "Progress tertinggi",
              value: "progress-desc",
              columnId: "progressPercent",
              desc: true,
            },
            {
              label: "Progress terendah",
              value: "progress-asc",
              columnId: "progressPercent",
              desc: false,
            },
            {
              label: "Judul A-Z",
              value: "title-asc",
              columnId: "title",
              desc: false,
            },
            {
              label: "Judul Z-A",
              value: "title-desc",
              columnId: "title",
              desc: true,
            },
            {
              label: "Tanggal terbaru",
              value: "reported-desc",
              columnId: "reportedAt",
              desc: true,
            },
            {
              label: "Tanggal terlama",
              value: "reported-asc",
              columnId: "reportedAt",
              desc: false,
            },
          ]}
        />
      </section>
    </div>
  );
}