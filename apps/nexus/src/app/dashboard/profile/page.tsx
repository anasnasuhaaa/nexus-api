import { prisma } from "@orma/database";
import Link from "next/link";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import {
  BadgeCheck,
  Building2,
  CalendarDays,
  KeyRound,
  Mail,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";

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

function formatText(value: string | null | undefined) {
  if (!value) {
    return "-";
  }

  return value
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

type InfoItemProps = {
  label: string;
  value: string | number;
};

function InfoItem({ label, value }: InfoItemProps) {
  return (
    <div className="rounded-2xl border bg-card px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 wrap-break-word text-sm font-bold text-foreground">
        {value}
      </p>
    </div>
  );
}

async function getCurrentProfile() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  return prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      banned: true,
      mustChangePassword: true,
      emailVerified: true,
      createdAt: true,
      member: {
        select: {
          fullName: true,
          nim: true,
          instagram: true,
          isActive: true,
          memberships: {
            orderBy: {
              createdAt: "desc",
            },
            take: 1,
            select: {
              organizationalPosition: true,
              internalTitle: true,
              subdivision: true,
              programRoles: true,
              cabinetPeriod: {
                select: {
                  name: true,
                  startDate: true,
                  endDate: true,
                  isActive: true,
                },
              },
              primaryBirdep: {
                select: {
                  name: true,
                  code: true,
                  unitType: true,
                },
              },
            },
          },
        },
      },
    },
  });
}

export default async function ProfilePage() {
  const user = await getCurrentProfile();

  if (!user) {
    redirect("/login");
  }

  const latestMembership = user.member?.memberships[0];

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
              Profil Saya
            </p>

            <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              {user.name}
            </h1>

            <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">
              Halaman ini menampilkan informasi akun login dan data anggota yang
              terhubung dengan akun Nexus kamu.
            </p>
          </div>

          <Link href="/dashboard/profile/change-password">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <KeyRound className="size-4" />
              Ganti Password
            </Button>
          </Link>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-3xl border bg-card p-5 shadow-sm">
          <div className="mb-4 flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <UserRound className="size-5" />
          </div>

          <p className="text-sm text-muted-foreground">Nama Akun</p>
          <p className="mt-2 text-lg font-black tracking-tight">{user.name}</p>
        </div>

        <div className="rounded-3xl border bg-card p-5 shadow-sm">
          <div className="mb-4 flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Mail className="size-5" />
          </div>

          <p className="text-sm text-muted-foreground">Email Login</p>
          <p className="mt-2 wrap-break-word text-lg font-black tracking-tight">
            {user.email}
          </p>
        </div>

        <div className="rounded-3xl border bg-card p-5 shadow-sm">
          <div className="mb-4 flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <ShieldCheck className="size-5" />
          </div>

          <p className="text-sm text-muted-foreground">Role</p>
          <p className="mt-2 text-lg font-black tracking-tight">
            {formatText(user.role)}
          </p>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-3xl border bg-card p-6 shadow-sm">
          <div className="mb-5">
            <h2 className="font-black tracking-tight">Status Akun</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Informasi keamanan dan status login akun.
            </p>
          </div>

          <div className="grid gap-4">
            <InfoItem
              label="Status Login"
              value={user.banned ? "Dibekukan" : "Aktif"}
            />
            <InfoItem
              label="Email Verified"
              value={user.emailVerified ? "Ya" : "Tidak"}
            />
            <InfoItem
              label="Wajib Ganti Password"
              value={user.mustChangePassword ? "Ya" : "Tidak"}
            />
            <InfoItem label="Akun Dibuat" value={formatDate(user.createdAt)} />
          </div>
        </div>

        <div className="rounded-3xl border bg-card p-6 shadow-sm">
          <div className="mb-5">
            <h2 className="font-black tracking-tight">Data Anggota</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Data anggota resmi yang terhubung dengan akun ini.
            </p>
          </div>

          {user.member ? (
            <div className="space-y-4">
              <div className="flex items-start gap-4 rounded-2xl border bg-card p-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <BadgeCheck className="size-5" />
                </div>

                <div>
                  <p className="font-bold">{user.member.fullName}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    NIM: {user.member.nim}
                  </p>
                  {user.member.instagram ? (
                    <p className="mt-1 text-sm text-muted-foreground">
                      Instagram: @{user.member.instagram}
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <InfoItem
                  label="Status Anggota"
                  value={user.member.isActive ? "Aktif" : "Nonaktif"}
                />
                <InfoItem
                  label="Birdep"
                  value={latestMembership?.primaryBirdep.name ?? "-"}
                />
                <InfoItem
                  label="Kode Birdep"
                  value={latestMembership?.primaryBirdep.code ?? "-"}
                />
                <InfoItem
                  label="Posisi"
                  value={formatText(
                    latestMembership?.organizationalPosition ?? null,
                  )}
                />
                <InfoItem
                  label="Jabatan Internal"
                  value={latestMembership?.internalTitle ?? "-"}
                />
                <InfoItem
                  label="Subdivision"
                  value={latestMembership?.subdivision ?? "-"}
                />
              </div>

              {latestMembership ? (
                <div className="rounded-2xl border bg-card p-4">
                  <div className="mb-3 flex items-center gap-2 text-sm font-bold">
                    <Building2 className="size-4 text-primary" />
                    Membership Aktif
                  </div>

                  <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="size-4" />
                      {latestMembership.cabinetPeriod.name} ·{" "}
                      {formatDate(latestMembership.cabinetPeriod.startDate)} -{" "}
                      {formatDate(latestMembership.cabinetPeriod.endDate)}
                    </div>

                    {latestMembership.programRoles ? (
                      <p className="leading-7">
                        Program Roles: {latestMembership.programRoles}
                      </p>
                    ) : null}
                  </div>
                </div>
              ) : null}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed bg-card p-5 text-sm leading-7 text-muted-foreground">
              Akun ini belum terhubung dengan data anggota.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}