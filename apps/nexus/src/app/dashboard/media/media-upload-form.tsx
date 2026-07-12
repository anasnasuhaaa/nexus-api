"use client";

import { ImagePlus, Loader2, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import { uploadMediaAction } from "./media-action";

const CATEGORY_OPTIONS = [
  {
    value: "GENERAL",
    label: "General",
  },
  {
    value: "PROGRAM",
    label: "Program",
  },
  {
    value: "ARTICLE",
    label: "Artikel",
  },
  {
    value: "MEMBER",
    label: "Anggota",
  },
  {
    value: "ORGANIZATION",
    label: "Organisasi",
  },
  {
    value: "HERO",
    label: "Hero",
  },
];

export function MediaUploadForm() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    setIsSubmitting(true);

    const response = await uploadMediaAction(formData);

    setIsSubmitting(false);

    if (!response.success) {
      toast.error("Gagal upload media", {
        description: response.message,
        duration: 2000,
      });
      return;
    }

    toast.success("Media berhasil diupload", {
      description: response.message,
      duration: 2000,
    });

    formRef.current?.reset();
    router.refresh();
  }

  return (
    <section className="rounded-3xl border bg-card p-6 shadow-sm">
      <div className="mb-5 flex items-start gap-4">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <ImagePlus className="size-6" />
        </div>

        <div>
          <h2 className="font-black tracking-tight">Upload Media</h2>
          <p className="mt-1 text-sm leading-7 text-muted-foreground">
            Upload gambar untuk cover program, artikel, hero section, atau aset
            publik Tevo lainnya.
          </p>
        </div>
      </div>

      <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-2">
            <label htmlFor="file" className="text-sm font-semibold">
              File Gambar <span className="text-primary">*</span>
            </label>

            <input
              id="file"
              name="file"
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              required
              className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none file:mr-4 file:rounded-lg file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-primary-foreground"
            />

            <p className="text-xs leading-6 text-muted-foreground">
              Format: JPG, JPEG, PNG, WebP. Maksimal 4 MB per file.
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="category" className="text-sm font-semibold">
              Kategori
            </label>

            <select
              id="category"
              name="category"
              defaultValue="GENERAL"
              className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            >
              {CATEGORY_OPTIONS.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2 lg:col-span-2">
            <label htmlFor="altText" className="text-sm font-semibold">
              Alt Text
            </label>

            <input
              id="altText"
              name="altText"
              placeholder="Contoh: Dokumentasi kegiatan AngkasaKost"
              className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            />

            <p className="text-xs leading-6 text-muted-foreground">
              Alt text membantu aksesibilitas dan SEO website publik.
            </p>
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Mengupload...
              </>
            ) : (
              <>
                <Upload className="size-4" />
                Upload Media
              </>
            )}
          </Button>
        </div>
      </form>
    </section>
  );
}