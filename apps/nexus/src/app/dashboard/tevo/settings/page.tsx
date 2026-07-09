import { Settings } from "lucide-react";

export default function TevoSettingsPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-3xl border bg-card p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Settings className="size-6" />
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
              Tevo / Pengaturan
            </p>

            <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              Pengaturan Tevo
            </h1>

            <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">
              Pengaturan domain, metadata SEO, dan konfigurasi public API akan
              disiapkan pada stage berikutnya.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}