import { prisma } from "@orma/database";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  CheckCircle2,
  ClipboardList,
  ExternalLink,
  FileText,
  Globe2,
  ImageIcon,
  LayoutDashboard,
  ListChecks,
  Newspaper,
  Rocket,
  ShieldCheck,
  UsersRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";

type StatCardProps = {
  title: string;
  value: string | number;
  description: string;
  icon: React.ElementType;
};

type ShortcutCardProps = {
  title: string;
  description: string;
  href: string;
  icon: React.ElementType;
  buttonLabel: string;
};

type ChecklistItemProps = {
  title: string;
  description: string;
  isDone?: boolean;
};

function formatDate(date: Date | null | undefined) {
  if (!date) {
    return "-";
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

async function getTevoDashboardData() {
  const [
    activeCabinetPeriod,
    totalPrograms,
    totalMembers,
    activeMembers,
    totalBirdeps,
    activeBirdeps,
  ] = await Promise.all([
    prisma.cabinetPeriod.findFirst({
      where: {
        isActive: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        name: true,
        startDate: true,
        endDate: true,
      },
    }),
    prisma.program.count(),
    prisma.member.count(),
    prisma.member.count({
      where: {
        isActive: true,
      },
    }),
    prisma.birdep.count(),
    prisma.birdep.count({
      where: {
        isActive: true,
      },
    }),
  ]);

  return {
    activeCabinetPeriod,
    totalPrograms,
    totalMembers,
    activeMembers,
    totalBirdeps,
    activeBirdeps,
  };
}

function StatCard({ title, value, description, icon: Icon }: StatCardProps) {
  return (
    <div className="rounded-3xl border bg-card p-5 shadow-sm">
      <div className="mb-4 flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Icon className="size-5" />
      </div>

      <p className="text-sm font-medium text-muted-foreground">{title}</p>

      <p className="mt-2 text-3xl font-black tracking-tight">{value}</p>

      <p className="mt-2 text-xs leading-6 text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

function ShortcutCard({
  title,
  description,
  href,
  icon: Icon,
  buttonLabel,
}: ShortcutCardProps) {
  return (
    <div className="rounded-3xl border bg-card p-5 shadow-sm">
      <div className="mb-4 flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Icon className="size-5" />
      </div>

      <h2 className="font-black tracking-tight">{title}</h2>

      <p className="mt-2 text-sm leading-7 text-muted-foreground">
        {description}
      </p>

      <Link href={href} className="mt-5 inline-flex">
        <Button variant="outline">
          {buttonLabel}
          <ArrowRight className="size-4" />
        </Button>
      </Link>
    </div>
  );
}

function ChecklistItem({
  title,
  description,
  isDone = false,
}: ChecklistItemProps) {
  return (
    <div className="flex items-start gap-4 rounded-2xl border bg-card p-4">
      <div
        className={
          isDone
            ? "flex size-10 shrink-0 items-center justify-center rounded-xl bg-status-active-soft text-status-active"
            : "flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground"
        }
      >
        {isDone ? (
          <CheckCircle2 className="size-5" />
        ) : (
          <ListChecks className="size-5" />
        )}
      </div>

      <div>
        <p className="font-bold">{title}</p>
        <p className="mt-1 text-sm leading-7 text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
}

export default async function TevoDashboardPage() {
  const data = await getTevoDashboardData();

  const tevoPublicUrl =
    process.env.NEXT_PUBLIC_TEVO_URL ?? "https://ormawaeksekutifpku.com";

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-3xl border bg-card shadow-sm">
        <div className="relative p-6">
          <div className="absolute right-0 top-0 hidden size-52 rounded-bl-full bg-primary/10 lg:block" />

          <div className="relative flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
                Konten Publik Tevo
              </p>

              <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
                Tevo Content Foundation
              </h1>

              <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">
                Halaman ini menjadi pusat kendali awal untuk menyiapkan data
                publik Tevo. Untuk tahap ini, Nexus menampilkan overview,
                statistik dasar, shortcut pengelolaan data, dan checklist
                kesiapan konten sebelum masuk ke sistem publish.
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <Link href={tevoPublicUrl} target="_blank">
                <Button variant="outline">
                  <ExternalLink className="size-4" />
                  Buka Website Tevo
                </Button>
              </Link>

              <Link href="/dashboard/programs">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                  <Rocket className="size-4" />
                  Kelola Program
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Program Kerja"
          value={data.totalPrograms}
          description="Total program kerja yang tersimpan di Nexus."
          icon={FileText}
        />

        <StatCard
          title="Anggota Aktif"
          value={data.activeMembers}
          description={`Dari total ${data.totalMembers} data anggota.`}
          icon={UsersRound}
        />

        <StatCard
          title="Birdep Aktif"
          value={data.activeBirdeps}
          description={`Dari total ${data.totalBirdeps} unit organisasi.`}
          icon={Building2}
        />

        <StatCard
          title="Periode Aktif"
          value={data.activeCabinetPeriod?.name ?? "-"}
          description={
            data.activeCabinetPeriod
              ? `${formatDate(data.activeCabinetPeriod.startDate)} - ${formatDate(
                  data.activeCabinetPeriod.endDate,
                )}`
              : "Belum ada periode kabinet aktif."
          }
          icon={BadgeCheck}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border bg-card p-6 shadow-sm">
          <div className="mb-5">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
              Arah Integrasi
            </p>

            <h2 className="mt-2 text-2xl font-black tracking-tight">
              Alur Data Nexus ke Tevo
            </h2>

            <p className="mt-2 text-sm leading-7 text-muted-foreground">
              Tevo akan mengambil data publik dari Nexus. Data internal tetap
              berada di Nexus, sedangkan Tevo hanya menampilkan data yang sudah
              disiapkan untuk publik.
            </p>
          </div>

          <div className="grid gap-4">
            <div className="rounded-2xl border bg-card p-4">
              <div className="flex items-start gap-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <LayoutDashboard className="size-5" />
                </div>

                <div>
                  <p className="font-bold">Nexus sebagai sumber data</p>
                  <p className="mt-1 text-sm leading-7 text-muted-foreground">
                    Admin mengelola anggota, Birdep, program kerja, media, dan
                    konten publik dari dashboard internal Nexus.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border bg-card p-4">
              <div className="flex items-start gap-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <ShieldCheck className="size-5" />
                </div>

                <div>
                  <p className="font-bold">Kontrol publikasi</p>
                  <p className="mt-1 text-sm leading-7 text-muted-foreground">
                    Stage berikutnya akan menambahkan kontrol data mana yang
                    boleh tampil di website publik Tevo.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border bg-card p-4">
              <div className="flex items-start gap-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Globe2 className="size-5" />
                </div>

                <div>
                  <p className="font-bold">Tevo sebagai website publik</p>
                  <p className="mt-1 text-sm leading-7 text-muted-foreground">
                    Website Tevo hanya membaca data public-ready melalui API
                    yang akan disiapkan setelah fondasi konten selesai.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border bg-card p-6 shadow-sm">
          <div className="mb-5">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
              Domain Publik
            </p>

            <h2 className="mt-2 text-2xl font-black tracking-tight">
              Website Tevo
            </h2>

            <p className="mt-2 text-sm leading-7 text-muted-foreground">
              Domain ini akan menjadi tujuan publik untuk menampilkan profil
              organisasi, struktur, program kerja, dan berita.
            </p>
          </div>

          <div className="rounded-2xl border bg-background p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Public URL
            </p>

            <p className="mt-2 break-words text-sm font-black text-foreground">
              {tevoPublicUrl}
            </p>
          </div>

          <div className="mt-4 rounded-2xl border bg-muted/30 p-4 text-sm leading-7 text-muted-foreground">
            Tambahkan environment berikut kalau ingin URL publik bisa diatur
            dari konfigurasi:
            <pre className="mt-3 overflow-x-auto rounded-xl bg-background p-3 text-xs">
              NEXT_PUBLIC_TEVO_URL=https://ormawaeksekutifpku.com
            </pre>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <ShortcutCard
          title="Program Kerja"
          description="Kelola data program kerja yang nanti bisa dipilih untuk ditampilkan ke website publik Tevo."
          href="/dashboard/programs"
          icon={FileText}
          buttonLabel="Buka Program"
        />

        <ShortcutCard
          title="Struktur Organisasi"
          description="Data anggota dan Birdep akan menjadi dasar struktur organisasi publik di Tevo."
          href="/dashboard/members"
          icon={UsersRound}
          buttonLabel="Buka Anggota"
        />

        <ShortcutCard
          title="Media"
          description="Kelola aset visual yang nantinya dapat digunakan untuk cover program, berita, atau halaman publik."
          href="/dashboard/media"
          icon={ImageIcon}
          buttonLabel="Buka Media"
        />
      </section>

      <section className="rounded-3xl border bg-card p-6 shadow-sm">
        <div className="mb-5">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
            Checklist
          </p>

          <h2 className="mt-2 text-2xl font-black tracking-tight">
            Kesiapan Konten Publik
          </h2>

          <p className="mt-2 text-sm leading-7 text-muted-foreground">
            Checklist ini menjadi panduan sebelum data Nexus benar-benar
            diterbitkan ke website publik Tevo.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <ChecklistItem
            isDone
            title="Fondasi dashboard Tevo"
            description="Halaman pusat kendali Tevo sudah tersedia di dashboard Nexus."
          />

          <ChecklistItem
            isDone={data.totalMembers > 0}
            title="Data anggota tersedia"
            description="Data anggota dibutuhkan untuk struktur organisasi dan profil kepengurusan."
          />

          <ChecklistItem
            isDone={data.totalBirdeps > 0}
            title="Data Birdep tersedia"
            description="Data Birdep menjadi dasar pengelompokan struktur organisasi publik."
          />

          <ChecklistItem
            isDone={data.totalPrograms > 0}
            title="Data program kerja tersedia"
            description="Program kerja menjadi salah satu konten utama yang akan ditampilkan di Tevo."
          />

          <ChecklistItem
            title="Kontrol publish Tevo"
            description="Stage berikutnya akan menambahkan field dan UI untuk memilih data yang boleh tampil di Tevo."
          />

          <ChecklistItem
            title="Public API Tevo"
            description="Setelah kontrol publish siap, Nexus akan menyediakan API publik untuk dikonsumsi website Tevo."
          />

          <ChecklistItem
            title="News / Article CMS"
            description="Konten berita atau artikel Tevo akan dibuat sebagai modul CMS terpisah."
          />

          <ChecklistItem
            title="Integrasi website publik"
            description="Website Tevo akan membaca data dari Nexus melalui endpoint public-ready."
          />
        </div>
      </section>

      <section className="rounded-3xl border bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
              Next Stage
            </p>

            <h2 className="mt-2 text-2xl font-black tracking-tight">
              Stage 34 — Tevo Public Program Control
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-7 text-muted-foreground">
              Tahap selanjutnya adalah menambahkan kontrol publikasi untuk
              program kerja, seperti judul publik, deskripsi publik, slug,
              cover image, status publish, dan archive.
            </p>
          </div>

          <Link href="/dashboard/programs">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <ClipboardList className="size-4" />
              Siapkan Program
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}