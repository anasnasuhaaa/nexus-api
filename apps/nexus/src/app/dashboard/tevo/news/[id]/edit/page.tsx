import { prisma } from "@orma/database";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Newspaper } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  TevoArticleForm,
  TevoArticleInitialData,
} from "../../news-form";

type EditTevoArticlePageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditTevoArticlePage({
  params,
}: EditTevoArticlePageProps) {
  const { id } = await params;

  const article = await prisma.tevoArticle.findUnique({
    where: {
      id,
    },
  });

  if (!article) {
    notFound();
  }

  const initialData: TevoArticleInitialData = {
    articleId: article.id,
    title: article.title,
    slug: article.slug,
    excerpt: article.excerpt ?? "",
    content: article.content,
    coverUrl: article.coverUrl ?? "",
    status: article.status,
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
              Edit Artikel
            </h1>

            <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">
              Perbarui konten, slug, cover, dan status publikasi artikel Tevo.
            </p>
          </div>
        </div>
      </section>

      <TevoArticleForm mode="edit" initialData={initialData} />
    </div>
  );
}