import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@orma/database";
import {
  Activity,
  ArrowLeft,
  CalendarDays,
  FileText,
  Flag,
  Plus,
  Landmark,
  ListChecks,
  Route,
  UserRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";

type ProgressDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

function formatDate(date: Date | null) {
  if (!date) {
    return "-";
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

function getProgressStatusLabel(status: string) {
  const labels: Record<string, string> = {
    ON_TRACK: "Sesuai Rencana",
    AT_RISK: "Berisiko",
    BLOCKED: "Terhambat",
    DONE: "Selesai",
  };

  return labels[status] ?? status;
}

function getProgressStatusClassName(status: string) {
  const classNames: Record<string, string> = {
    ON_TRACK: "bg-status-active-soft text-status-active",
    AT_RISK: "bg-primary/10 text-primary",
    BLOCKED: "bg-status-inactive-soft text-status-inactive",
    DONE: "bg-status-active-soft text-status-active",
  };

  return classNames[status] ?? "bg-muted text-muted-foreground";
}

function getProgramStatusLabel(status: string) {
  const labels: Record<string, string> = {
    PLANNED: "Direncanakan",
    ONGOING: "Berjalan",
    COMPLETED: "Selesai",
    CANCELLED: "Dibatalkan",
    ARCHIVED: "Diarsipkan",
  };

  return labels[status] ?? status;
}

function getProgramStatusClassName(status: string) {
  const classNames: Record<string, string> = {
    PLANNED: "bg-primary/10 text-primary",
    ONGOING: "bg-status-active-soft text-status-active",
    COMPLETED: "bg-status-active-soft text-status-active",
    CANCELLED: "bg-status-inactive-soft text-status-inactive",
    ARCHIVED: "bg-muted text-muted-foreground",
  };

  return classNames[status] ?? "bg-muted text-muted-foreground";
}

async function getProgressDetail(id: string) {
  return prisma.programProgressUpdate.findUnique({
    where: {
      id,
    },
    include: {
      author: {
        select: {
          name: true,
          email: true,
          role: true,
        },
      },
      program: {
        include: {
          birdep: {
            select: {
              name: true,
              code: true,
              unitType: true,
            },
          },
        },
      },
    },
  });
}

export default async function ProgressDetailPage({
  params,
}: ProgressDetailPageProps) {
  const { id } = await params;
  const progress = await getProgressDetail(id);

  if (!progress) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="mb-4">
              <Link href="/dashboard/progress">
                <Button variant="outline">
                  <ArrowLeft className="size-4" />
                  Kembali
                </Button>
              </Link>
            </div>

            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
              Detail Progress Update
            </p>

            <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              {progress.title}
            </h1>

            <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">
              Laporan perkembangan untuk program kerja{" "}
              <span className="font-semibold text-foreground">
                {progress.program.title}
              </span>{" "}
              dari {progress.program.birdep.name}.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <span
                className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getProgressStatusClassName(
                  progress.status,
                )}`}
              >
                {getProgressStatusLabel(progress.status)}
              </span>

              <span className="inline-flex rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                {progress.progressPercent}%
              </span>

              <span className="inline-flex rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                {progress.program.birdep.code}
              </span>
            </div>
          </div>

          <div className="w-full max-w-sm rounded-3xl border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress Dilaporkan</span>
              <span className="font-semibold text-primary">
                {progress.progressPercent}%
              </span>
            </div>

            <div className="mt-3 h-3 rounded-full bg-primary/10">
              <div
                className="h-3 rounded-full bg-primary"
                style={{
                  width: `${progress.progressPercent}%`,
                }}
              />
            </div>

            <p className="mt-3 text-xs leading-6 text-muted-foreground">
              Nilai progress ini juga dapat memperbarui capaian program kerja
              terkait ketika data diimport.
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-3xl border bg-card p-5 shadow-sm">
          <div className="mb-4 flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <FileText className="size-5" />
          </div>

          <p className="text-sm font-medium text-muted-foreground">Program</p>

          <Link
            href={`/dashboard/programs/${progress.program.id}`}
            className="mt-2 block text-xl font-black tracking-tight transition hover:text-primary"
          >
            {progress.program.title}
          </Link>

          <p className="mt-2 text-xs leading-6 text-muted-foreground">
            {progress.program.slug}
          </p>
        </div>

        <div className="rounded-3xl border bg-card p-5 shadow-sm">
          <div className="mb-4 flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Landmark className="size-5" />
          </div>

          <p className="text-sm font-medium text-muted-foreground">Birdep</p>
          <p className="mt-2 text-xl font-black tracking-tight">
            {progress.program.birdep.name}
          </p>
          <p className="mt-2 text-xs leading-6 text-muted-foreground">
            {progress.program.birdep.unitType}
          </p>
        </div>

        <div className="rounded-3xl border bg-card p-5 shadow-sm">
          <div className="mb-4 flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <CalendarDays className="size-5" />
          </div>

          <p className="text-sm font-medium text-muted-foreground">
            Tanggal Laporan
          </p>
          <p className="mt-2 text-xl font-black tracking-tight">
            {formatDate(progress.reportedAt)}
          </p>
          <p className="mt-2 text-xs leading-6 text-muted-foreground">
            Reported at
          </p>
        </div>

        <div className="rounded-3xl border bg-card p-5 shadow-sm">
          <div className="mb-4 flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <UserRound className="size-5" />
          </div>

          <p className="text-sm font-medium text-muted-foreground">Pelapor</p>
          <p className="mt-2 text-xl font-black tracking-tight">
            {progress.author?.name ?? "Tidak diketahui"}
          </p>
          <p className="mt-2 text-xs leading-6 text-muted-foreground">
            {progress.author?.email ?? "Tidak ada email"}
          </p>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border bg-card p-6 shadow-sm">
          <div className="mb-5 flex items-start gap-4">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <ListChecks className="size-5" />
            </div>

            <div>
              <h2 className="text-lg font-black tracking-tight">
                Catatan Progress
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Ringkasan perkembangan yang dilaporkan untuk program ini.
              </p>
            </div>
          </div>

          <p className="text-sm leading-7 text-muted-foreground">
            {progress.note}
          </p>
        </div>

        <div className="rounded-3xl border bg-card p-6 shadow-sm">
          <div className="mb-5 flex items-start gap-4">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Flag className="size-5" />
            </div>

            <div>
              <h2 className="text-lg font-black tracking-tight">
                Status Program
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Kondisi program setelah laporan progress ini masuk.
              </p>
            </div>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between gap-4 rounded-2xl border bg-card px-4 py-3">
              <span className="text-muted-foreground">Status Progress</span>
              <span
                className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getProgressStatusClassName(
                  progress.status,
                )}`}
              >
                {getProgressStatusLabel(progress.status)}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4 rounded-2xl border bg-card px-4 py-3">
              <span className="text-muted-foreground">Status Program</span>
              <span
                className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getProgramStatusClassName(
                  progress.program.status,
                )}`}
              >
                {getProgramStatusLabel(progress.program.status)}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4 rounded-2xl border bg-card px-4 py-3">
              <span className="text-muted-foreground">Progress Program</span>
              <span className="font-semibold text-primary">
                {progress.program.progressPercent}%
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-3xl border bg-card p-6 shadow-sm">
          <div className="mb-5 flex items-start gap-4">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Activity className="size-5" />
            </div>

            <div>
              <h2 className="text-lg font-black tracking-tight">Kendala</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Hambatan yang dicatat dalam laporan progress.
              </p>
            </div>
          </div>

          <p className="text-sm leading-7 text-muted-foreground">
            {progress.obstacle || "Tidak ada kendala yang dicatat."}
          </p>
        </div>

        <div className="rounded-3xl border bg-card p-6 shadow-sm">
          <div className="mb-5 flex items-start gap-4">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Route className="size-5" />
            </div>

            <div>
              <h2 className="text-lg font-black tracking-tight">
                Langkah Berikutnya
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Rencana tindak lanjut setelah laporan ini.
              </p>
            </div>
          </div>

          <p className="text-sm leading-7 text-muted-foreground">
            {progress.nextStep || "Belum ada langkah berikutnya yang dicatat."}
          </p>
        </div>
      </section>

      <section className="rounded-3xl border bg-card p-6 shadow-sm">
        <div className="mb-5 flex items-start gap-4">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Activity className="size-5" />
          </div>

          <div>
            <h2 className="text-lg font-black tracking-tight">
              Metadata Progress
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Informasi teknis laporan progress update.
            </p>
          </div>
        </div>

        <div className="grid gap-3 text-sm md:grid-cols-2">
          <div className="flex items-center justify-between gap-4 rounded-2xl border bg-card px-4 py-3">
            <span className="text-muted-foreground">Dibuat</span>
            <span className="text-right font-semibold">
              {formatDate(progress.createdAt)}
            </span>
          </div>

          <div className="flex items-center justify-between gap-4 rounded-2xl border bg-card px-4 py-3">
            <span className="text-muted-foreground">Diperbarui</span>
            <span className="text-right font-semibold">
              {formatDate(progress.updatedAt)}
            </span>
          </div>

          <div className="flex items-center justify-between gap-4 rounded-2xl border bg-card px-4 py-3">
            <span className="text-muted-foreground">Progress ID</span>
            <span className="max-w-48 truncate text-right font-semibold text-primary">
              {progress.id}
            </span>
          </div>

          <div className="flex items-center justify-between gap-4 rounded-2xl border bg-card px-4 py-3">
            <span className="text-muted-foreground">Program ID</span>
            <span className="max-w-48 truncate text-right font-semibold text-primary">
              {progress.program.id}
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}