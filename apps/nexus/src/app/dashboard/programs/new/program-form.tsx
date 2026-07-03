"use client";

import { FormEvent, useState } from "react";
import { Loader2, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import { createProgramAction } from "./actions";

type BirdepOption = {
  id: string;
  name: string;
  code: string;
};

type ProgramFormProps = {
  birdeps: BirdepOption[];
};

export function ProgramForm({ birdeps }: ProgramFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    setIsSubmitting(true);
    const response = await createProgramAction(formData);
    setIsSubmitting(false);

    if (!response.success) {
      toast.error("Gagal membuat program", {
        description: response.message,
        duration: 2000,
      });
      return;
    }

    toast.success("Program berhasil ditambahkan", {
      description: response.message,
      duration: 2000,
    });

    window.location.assign("/dashboard/programs");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <section className="rounded-3xl border bg-card p-6 shadow-sm">
        <div className="mb-5">
          <h2 className="font-black tracking-tight">Informasi Utama</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Isi identitas dasar program kerja.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-semibold">
              Nama Program Kerja
            </label>
            <input
              id="title"
              name="title"
              required
              placeholder="Contoh: AngkasaKost"
              className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="slug" className="text-sm font-semibold">
              Slug
            </label>
            <input
              id="slug"
              name="slug"
              placeholder="Contoh: angkasa-kost"
              className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
            <p className="text-xs text-muted-foreground">
              Jika dikosongkan, sistem akan membuat slug dari nama program.
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="birdepId" className="text-sm font-semibold">
              Birdep Pemilik
            </label>
            <select
              id="birdepId"
              name="birdepId"
              required
              className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Pilih Birdep</option>
              {birdeps.map((birdep) => (
                <option key={birdep.id} value={birdep.id}>
                  {birdep.code} — {birdep.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="status" className="text-sm font-semibold">
              Status
            </label>
            <select
              id="status"
              name="status"
              defaultValue="PLANNED"
              className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="PLANNED">Direncanakan</option>
              <option value="ONGOING">Berjalan</option>
              <option value="COMPLETED">Selesai</option>
              <option value="CANCELLED">Dibatalkan</option>
              <option value="ARCHIVED">Diarsipkan</option>
            </select>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border bg-card p-6 shadow-sm">
        <div className="mb-5">
          <h2 className="font-black tracking-tight">Deskripsi Program</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Jelaskan konteks dan tujuan program kerja.
          </p>
        </div>

        <div className="grid gap-4">
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-semibold">
              Deskripsi
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={5}
              placeholder="Tuliskan deskripsi program kerja..."
              className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="objective" className="text-sm font-semibold">
              Tujuan
            </label>
            <textarea
              id="objective"
              name="objective"
              rows={4}
              placeholder="Tuliskan tujuan program kerja..."
              className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>
      </section>

      <section className="rounded-3xl border bg-card p-6 shadow-sm">
        <div className="mb-5">
          <h2 className="font-black tracking-tight">Pelaksanaan</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Atur tanggal, progress, dan publikasi program.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="startDate" className="text-sm font-semibold">
              Tanggal Mulai
            </label>
            <input
              id="startDate"
              name="startDate"
              type="date"
              required
              className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="endDate" className="text-sm font-semibold">
              Tanggal Selesai
            </label>
            <input
              id="endDate"
              name="endDate"
              type="date"
              className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="progressPercent" className="text-sm font-semibold">
              Progress
            </label>
            <input
              id="progressPercent"
              name="progressPercent"
              type="number"
              min={0}
              max={100}
              defaultValue={0}
              className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="pressReleaseUrl" className="text-sm font-semibold">
              Press Release URL
            </label>
            <input
              id="pressReleaseUrl"
              name="pressReleaseUrl"
              type="url"
              placeholder="https://..."
              className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <label className="flex items-center gap-3 rounded-2xl border bg-card px-4 py-3 text-sm font-semibold lg:col-span-2">
            <input
              name="isPublishedToTevo"
              type="checkbox"
              className="size-4 accent-primary"
            />
            Publikasikan ke Tevo
          </label>
        </div>
      </section>

      <section className="flex flex-col gap-3 rounded-3xl border bg-card p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-black tracking-tight">Simpan Program</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Pastikan data sudah benar sebelum disimpan.
          </p>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
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
              Simpan Program
            </>
          )}
        </Button>
      </section>
    </form>
  );
}