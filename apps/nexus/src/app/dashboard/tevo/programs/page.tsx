import { prisma } from "@orma/database";
import Link from "next/link";
import { ArrowRight, Eye, EyeOff, FileText, Globe2 } from "lucide-react";

import { Button } from "@/components/ui/button";

function getProgramTitle(program: Record<string, unknown>) {
  return String(
    program.name ??
      program.title ??
      program.programName ??
      program.publicTitle ??
      "Tanpa Nama Program",
  );
}

function formatDateTime(date: Date | null | undefined) {
  if (!date) return "-";

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default async function TevoProgramsPage() {
  const programs = await prisma.program.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  const publishedCount = programs.filter(
    (program) => program.isPublishedToTevo,
  ).length;

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
              Tevo / Program Kerja
            </p>

            <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              Publikasi Program Kerja
            </h1>

            <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">
              Kelola versi publik dari program kerja yang akan tampil di
              website Tevo. Data internal tetap dikelola dari menu Program
              Kerja Nexus.
            </p>
          </div>

          <Link href="/dashboard/programs">
            <Button variant="outline">
              <FileText className="size-4" />
              Data Internal Program
            </Button>
          </Link>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-3xl border bg-card p-5 shadow-sm">
          <div className="mb-4 flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <FileText className="size-5" />
          </div>
          <p className="text-sm text-muted-foreground">Total Program</p>
          <p className="mt-2 text-3xl font-black tracking-tight">
            {programs.length}
          </p>
        </div>

        <div className="rounded-3xl border bg-card p-5 shadow-sm">
          <div className="mb-4 flex size-11 items-center justify-center rounded-2xl bg-status-active-soft text-status-active">
            <Eye className="size-5" />
          </div>
          <p className="text-sm text-muted-foreground">Published</p>
          <p className="mt-2 text-3xl font-black tracking-tight">
            {publishedCount}
          </p>
        </div>

        <div className="rounded-3xl border bg-card p-5 shadow-sm">
          <div className="mb-4 flex size-11 items-center justify-center rounded-2xl bg-status-inactive-soft text-status-inactive">
            <EyeOff className="size-5" />
          </div>
          <p className="text-sm text-muted-foreground">Draft / Hidden</p>
          <p className="mt-2 text-3xl font-black tracking-tight">
            {programs.length - publishedCount}
          </p>
        </div>
      </section>

      <section className="rounded-3xl border bg-card p-5 shadow-sm">
        <div className="mb-5">
          <h2 className="font-black tracking-tight">Daftar Program Publik</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Atur konten publik masing-masing program.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left">Program Internal</th>
                  <th className="px-4 py-3 text-left">Judul Publik</th>
                  <th className="px-4 py-3 text-left">Slug</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Publish Terakhir</th>
                  <th className="px-4 py-3 text-center">Aksi</th>
                </tr>
              </thead>

              <tbody>
                {programs.length ? (
                  programs.map((program) => {
                    const programRecord =
                      program as unknown as Record<string, unknown>;

                    return (
                      <tr key={program.id} className="border-t">
                        <td className="px-4 py-3 font-semibold">
                          {getProgramTitle(programRecord)}
                        </td>

                        <td className="px-4 py-3 text-muted-foreground">
                          {program.publicTitle ?? "-"}
                        </td>

                        <td className="px-4 py-3 text-muted-foreground">
                          {program.publicSlug ?? "-"}
                        </td>

                        <td className="px-4 py-3">
                          {program.isPublishedToTevo ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-status-active-soft px-2.5 py-1 text-xs font-semibold text-status-active">
                              <Eye className="size-3.5" />
                              Published
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-status-inactive-soft px-2.5 py-1 text-xs font-semibold text-status-inactive">
                              <EyeOff className="size-3.5" />
                              Draft
                            </span>
                          )}
                        </td>

                        <td className="px-4 py-3 text-muted-foreground">
                          {formatDateTime(program.publishedToTevoAt)}
                        </td>

                        <td className="px-4 py-3 text-center">
                          <Link
                            href={`/dashboard/tevo/programs/${program.id}/edit`}
                          >
                            <Button variant="outline" size="sm">
                              <Globe2 className="size-4" />
                              Kelola
                              <ArrowRight className="size-4" />
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="h-24 px-4 py-3 text-center text-muted-foreground"
                    >
                      Belum ada program kerja di Nexus.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}