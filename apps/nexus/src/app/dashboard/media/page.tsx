import { prisma } from "@orma/database";
import { FileImage, ImageIcon, Layers, Upload } from "lucide-react";

import { MediaGrid, MediaGridItem } from "./media-grid";
import { MediaUploadForm } from "./media-upload-form";

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

function formatCategory(category: string) {
  return category
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

async function getMedia() {
  const media = await prisma.mediaAsset.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return media.map(
    (item): MediaGridItem => ({
      id: item.id,
      fileName: item.fileName,
      originalName: item.originalName,
      mimeType: item.mimeType,
      sizeBytes: item.sizeBytes,
      url: item.url,
      altText: item.altText,
      category: item.category,
      uploadedByName: item.uploadedByName,
      createdAtLabel: formatDateTime(item.createdAt),
    }),
  );
}

async function getMediaStats() {
  const [totalMedia, programMedia, articleMedia, heroMedia] =
    await Promise.all([
      prisma.mediaAsset.count(),
      prisma.mediaAsset.count({
        where: {
          category: "PROGRAM",
        },
      }),
      prisma.mediaAsset.count({
        where: {
          category: "ARTICLE",
        },
      }),
      prisma.mediaAsset.count({
        where: {
          category: "HERO",
        },
      }),
    ]);

  return {
    totalMedia,
    programMedia,
    articleMedia,
    heroMedia,
  };
}

async function getCategoryBreakdown() {
  const categories = await prisma.mediaAsset.groupBy({
    by: ["category"],
    _count: {
      category: true,
    },
    orderBy: {
      category: "asc",
    },
  });

  return categories.map((item) => ({
    category: item.category,
    label: formatCategory(item.category),
    count: item._count.category,
  }));
}

export default async function MediaPage() {
  const [media, stats, categoryBreakdown] = await Promise.all([
    getMedia(),
    getMediaStats(),
    getCategoryBreakdown(),
  ]);

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
              Media Library
            </p>

            <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              Kelola Media Gambar
            </h1>

            <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">
              Upload dan kelola gambar yang akan digunakan untuk konten Tevo,
              seperti cover program, cover artikel, hero image, dan aset
              organisasi.
            </p>
          </div>

        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-4">
        <div className="rounded-3xl border bg-card p-5 shadow-sm">
          <div className="mb-4 flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <ImageIcon className="size-5" />
          </div>
          <p className="text-sm text-muted-foreground">Total Media</p>
          <p className="mt-2 text-3xl font-black tracking-tight">
            {stats.totalMedia}
          </p>
        </div>

        <div className="rounded-3xl border bg-card p-5 shadow-sm">
          <div className="mb-4 flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <FileImage className="size-5" />
          </div>
          <p className="text-sm text-muted-foreground">Program</p>
          <p className="mt-2 text-3xl font-black tracking-tight">
            {stats.programMedia}
          </p>
        </div>

        <div className="rounded-3xl border bg-card p-5 shadow-sm">
          <div className="mb-4 flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Layers className="size-5" />
          </div>
          <p className="text-sm text-muted-foreground">Artikel</p>
          <p className="mt-2 text-3xl font-black tracking-tight">
            {stats.articleMedia}
          </p>
        </div>

        <div className="rounded-3xl border bg-card p-5 shadow-sm">
          <div className="mb-4 flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Upload className="size-5" />
          </div>
          <p className="text-sm text-muted-foreground">Hero</p>
          <p className="mt-2 text-3xl font-black tracking-tight">
            {stats.heroMedia}
          </p>
        </div>
      </section>

      {categoryBreakdown.length ? (
        <section className="rounded-3xl border bg-card p-5 shadow-sm">
          <div className="mb-4">
            <h2 className="font-black tracking-tight">Ringkasan Kategori</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Jumlah media berdasarkan kategori.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {categoryBreakdown.map((item) => (
              <span
                key={item.category}
                className="inline-flex rounded-full bg-muted px-3 py-1 text-sm font-semibold text-muted-foreground"
              >
                {item.label}: {item.count}
              </span>
            ))}
          </div>
        </section>
      ) : null}

      <MediaUploadForm />

      <section className="space-y-4">
        <div>
          <h2 className="font-black tracking-tight">Daftar Media</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Copy URL media untuk digunakan sementara pada cover program atau
            artikel. Stage berikutnya akan mengganti ini dengan Media Picker.
          </p>
        </div>

        <MediaGrid media={media} />
      </section>
    </div>
  );
}