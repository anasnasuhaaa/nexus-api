"use client";

import Image from "next/image";
import { Check, Copy, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import { deleteMediaAction } from "./media-action";

export type MediaGridItem = {
  id: string;
  fileName: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  url: string;
  altText: string | null;
  category: string;
  uploadedByName: string | null;
  createdAtLabel: string;
};

type MediaGridProps = {
  media: MediaGridItem[];
};

function formatFileSize(sizeBytes: number) {
  if (sizeBytes < 1024) {
    return `${sizeBytes} B`;
  }

  if (sizeBytes < 1024 * 1024) {
    return `${(sizeBytes / 1024).toFixed(1)} KB`;
  }

  return `${(sizeBytes / 1024 / 1024).toFixed(1)} MB`;
}

function formatCategory(category: string) {
  return category
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function MediaGrid({ media }: MediaGridProps) {
  const router = useRouter();

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleCopy(item: MediaGridItem) {
    await navigator.clipboard.writeText(item.url);

    setCopiedId(item.id);

    toast.success("URL media disalin", {
      description: item.url,
      duration: 2000,
    });

    window.setTimeout(() => {
      setCopiedId(null);
    }, 1500);
  }

  async function handleDelete(item: MediaGridItem) {
    const confirmed = window.confirm(
      `Hapus media "${item.originalName}"? File akan dihapus dari storage dan database.`,
    );

    if (!confirmed) {
      return;
    }

    setDeletingId(item.id);

    const response = await deleteMediaAction(item.id);

    setDeletingId(null);

    if (!response.success) {
      toast.error("Gagal menghapus media", {
        description: response.message,
        duration: 2000,
      });
      return;
    }

    toast.success("Media berhasil dihapus", {
      description: response.message,
      duration: 2000,
    });

    router.refresh();
  }

  if (!media.length) {
    return (
      <section className="rounded-3xl border border-dashed bg-card p-8 text-center shadow-sm">
        <p className="font-black tracking-tight">Belum ada media</p>
        <p className="mt-2 text-sm leading-7 text-muted-foreground">
          Upload gambar pertama untuk mulai membangun Media Library Nexus.
        </p>
      </section>
    );
  }

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {media.map((item) => (
        <article
          key={item.id}
          className="overflow-hidden rounded-3xl border bg-card shadow-sm"
        >
          <div className="relative aspect-video bg-muted">
            <Image
              src={item.url}
              alt={item.altText ?? item.originalName}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
              className="object-cover"
            />
          </div>

          <div className="space-y-4 p-4">
            <div>
              <div className="mb-2 flex flex-wrap gap-2">
                <span className="inline-flex rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                  {formatCategory(item.category)}
                </span>

                <span className="inline-flex rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground">
                  {formatFileSize(item.sizeBytes)}
                </span>
              </div>

              <h2 className="line-clamp-1 font-black tracking-tight">
                {item.originalName}
              </h2>

              <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                {item.url}
              </p>
            </div>

            <div className="grid gap-2 text-xs text-muted-foreground">
              <div>
                <span className="font-semibold text-foreground">
                  Uploaded:
                </span>{" "}
                {item.createdAtLabel}
              </div>

              <div>
                <span className="font-semibold text-foreground">
                  Uploader:
                </span>{" "}
                {item.uploadedByName ?? "-"}
              </div>

              {item.altText ? (
                <div>
                  <span className="font-semibold text-foreground">
                    Alt:
                  </span>{" "}
                  {item.altText}
                </div>
              ) : null}
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleCopy(item)}
                className="flex-1"
              >
                {copiedId === item.id ? (
                  <Check className="size-4" />
                ) : (
                  <Copy className="size-4" />
                )}
                Copy URL
              </Button>

              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={deletingId === item.id}
                onClick={() => handleDelete(item)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}