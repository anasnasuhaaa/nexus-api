import Link from "next/link";
import { prisma } from "@orma/database";
import { ArrowLeft, Activity } from "lucide-react";

import { Button } from "@/components/ui/button";

import { ProgressForm } from "./progress-form";

type NewProgressPageProps = {
  searchParams: Promise<{
    programId?: string;
  }>;
};

async function getPrograms() {
  return prisma.program.findMany({
    where: {
      status: {
        not: "ARCHIVED",
      },
    },
    orderBy: [
      {
        birdep: {
          code: "asc",
        },
      },
      {
        title: "asc",
      },
    ],
    select: {
      id: true,
      title: true,
      slug: true,
      progressPercent: true,
      birdep: {
        select: {
          code: true,
          name: true,
        },
      },
    },
  });
}

export default async function NewProgressPage({
  searchParams,
}: NewProgressPageProps) {
  const { programId } = await searchParams;
  const programs = await getPrograms();

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
              Progress Update
            </p>

            <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              Tambah Progress Update
            </h1>

            <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">
              Tambahkan laporan perkembangan program kerja secara manual.
              Laporan ini akan tersimpan sebagai riwayat dan memperbarui capaian
              program terkait.
            </p>
          </div>

          <Link href="/dashboard/progress">
            <Button variant="outline">
              <ArrowLeft className="size-4" />
              Kembali
            </Button>
          </Link>
        </div>
      </section>

      <section className="rounded-3xl border bg-card p-5 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Activity className="size-5" />
          </div>

          <div>
            <h2 className="font-black tracking-tight">Panduan Singkat</h2>
            <p className="mt-1 text-sm leading-7 text-muted-foreground">
              Program berstatus ARCHIVED tidak dapat ditambahkan progress baru.
              Jika status progress dipilih DONE, status program akan otomatis
              menjadi Selesai.
            </p>
          </div>
        </div>
      </section>

      <ProgressForm
        defaultProgramId={programId}
        programs={programs.map((program) => ({
          id: program.id,
          title: program.title,
          slug: program.slug,
          birdepCode: program.birdep.code,
          birdepName: program.birdep.name,
          progressPercent: program.progressPercent,
        }))}
      />
    </div>
  );
}