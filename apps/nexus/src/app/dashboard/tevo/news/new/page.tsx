import Link from "next/link";
import { ArrowLeft, Newspaper } from "lucide-react";

import { Button } from "@/components/ui/button";

import { TevoArticleForm, TevoArticleInitialData } from "../news-form";

export default function NewTevoArticlePage() {
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
              Buat artikel baru untuk website publik Tevo.
            </p>
          </div>
        </div>
      </section>

      <TevoArticleForm mode="create" initialData={initialData} />
    </div>
  );
}