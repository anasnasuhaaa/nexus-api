import { prisma } from "@orma/database";
import Link from "next/link";
import {
  Archive,
  ArrowRight,
  Eye,
  FileText,
  Newspaper,
  PlusCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";

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

function getStatusBadge(status: string) {
  if (status === "PUBLISHED") {
    return (
      <span className="inline-flex rounded-full bg-status-active-soft px-2.5 py-1 text-xs font-semibold text-status-active">
        Published
      </span>
    );
  }

  if (status === "ARCHIVED") {
    return (
      <span className="inline-flex rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground">
        Archived
      </span>
    );
  }

  return (
    <span className="inline-flex rounded-full bg-status-inactive-soft px-2.5 py-1 text-xs font-semibold text-status-inactive">
      Draft
    </span>
  );
}

export default async function TevoNewsPage() {
  const articles = await prisma.tevoArticle.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  const publishedCount = articles.filter(
    (article) => article.status === "PUBLISHED",
  ).length;

  const draftCount = articles.filter(
    (article) => article.status === "DRAFT",
  ).length;

  const archivedCount = articles.filter(
    (article) => article.status === "ARCHIVED",
  ).length;

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
              Tevo / CMS Berita
            </p>

            <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              CMS Berita & Artikel
            </h1>

            <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">
              Kelola berita, artikel, dan publikasi yang akan tampil di website
              publik Tevo.
            </p>
          </div>

          <Link href="/dashboard/tevo/news/new">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <PlusCircle className="size-4" />
              Tambah Artikel
            </Button>
          </Link>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-4">
        <div className="rounded-3xl border bg-card p-5 shadow-sm">
          <div className="mb-4 flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Newspaper className="size-5" />
          </div>
          <p className="text-sm text-muted-foreground">Total Artikel</p>
          <p className="mt-2 text-3xl font-black tracking-tight">
            {articles.length}
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
            <FileText className="size-5" />
          </div>
          <p className="text-sm text-muted-foreground">Draft</p>
          <p className="mt-2 text-3xl font-black tracking-tight">
            {draftCount}
          </p>
        </div>

        <div className="rounded-3xl border bg-card p-5 shadow-sm">
          <div className="mb-4 flex size-11 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
            <Archive className="size-5" />
          </div>
          <p className="text-sm text-muted-foreground">Archived</p>
          <p className="mt-2 text-3xl font-black tracking-tight">
            {archivedCount}
          </p>
        </div>
      </section>

      <section className="rounded-3xl border bg-card p-5 shadow-sm">
        <div className="mb-5">
          <h2 className="font-black tracking-tight">Daftar Artikel</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Artikel dapat disimpan sebagai draft, dipublish, atau diarsipkan.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left">Judul</th>
                  <th className="px-4 py-3 text-left">Slug</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Author</th>
                  <th className="px-4 py-3 text-left">Published</th>
                  <th className="px-4 py-3 text-center">Aksi</th>
                </tr>
              </thead>

              <tbody>
                {articles.length ? (
                  articles.map((article) => (
                    <tr key={article.id} className="border-t">
                      <td className="max-w-sm px-4 py-3">
                        <p className="font-semibold">{article.title}</p>
                        {article.excerpt ? (
                          <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">
                            {article.excerpt}
                          </p>
                        ) : null}
                      </td>

                      <td className="px-4 py-3 text-muted-foreground">
                        {article.slug}
                      </td>

                      <td className="px-4 py-3">
                        {getStatusBadge(article.status)}
                      </td>

                      <td className="px-4 py-3 text-muted-foreground">
                        {article.authorName ?? "-"}
                      </td>

                      <td className="px-4 py-3 text-muted-foreground">
                        {formatDateTime(article.publishedAt)}
                      </td>

                      <td className="px-4 py-3 text-center">
                        <Link
                          href={`/dashboard/tevo/news/${article.id}/edit`}
                        >
                          <Button variant="outline" size="sm">
                            Edit
                            <ArrowRight className="size-4" />
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="h-24 px-4 py-3 text-center text-muted-foreground"
                    >
                      Belum ada artikel Tevo.
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