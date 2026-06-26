import {
  Activity,
  Building2,
  FileText,
  UsersRound,
} from "lucide-react";

const stats = [
  {
    title: "Unit Organisasi",
    value: "13",
    description: "BPH, biro, dan departemen",
    icon: Building2,
  },
  {
    title: "Data Anggota",
    value: "1",
    description: "Super Admin development",
    icon: UsersRound,
  },
  {
    title: "Program Kerja",
    value: "0",
    description: "Belum dibuat",
    icon: FileText,
  },
  {
    title: "Progress Update",
    value: "0",
    description: "Belum ada laporan",
    icon: Activity,
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-3xl border bg-card p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
          Dashboard Internal
        </p>

        <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
          Selamat datang di Nexus
        </h1>

        <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">
          Fondasi autentikasi dan dashboard shell sudah aktif. Selanjutnya,
          modul data anggota, role-permission, dan program kerja akan dibangun
          bertahap di dalam layout ini.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="rounded-3xl border bg-card p-5 shadow-sm"
            >
              <div className="mb-5 flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Icon className="size-5" />
              </div>

              <p className="text-sm font-medium text-muted-foreground">
                {item.title}
              </p>

              <p className="mt-2 text-3xl font-black tracking-tight">
                {item.value}
              </p>

              <p className="mt-2 text-xs leading-6 text-muted-foreground">
                {item.description}
              </p>
            </div>
          );
        })}
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-3xl border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-black tracking-tight">
            Fokus Tahap Berikutnya
          </h2>

          <div className="mt-5 space-y-3 text-sm text-muted-foreground">
            <p>1. Membuat data anggota dengan tabel dan detail.</p>
            <p>2. Menambahkan role dan permission internal.</p>
            <p>3. Menyiapkan import anggota dari spreadsheet.</p>
          </div>
        </div>

        <div className="rounded-3xl border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-black tracking-tight">
            Status Sistem
          </h2>

          <div className="mt-5 space-y-3 text-sm">
            <div className="flex items-center justify-between rounded-2xl bg-muted/50 px-4 py-3">
              <span className="text-muted-foreground">Authentication</span>
              <span className="font-semibold text-primary">Aktif</span>
            </div>

            <div className="flex items-center justify-between rounded-2xl bg-muted/50 px-4 py-3">
              <span className="text-muted-foreground">Database</span>
              <span className="font-semibold text-primary">Terhubung</span>
            </div>

            <div className="flex items-center justify-between rounded-2xl bg-muted/50 px-4 py-3">
              <span className="text-muted-foreground">Tevo CMS</span>
              <span className="font-semibold text-muted-foreground">
                Belum dibuat
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}