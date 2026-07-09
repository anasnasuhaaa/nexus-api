import { Newspaper } from "lucide-react";

export default function TevoNewsPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-3xl border bg-card p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Newspaper className="size-6" />
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
              Tevo / CMS Berita
            </p>

            <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              CMS / Berita Tevo
            </h1>

            <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">
              Modul berita dan artikel akan dibuat pada stage berikutnya.
              Halaman ini disiapkan sebagai placeholder agar struktur menu Tevo
              sudah rapi dari awal.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}