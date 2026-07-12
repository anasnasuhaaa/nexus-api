"use client";

import { ArrowLeft, Loader2, Save } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import {
  createTevoArticleAction,
  updateTevoArticleAction,
} from "./news-action";

type ArticleStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export type TevoArticleInitialData = {
  articleId: string | null;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverUrl: string;
  status: ArticleStatus;
};

type TevoArticleFormProps = {
  mode: "create" | "edit";
  initialData: TevoArticleInitialData;
};

const STATUS_OPTIONS: {
  value: ArticleStatus;
  label: string;
  description: string;
}[] = [
  {
    value: "DRAFT",
    label: "Draft",
    description: "Belum tampil di website publik.",
  },
  {
    value: "PUBLISHED",
    label: "Published",
    description: "Artikel siap dibuka untuk website publik Tevo.",
  },
  {
    value: "ARCHIVED",
    label: "Archived",
    description: "Artikel disimpan sebagai arsip dan tidak tampil di publik.",
  },
];

function generateSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function TevoArticleForm({
  mode,
  initialData,
}: TevoArticleFormProps) {
  const router = useRouter();

  const [title, setTitle] = useState(initialData.title);
  const [slug, setSlug] = useState(initialData.slug);
  const [excerpt, setExcerpt] = useState(initialData.excerpt);
  const [content, setContent] = useState(initialData.content);
  const [coverUrl, setCoverUrl] = useState(initialData.coverUrl);
  const [status, setStatus] = useState<ArticleStatus>(initialData.status);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const previewUrl = useMemo(() => {
    if (!slug.trim()) {
      return "-";
    }

    return `/berita/${generateSlug(slug)}`;
  }, [slug]);

  function handleTitleChange(value: string) {
    setTitle(value);

    if (!initialData.slug && !slug.trim()) {
      setSlug(generateSlug(value));
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsSubmitting(true);

    const payload = {
      articleId: initialData.articleId ?? undefined,
      title,
      slug,
      excerpt,
      content,
      coverUrl,
      status,
    };

    const response =
      mode === "create"
        ? await createTevoArticleAction(payload)
        : await updateTevoArticleAction(payload);

    setIsSubmitting(false);

    if (!response.success) {
      toast.error("Gagal menyimpan artikel", {
        description: response.message,
        duration: 2000,
      });
      return;
    }

    toast.success("Artikel berhasil disimpan", {
      description: response.message,
      duration: 2000,
    });

    router.replace("/dashboard/tevo/news");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <section className="rounded-3xl border bg-card p-6 shadow-sm">
        <div className="mb-5">
          <h2 className="font-black tracking-tight">Status Artikel</h2>
          <p className="mt-1 text-sm leading-7 text-muted-foreground">
            Tentukan apakah artikel masih draft, sudah published, atau
            diarsipkan.
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          {STATUS_OPTIONS.map((option) => {
            const active = status === option.value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setStatus(option.value)}
                className={
                  active
                    ? "rounded-2xl border border-primary bg-primary/10 p-4 text-left text-primary"
                    : "rounded-2xl border bg-background p-4 text-left text-muted-foreground transition hover:bg-muted"
                }
              >
                <p className="font-black">{option.label}</p>
                <p className="mt-1 text-xs leading-6">{option.description}</p>
              </button>
            );
          })}
        </div>
      </section>

      <section className="rounded-3xl border bg-card p-6 shadow-sm">
        <div className="mb-5">
          <h2 className="font-black tracking-tight">Konten Artikel</h2>
          <p className="mt-1 text-sm leading-7 text-muted-foreground">
            Isi konten berita atau artikel yang akan digunakan oleh website
            publik Tevo.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <Field label="Judul Artikel" htmlFor="title" required>
            <input
              id="title"
              value={title}
              onChange={(event) => handleTitleChange(event.target.value)}
              placeholder="Contoh: Launching Program Kerja Astana Angkasa"
              className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </Field>

          <Field label="Slug Artikel" htmlFor="slug" required>
            <input
              id="slug"
              value={slug}
              onChange={(event) => setSlug(generateSlug(event.target.value))}
              placeholder="contoh: launching-program-kerja"
              className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
            <p className="text-xs text-muted-foreground">
              Preview URL: {previewUrl}
            </p>
          </Field>

          <div className="lg:col-span-2">
            <Field label="Excerpt / Ringkasan" htmlFor="excerpt">
              <textarea
                id="excerpt"
                value={excerpt}
                onChange={(event) => setExcerpt(event.target.value)}
                placeholder="Ringkasan pendek untuk card berita."
                rows={3}
                className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </Field>
          </div>

          <div className="lg:col-span-2">
            <Field label="Isi Artikel" htmlFor="content" required>
              <textarea
                id="content"
                value={content}
                onChange={(event) => setContent(event.target.value)}
                placeholder="Tulis isi artikel di sini..."
                rows={12}
                className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </Field>
          </div>

          <div className="lg:col-span-2">
            <Field label="Cover Image URL" htmlFor="coverUrl">
              <input
                id="coverUrl"
                value={coverUrl}
                onChange={(event) => setCoverUrl(event.target.value)}
                placeholder="https://..."
                className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
              <p className="text-xs text-muted-foreground">
                Sementara gunakan URL gambar. Setelah Media Library dibuat,
                field ini bisa diganti menjadi Media Picker.
              </p>
            </Field>
          </div>
        </div>
      </section>

      <section className="flex flex-col-reverse gap-2 rounded-3xl border bg-card p-5 shadow-sm sm:flex-row sm:justify-end">
        <Link href="/dashboard/tevo/news">
          <Button type="button" variant="outline">
            <ArrowLeft className="size-4" />
            Batal
          </Button>
        </Link>

        <Button
          type="submit"
          disabled={isSubmitting || !title.trim() || !slug.trim() || !content.trim()}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Menyimpan...
            </>
          ) : (
            <>
              <Save className="size-4" />
              Simpan Artikel
            </>
          )}
        </Button>
      </section>
    </form>
  );
}

type FieldProps = {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
  required?: boolean;
};

function Field({ label, htmlFor, children, required = false }: FieldProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={htmlFor} className="text-sm font-semibold">
        {label}
        {required ? <span className="text-primary"> *</span> : null}
      </label>

      {children}
    </div>
  );
}