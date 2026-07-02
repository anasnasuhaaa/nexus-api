"use client";

import { FormEvent, useState } from "react";
import { Loader2, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import { createProgressAction } from "./actions";

type ProgramOption = {
  id: string;
  title: string;
  slug: string;
  birdepCode: string;
  birdepName: string;
  progressPercent: number;
};

type ProgressFormProps = {
  programs: ProgramOption[];
  defaultProgramId?: string;
};

function getTodayDateInput() {
  return new Date().toISOString().slice(0, 10);
}

export function ProgressForm({
  programs,
  defaultProgramId = "",
}: ProgressFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedProgramId, setSelectedProgramId] = useState(defaultProgramId);

  const selectedProgram = programs.find(
    (program) => program.id === selectedProgramId,
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    setIsSubmitting(true);
    const response = await createProgressAction(formData);
    setIsSubmitting(false);

    if (!response.success) {
      toast.error("Gagal menambahkan progress", {
        description: response.message,
        duration: 2000,
      });
      return;
    }

    toast.success("Progress berhasil ditambahkan", {
      description: response.message,
      duration: 2000,
    });

    if (response.progressId) {
      router.push(`/dashboard/progress/${response.progressId}`);
      router.refresh();
      return;
    }

    router.push("/dashboard/progress");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <section className="rounded-3xl border bg-card p-6 shadow-sm">
        <div className="mb-5">
          <h2 className="font-black tracking-tight">Program Terkait</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Pilih program kerja yang akan diberikan laporan progress.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="programId" className="text-sm font-semibold">
              Program Kerja
            </label>

            <select
              id="programId"
              name="programId"
              required
              value={selectedProgramId}
              onChange={(event) => setSelectedProgramId(event.target.value)}
              className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Pilih Program</option>
              {programs.map((program) => (
                <option key={program.id} value={program.id}>
                  {program.birdepCode} — {program.title}
                </option>
              ))}
            </select>
          </div>

          {selectedProgram ? (
            <div className="rounded-2xl border bg-card px-4 py-3">
              <p className="text-sm font-bold">{selectedProgram.title}</p>
              <p className="mt-1 text-xs leading-6 text-muted-foreground">
                {selectedProgram.birdepCode} · {selectedProgram.birdepName} ·
                Progress saat ini {selectedProgram.progressPercent}%
              </p>
            </div>
          ) : (
            <div className="rounded-2xl border bg-card px-4 py-3">
              <p className="text-sm font-bold">Belum ada program dipilih</p>
              <p className="mt-1 text-xs leading-6 text-muted-foreground">
                Pilih program agar progress update bisa dihubungkan dengan data
                yang tepat.
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="rounded-3xl border bg-card p-6 shadow-sm">
        <div className="mb-5">
          <h2 className="font-black tracking-tight">Informasi Progress</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Isi judul, tanggal laporan, status, dan capaian progress terbaru.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-semibold">
              Judul Progress
            </label>

            <input
              id="title"
              name="title"
              required
              placeholder="Contoh: Progress Minggu 1"
              className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="reportedAt" className="text-sm font-semibold">
              Tanggal Laporan
            </label>

            <input
              id="reportedAt"
              name="reportedAt"
              type="date"
              required
              defaultValue={getTodayDateInput()}
              className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="progressPercent" className="text-sm font-semibold">
              Progress Terbaru
            </label>

            <input
              id="progressPercent"
              name="progressPercent"
              type="number"
              min={0}
              max={100}
              required
              defaultValue={selectedProgram?.progressPercent ?? 0}
              className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="status" className="text-sm font-semibold">
              Status Progress
            </label>

            <select
              id="status"
              name="status"
              defaultValue="ON_TRACK"
              className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="ON_TRACK">Sesuai Rencana</option>
              <option value="AT_RISK">Berisiko</option>
              <option value="BLOCKED">Terhambat</option>
              <option value="DONE">Selesai</option>
            </select>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border bg-card p-6 shadow-sm">
        <div className="mb-5">
          <h2 className="font-black tracking-tight">Catatan Laporan</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Tuliskan perkembangan, kendala, dan tindak lanjut berikutnya.
          </p>
        </div>

        <div className="grid gap-4">
          <div className="space-y-2">
            <label htmlFor="note" className="text-sm font-semibold">
              Catatan Progress
            </label>

            <textarea
              id="note"
              name="note"
              required
              rows={5}
              placeholder="Tuliskan perkembangan terbaru program..."
              className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="obstacle" className="text-sm font-semibold">
              Kendala
            </label>

            <textarea
              id="obstacle"
              name="obstacle"
              rows={4}
              placeholder="Tuliskan kendala jika ada..."
              className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="nextStep" className="text-sm font-semibold">
              Langkah Berikutnya
            </label>

            <textarea
              id="nextStep"
              name="nextStep"
              rows={4}
              placeholder="Tuliskan rencana tindak lanjut..."
              className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-3 rounded-3xl border bg-card p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-black tracking-tight">Simpan Progress</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Progress terbaru akan memperbarui capaian program kerja terkait.
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
              Simpan Progress
            </>
          )}
        </Button>
      </section>
    </form>
  );
}