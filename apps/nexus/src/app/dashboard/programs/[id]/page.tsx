import Link from "next/link";
import { notFound } from "next/navigation";
import { ArchiveProgramButton } from "./archive-program-button";
import { UnarchiveProgramButton } from "./unarchive-program-button";
import { DeleteProgramButton } from "./delete-program-button";
import { prisma } from "@orma/database";
import {
  Activity,
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  ExternalLink,
  FileText,
  Flag,
  Landmark,
  LinkIcon,
  Pencil,
  ShieldCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";

type ProgramDetailPageProps = {
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

async function getProgramDetail(id: string) {
  return prisma.program.findUnique({
    where: {
      id,
    },
    include: {
      birdep: {
        select: {
          name: true,
          code: true,
          unitType: true,
        },
      },
      createdBy: {
        select: {
          name: true,
          email: true,
        },
      },
      updatedBy: {
        select: {
          name: true,
          email: true,
        },
      },
      progressUpdates: {
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
        },
      },
    },
  });
}

export default async function ProgramDetailPage({
  params,
}: ProgramDetailPageProps) {
  const { id } = await params;
  const program = await getProgramDetail(id);

  if (!program) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="mb-4 flex flex-wrap gap-2">
              <Link href="/dashboard/programs">
                <Button variant="outline">
                  <ArrowLeft className="size-4 mr-2" />
                  Kembali
                </Button>
              </Link>

              {program.status !== "ARCHIVED" ? (
                <>
                  <Link href={`/dashboard/programs/${program.id}/edit`}>
                    <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                      <Pencil className="size-4 mr-2" />
                      Edit Program
                    </Button>
                  </Link>
                  <ArchiveProgramButton programId={program.id} />
                </>
              ) : (
                <>
                  <UnarchiveProgramButton programId={program.id} />
                  <DeleteProgramButton programId={program.id} />
                </>
              )}
            </div>

            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
              Detail Program Kerja
            </p>

            <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              {program.title}
            </h1>

            <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">
              {program.description}
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <span
                className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getProgramStatusClassName(
                  program.status,
                )}`}
              >
                {getProgramStatusLabel(program.status)}
              </span>

              <span className="inline-flex rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                {program.birdep.code}
              </span>

              {program.isPublishedToTevo ? (
                <span className="inline-flex rounded-full bg-status-active-soft px-2.5 py-1 text-xs font-semibold text-status-active">
                  Published to Tevo
                </span>
              ) : (
                <span className="inline-flex rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground">
                  Internal
                </span>
              )}
            </div>
          </div>

          <div className="w-full max-w-sm rounded-3xl border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-semibold text-primary">
                {program.progressPercent}%
              </span>
            </div>

            <div className="mt-3 h-3 rounded-full bg-primary/10">
              <div
                className="h-3 rounded-full bg-primary"
                style={{
                  width: `${program.progressPercent}%`,
                }}
              />
            </div>

            <p className="mt-3 text-xs leading-6 text-muted-foreground">
              Progress terakhir berdasarkan data program dan riwayat update yang
              sudah masuk ke Nexus.
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-3xl border bg-card p-5 shadow-sm">
          <div className="mb-4 flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Landmark className="size-5" />
          </div>

          <p className="text-sm font-medium text-muted-foreground">Birdep</p>
          <p className="mt-2 text-xl font-black tracking-tight">
            {program.birdep.name}
          </p>
          <p className="mt-2 text-xs leading-6 text-muted-foreground">
            {program.birdep.unitType}
          </p>
        </div>

        <div className="rounded-3xl border bg-card p-5 shadow-sm">
          <div className="mb-4 flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <CalendarDays className="size-5" />
          </div>

          <p className="text-sm font-medium text-muted-foreground">
            Periode Pelaksanaan
          </p>
          <p className="mt-2 text-sm font-bold">{formatDate(program.startDate)}</p>
          <p className="mt-2 text-xs leading-6 text-muted-foreground">
            s.d. {formatDate(program.endDate)}
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
            {program.progressUpdates.length}
          </p>
          <p className="mt-2 text-xs leading-6 text-muted-foreground">
            Laporan tersimpan
          </p>
        </div>

        <div className="rounded-3xl border bg-card p-5 shadow-sm">
          <div className="mb-4 flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <ShieldCheck className="size-5" />
          </div>

          <p className="text-sm font-medium text-muted-foreground">
            Publikasi Tevo
          </p>
          <p className="mt-2 text-xl font-black tracking-tight">
            {program.isPublishedToTevo ? "Published" : "Internal"}
          </p>
          <p className="mt-2 text-xs leading-6 text-muted-foreground">
            Status visibilitas publik
          </p>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border bg-card p-6 shadow-sm">
          <div className="mb-5 flex items-start gap-4">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <FileText className="size-5" />
            </div>

            <div>
              <h2 className="text-lg font-black tracking-tight">
                Informasi Program
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Deskripsi, tujuan, dan informasi publikasi program kerja.
              </p>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <p className="text-sm font-bold">Deskripsi</p>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">
                {program.description}
              </p>
            </div>

            <div>
              <p className="text-sm font-bold">Tujuan</p>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">
                {program.objective || "Belum ada tujuan program yang diisi."}
              </p>
            </div>

            <div>
              <p className="text-sm font-bold">Press Release</p>

              {program.pressReleaseUrl ? (
                <a
                  href={program.pressReleaseUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:underline"
                >
                  <ExternalLink className="size-4" />
                  Buka press release
                </a>
              ) : (
                <p className="mt-2 text-sm leading-7 text-muted-foreground">
                  Belum ada link press release.
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-3xl border bg-card p-6 shadow-sm">
          <div className="mb-5 flex items-start gap-4">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <LinkIcon className="size-5" />
            </div>

            <div>
              <h2 className="text-lg font-black tracking-tight">
                Metadata Program
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Informasi teknis yang dipakai untuk identifikasi data.
              </p>
            </div>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between gap-4 rounded-2xl border bg-card px-4 py-3">
              <span className="text-muted-foreground">Slug</span>
              <span className="font-semibold text-primary">{program.slug}</span>
            </div>

            <div className="flex items-center justify-between gap-4 rounded-2xl border bg-card px-4 py-3">
              <span className="text-muted-foreground">Dibuat oleh</span>
              <span className="text-right font-semibold">
                {program.createdBy?.name ?? "Tidak diketahui"}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4 rounded-2xl border bg-card px-4 py-3">
              <span className="text-muted-foreground">Diperbarui oleh</span>
              <span className="text-right font-semibold">
                {program.updatedBy?.name ?? "Tidak diketahui"}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4 rounded-2xl border bg-card px-4 py-3">
              <span className="text-muted-foreground">Dibuat</span>
              <span className="text-right font-semibold">
                {formatDate(program.createdAt)}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4 rounded-2xl border bg-card px-4 py-3">
              <span className="text-muted-foreground">Diperbarui</span>
              <span className="text-right font-semibold">
                {formatDate(program.updatedAt)}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border bg-card p-6 shadow-sm">
        <div className="mb-5 flex items-start gap-4">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Flag className="size-5" />
          </div>

          <div>
            <h2 className="text-lg font-black tracking-tight">
              Riwayat Progress Update
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Daftar laporan perkembangan yang terhubung dengan program ini.
            </p>
          </div>
        </div>

        {program.progressUpdates.length > 0 ? (
          <div className="space-y-3">
            {program.progressUpdates.map((progress) => (
              <div
                key={progress.id}
                className="rounded-2xl border bg-card p-4"
              >
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <h3 className="font-bold">{progress.title}</h3>

                    <p className="mt-1 text-xs text-muted-foreground">
                      {formatDate(progress.reportedAt)} ·{" "}
                      {progress.author?.name ?? "Tidak diketahui"}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
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
                  </div>
                </div>

                <p className="mt-4 text-sm leading-7 text-muted-foreground">
                  {progress.note}
                </p>

                {(progress.obstacle || progress.nextStep) && (
                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    <div className="rounded-2xl border bg-card p-4">
                      <p className="text-sm font-bold">Kendala</p>
                      <p className="mt-2 text-sm leading-7 text-muted-foreground">
                        {progress.obstacle || "Tidak ada kendala yang dicatat."}
                      </p>
                    </div>

                    <div className="rounded-2xl border bg-card p-4">
                      <p className="text-sm font-bold">Langkah Berikutnya</p>
                      <p className="mt-2 text-sm leading-7 text-muted-foreground">
                        {progress.nextStep ||
                          "Belum ada langkah berikutnya yang dicatat."}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border bg-card p-6 text-center">
            <p className="font-semibold">Belum ada progress update</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Progress update untuk program ini akan muncul setelah data
              ditambahkan melalui import atau form manual.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}