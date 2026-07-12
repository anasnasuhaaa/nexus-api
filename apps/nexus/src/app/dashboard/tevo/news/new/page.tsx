import { prisma } from "@orma/database";
import Link from "next/link";
import { ArrowLeft, Newspaper } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { MediaPickerItem } from "@/components/media/media-picker";

import { TevoArticleForm, TevoArticleInitialData } from "../news-form";

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

export default async function NewTevoArticlePage() {
  const mediaAssets = await getMediaPickerItems();

  const initialData: TevoArticleInitialData = {
    articleId: null,
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    coverUrl: "",
    status: "DRAFT",
  };

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border bg-card p-6 shadow-sm">
        <div className="mb-4">
          <Link href="/dashboard/tevo/news">
            <Button variant="outline">
              <ArrowLeft className="size-4" />
              Kembali ke CMS Berita
            </Button>
          </Link>
        </div>

        <div className="flex items-start gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Newspaper className="size-6" />
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
              Tevo / CMS Berita
            </p>

            <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              Tambah Artikel
            </h1>

            <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">
              Buat artikel baru untuk website publik Tevo. Cover artikel
              diambil dari Media Library.
            </p>
          </div>
        </div>
      </section>

      <TevoArticleForm
        mode="create"
        initialData={initialData}
        mediaAssets={mediaAssets}
      />
    </div>
  );
}