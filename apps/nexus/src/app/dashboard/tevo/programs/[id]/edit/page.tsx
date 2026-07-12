import { prisma } from "@orma/database";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Globe2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { MediaPickerItem } from "@/components/media/media-picker";

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

function formatDateTime(date: Date | null | undefined) {
  if (!date) {
    return "-";
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

async function getMediaPickerItems(): Promise<MediaPickerItem[]> {
  const media = await prisma.mediaAsset.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      originalName: true,
      url: true,
      altText: true,
      category: true,
      createdAt: true,
    },
  });

  return media.map((item) => ({
    id: item.id,
    originalName: item.originalName,
    url: item.url,
    altText: item.altText,
    category: item.category,
    createdAtLabel: formatDateTime(item.createdAt),
  }));
}

export default async function EditTevoProgramPage({ params }: PageProps) {
  const { id } = await params;

  const [program, mediaAssets] = await Promise.all([
    prisma.program.findUnique({
      where: {
        id,
      },
    }),
    getMediaPickerItems(),
  ]);

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
            Siapkan judul, slug, ringkasan, deskripsi, dan cover publik untuk
            program <strong>{internalTitle}</strong>.
          </p>

          <div className="mt-5 inline-flex items-center gap-2 rounded-2xl border bg-background px-4 py-3 text-sm text-muted-foreground">
            <Globe2 className="size-4 text-primary" />
            Cover program diambil dari Media Library Nexus.
          </div>
        </div>
      </section>

      <TevoProgramForm
        initialData={initialData}
        mediaAssets={mediaAssets}
      />
    </div>
  );
}