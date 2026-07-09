"use client";

import { ArrowLeft, Eye, EyeOff, Loader2, Save } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import { updateTevoProgramAction } from "./tevo-program-action";

export type TevoProgramInitialData = {
  programId: string;
  internalTitle: string;
  publicTitle: string;
  publicSlug: string;
  publicSummary: string;
  publicDescription: string;
  publicCoverUrl: string;
  isPublishedToTevo: boolean;
};

type TevoProgramFormProps = {
  initialData: TevoProgramInitialData;
};

function generateSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function TevoProgramForm({ initialData }: TevoProgramFormProps) {
  const router = useRouter();

  const [publicTitle, setPublicTitle] = useState(initialData.publicTitle);
  const [publicSlug, setPublicSlug] = useState(initialData.publicSlug);
  const [publicSummary, setPublicSummary] = useState(
    initialData.publicSummary,
  );
  const [publicDescription, setPublicDescription] = useState(
    initialData.publicDescription,
  );
  const [publicCoverUrl, setPublicCoverUrl] = useState(
    initialData.publicCoverUrl,
  );
  const [isPublishedToTevo, setIsPublishedToTevo] = useState(
    initialData.isPublishedToTevo,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const previewUrl = useMemo(() => {
    if (!publicSlug.trim()) {
      return "-";
    }

    return `/program-kerja/${generateSlug(publicSlug)}`;
  }, [publicSlug]);

  function handleTitleChange(value: string) {
    setPublicTitle(value);

    if (!initialData.publicSlug && !publicSlug.trim()) {
      setPublicSlug(generateSlug(value));
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsSubmitting(true);

    const response = await updateTevoProgramAction({
      programId: initialData.programId,
      publicTitle,
      publicSlug,
      publicSummary,
      publicDescription,
      publicCoverUrl,
      isPublishedToTevo,
    });

    setIsSubmitting(false);

    if (!response.success) {
      toast.error("Gagal menyimpan konten Tevo", {
        description: response.message,
        duration: 2000,
      });
      return;
    }

    toast.success("Konten Tevo diperbarui", {
      description: response.message,
      duration: 2000,
    });

    router.replace("/dashboard/tevo/programs");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <section className="rounded-3xl border bg-card p-6 shadow-sm">
        <div className="mb-5">
          <h2 className="font-black tracking-tight">Status Publikasi</h2>
          <p className="mt-1 text-sm leading-7 text-muted-foreground">
            Program internal: <strong>{initialData.internalTitle}</strong>
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsPublishedToTevo((value) => !value)}
          className={
            isPublishedToTevo
              ? "flex w-full items-start gap-4 rounded-2xl border border-status-active/20 bg-status-active-soft p-4 text-left text-status-active"
              : "flex w-full items-start gap-4 rounded-2xl border bg-muted/40 p-4 text-left text-muted-foreground"
          }
        >
          <div
            className={
              isPublishedToTevo
                ? "flex size-10 shrink-0 items-center justify-center rounded-xl bg-status-active text-white"
                : "flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground"
            }
          >
            {isPublishedToTevo ? (
              <Eye className="size-5" />
            ) : (
              <EyeOff className="size-5" />
            )}
          </div>

          <div>
            <p className="font-black">
              {isPublishedToTevo
                ? "Tampil di website Tevo"
                : "Belum tampil di website Tevo"}
            </p>
            <p className="mt-1 text-sm leading-7">
              {isPublishedToTevo
                ? "Program ini akan dibuka untuk endpoint publik Tevo."
                : "Konten dapat disimpan sebagai draft terlebih dahulu."}
            </p>
          </div>
        </button>
      </section>

      <section className="rounded-3xl border bg-card p-6 shadow-sm">
        <div className="mb-5">
          <h2 className="font-black tracking-tight">Konten Publik Program</h2>
          <p className="mt-1 text-sm leading-7 text-muted-foreground">
            Isi konten versi publik yang akan dibaca oleh website Tevo.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <Field label="Judul Publik" htmlFor="publicTitle" required>
            <input
              id="publicTitle"
              value={publicTitle}
              onChange={(event) => handleTitleChange(event.target.value)}
              placeholder="Contoh: AngkasaKost"
              className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </Field>

          <Field label="Slug Publik" htmlFor="publicSlug" required>
            <input
              id="publicSlug"
              value={publicSlug}
              onChange={(event) => setPublicSlug(generateSlug(event.target.value))}
              placeholder="contoh: angkasakost"
              className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
            <p className="text-xs text-muted-foreground">
              Preview URL: {previewUrl}
            </p>
          </Field>

          <div className="lg:col-span-2">
            <Field label="Ringkasan Publik" htmlFor="publicSummary" required>
              <textarea
                id="publicSummary"
                value={publicSummary}
                onChange={(event) => setPublicSummary(event.target.value)}
                rows={3}
                placeholder="Ringkasan pendek untuk card program."
                className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </Field>
          </div>

          <div className="lg:col-span-2">
            <Field
              label="Deskripsi Publik"
              htmlFor="publicDescription"
              required
            >
              <textarea
                id="publicDescription"
                value={publicDescription}
                onChange={(event) => setPublicDescription(event.target.value)}
                rows={8}
                placeholder="Deskripsi lengkap untuk halaman detail program."
                className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </Field>
          </div>

          <div className="lg:col-span-2">
            <Field label="Cover Image URL" htmlFor="publicCoverUrl">
              <input
                id="publicCoverUrl"
                value={publicCoverUrl}
                onChange={(event) => setPublicCoverUrl(event.target.value)}
                placeholder="https://..."
                className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </Field>
          </div>
        </div>
      </section>

      <section className="flex flex-col-reverse gap-2 rounded-3xl border bg-card p-5 shadow-sm sm:flex-row sm:justify-end">
        <Link href="/dashboard/tevo/programs">
          <Button type="button" variant="outline">
            <ArrowLeft className="size-4" />
            Batal
          </Button>
        </Link>

        <Button
          type="submit"
          disabled={
            isSubmitting ||
            (isPublishedToTevo &&
              (!publicTitle.trim() ||
                !publicSlug.trim() ||
                !publicSummary.trim() ||
                !publicDescription.trim()))
          }
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
              Simpan Konten
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