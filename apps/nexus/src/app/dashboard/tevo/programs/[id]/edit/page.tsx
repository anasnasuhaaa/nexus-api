import { prisma } from "@orma/database";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Globe2 } from "lucide-react";

import { Button } from "@/components/ui/button";

import { TevoProgramForm, TevoProgramInitialData } from "./tevo-program-form";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

function getProgramTitle(program: Record<string, unknown>) {
  return String(
    program.name ??
      program.title ??
      program.programName ??
      program.publicTitle ??
      "Tanpa Nama Program",
  );
}

export default async function EditTevoProgramPage({ params }: PageProps) {
  const { id } = await params;

  const program = await prisma.program.findUnique({
    where: {
      id,
    },
  });

  if (!program) {
    notFound();
  }

  const programRecord = program as unknown as Record<string, unknown>;
  const internalTitle = getProgramTitle(programRecord);

  const initialData: TevoProgramInitialData = {
    programId: program.id,
    internalTitle,
    publicTitle: program.publicTitle ?? internalTitle,
    publicSlug: program.publicSlug ?? "",
    publicSummary: program.publicSummary ?? "",
    publicDescription: program.publicDescription ?? "",
    publicCoverUrl: program.publicCoverUrl ?? "",
    isPublishedToTevo: program.isPublishedToTevo,
  };

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border bg-card p-6 shadow-sm">
        <div className="mb-4">
          <Link href="/dashboard/tevo/programs">
            <Button variant="outline">
              <ArrowLeft className="size-4" />
              Kembali ke Program Tevo
            </Button>
          </Link>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
            Tevo / Program Kerja
          </p>

          <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
            Kelola Konten Publik Program
          </h1>

          <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">
            Siapkan judul, slug, ringkasan, dan deskripsi publik untuk program{" "}
            <strong>{internalTitle}</strong>.
          </p>

          <div className="mt-5 inline-flex items-center gap-2 rounded-2xl border bg-background px-4 py-3 text-sm text-muted-foreground">
            <Globe2 className="size-4 text-primary" />
            Data ini akan digunakan oleh website publik Tevo.
          </div>
        </div>
      </section>

      <TevoProgramForm initialData={initialData} />
    </div>
  );
}