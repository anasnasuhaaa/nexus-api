import {
  Activity,
  Building2,
  CheckCircle2,
  FileText,
  ShieldCheck,
  UsersRound,
} from "lucide-react";
import { prisma } from "@orma/database";

async function getDashboardData() {
  const [
    totalBirdeps,
    activeBirdeps,
    totalMembers,
    activeMembers,
    totalUsers,
    totalRoles,
  ] = await Promise.all([
    prisma.birdep.count(),
    prisma.birdep.count({
      where: {
        isActive: true,
      },
    }),
    prisma.member.count(),
    prisma.member.count({
      where: {
        isActive: true,
      },
    }),
    prisma.user.count(),
    prisma.role.count(),
  ]);

  return {
    totalBirdeps,
    activeBirdeps,
    totalMembers,
    activeMembers,
    totalUsers,
    totalRoles,
  };
}

export default async function DashboardPage() {
  const data = await getDashboardData();

  const stats = [
    {
      title: "Unit Organisasi",
      value: data.totalBirdeps,
      description: `${data.activeBirdeps} unit aktif`,
      icon: Building2,
    },
    {
      title: "Data Anggota",
      value: data.totalMembers,
      description: `${data.activeMembers} anggota aktif`,
      icon: UsersRound,
    },
    {
      title: "Program Kerja",
      value: 0,
      description: "Belum ada program kerja terdata",
      icon: FileText,
    },
    {
      title: "Progress Update",
      value: 0,
      description: "Belum ada laporan progress",
      icon: Activity,
    },
  ];

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
              Dashboard Internal
            </p>

            <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              Selamat datang di Nexus
            </h1>

            <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">
              Pusat kendali internal Ormawa Eksekutif PKU untuk mengelola data
              organisasi, anggota, program kerja, progress update, dan akses
              pengguna dalam satu sistem terpadu.
            </p>
          </div>

          <div className="flex w-full max-w-sm items-center gap-3 rounded-2xl border bg-card p-4 shadow-sm">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-status-active-soft text-status-active">
              <CheckCircle2 className="size-5 text-status-active" />
            </div>

            <div>
              <p className="text-sm font-bold">Sistem Aktif</p>
              <p className="mt-1 text-xs leading-6 text-muted-foreground">
                Database dan autentikasi internal terhubung.
              </p>
            </div>
          </div>
        </div>
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
          <div className="flex items-start gap-4">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Activity className="size-5" />
            </div>

            <div>
              <h2 className="text-lg font-black tracking-tight">
                Ringkasan Operasional
              </h2>

              <p className="mt-1 text-sm leading-7 text-muted-foreground">
                Nexus membantu pengurus memantau struktur organisasi,
                keanggotaan, program kerja, dan pembaruan progress secara lebih
                rapi, terpusat, dan mudah ditelusuri.
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-3 text-sm">
            <div className="flex items-center justify-between rounded-2xl border bg-card px-4 py-3">
              <span className="text-muted-foreground">Akun Login</span>
              <span className="font-semibold text-primary">
                {data.totalUsers}
              </span>
            </div>

            <div className="flex items-center justify-between rounded-2xl border bg-card px-4 py-3">
              <span className="text-muted-foreground">Role Sistem</span>
              <span className="font-semibold text-primary">
                {data.totalRoles}
              </span>
            </div>

            <div className="flex items-center justify-between rounded-2xl border bg-card px-4 py-3">
              <span className="text-muted-foreground">Periode Organisasi</span>
              <span className="font-semibold text-status-active bg-status-active-soft px-2.5 py-1 rounded-full">Aktif</span>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border bg-card p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <ShieldCheck className="size-5" />
            </div>

            <div>
              <h2 className="text-lg font-black tracking-tight">
                Status Layanan
              </h2>

              <p className="mt-1 text-sm leading-7 text-muted-foreground">
                Modul inti Nexus sudah siap digunakan untuk kebutuhan
                pengelolaan data internal organisasi.
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-3 text-sm">
            <div className="flex items-center justify-between rounded-2xl border bg-card px-4 py-3">
              <span className="text-muted-foreground">Authentication</span>
              <span className="font-semibold text-status-active bg-status-active-soft px-2.5 py-1 rounded-full">Aktif</span>
            </div>

            <div className="flex items-center justify-between rounded-2xl border bg-card px-4 py-3">
              <span className="text-muted-foreground">Database</span>
              <span className="font-semibold text-status-active bg-status-active-soft px-2.5 py-1 rounded-full">Terhubung</span>
            </div>

            <div className="flex items-center justify-between rounded-2xl border bg-card px-4 py-3">
              <span className="text-muted-foreground">Import Anggota</span>
              <span className="font-semibold text-status-active bg-status-active-soft px-2.5 py-1 rounded-full">Tersedia</span>
            </div>

            <div className="flex items-center justify-between rounded-2xl border bg-card px-4 py-3">
              <span className="text-muted-foreground">Role Management</span>
              <span className="font-semibold text-status-active bg-status-active-soft px-2.5 py-1 rounded-full">Aktif</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}