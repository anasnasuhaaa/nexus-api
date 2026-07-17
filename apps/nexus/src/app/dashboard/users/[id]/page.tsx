import { prisma } from "@orma/database";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Ban,
  CalendarClock,
  CheckCircle2,
  Mail,
  Shield,
  UserRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";

import {
  UserManagementForm,
  UserManagementInitialData,
} from "./user-management-form";

export const dynamic = "force-dynamic";

type UserDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

function formatDateTime(date: Date | null | undefined) {
  if (!date) {
    return "-";
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function formatDateInput(date: Date | null | undefined) {
  if (!date) {
    return "";
  }

  return date.toISOString().slice(0, 10);
}

function formatRole(role: string) {
  const labels: Record<string, string> = {
    SUPER_ADMIN: "Super Admin",
    TEVO_ADMIN: "Tevo Admin",
    BPH: "BPH",
    KSATRIA: "Ksatria",
    LAKSANA: "Laksana",
    ANGGOTA_BIRDEP: "Anggota Birdep",
  };

  return labels[role] ?? role;
}

async function ensureSuperAdminPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const currentUser = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      role: true,
    },
  });

  if (!currentUser || currentUser.role !== "SUPER_ADMIN") {
    redirect("/dashboard");
  }
}

export default async function UserDetailPage({ params }: UserDetailPageProps) {
  await ensureSuperAdminPage();

  const { id } = await params;

  const [user, members] = await Promise.all([
    prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        image: true,
        role: true,
        banned: true,
        banReason: true,
        banExpires: true,
        mustChangePassword: true,
        memberId: true,
        createdAt: true,
        updatedAt: true,
        member: {
          select: {
            id: true,
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
                primaryBirdep: {
                  select: {
                    name: true,
                    code: true,
                  },
                },
              },
            },
          },
        },
      },
    }),

    prisma.member.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        fullName: "asc",
      },
      select: {
        id: true,
        fullName: true,
        nim: true,
        memberships: {
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
          select: {
            primaryBirdep: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    }),
  ]);

  if (!user) {
    notFound();
  }

  const latestMembership = user.member?.memberships[0];
  const latestBirdep = latestMembership?.primaryBirdep;

  const memberOptions = members.map((member) => ({
    id: member.id,
    fullName: member.fullName,
    nim: member.nim,
    birdepName: member.memberships[0]?.primaryBirdep.name ?? null,
  }));

  const initialData: UserManagementInitialData = {
    userId: user.id,
    role: user.role,
    memberId: user.memberId ?? "",
    banned: user.banned,
    banReason: user.banReason ?? "",
    banExpires: formatDateInput(user.banExpires),
  };

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border bg-card p-6 shadow-sm">
        <div className="mb-4">
          <Link href="/dashboard/users">
            <Button variant="outline">
              <ArrowLeft className="size-4" />
              Kembali ke User Management
            </Button>
          </Link>
        </div>

        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
              Nexus / User Detail
            </p>

            <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              {user.name}
            </h1>

            <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">
              Kelola akun login, role, link member, dan status akses user.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {user.banned ? (
              <span className="inline-flex rounded-full bg-status-inactive-soft px-3 py-1.5 text-sm font-semibold text-status-inactive">
                Banned
              </span>
            ) : (
              <span className="inline-flex rounded-full bg-status-active-soft px-3 py-1.5 text-sm font-semibold text-status-active">
                Active
              </span>
            )}

            <span className="inline-flex rounded-full bg-primary/10 px-3 py-1.5 text-sm font-semibold text-primary">
              {formatRole(user.role)}
            </span>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-4">
        <div className="rounded-3xl border bg-card p-5 shadow-sm">
          <div className="mb-4 flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Mail className="size-5" />
          </div>
          <p className="text-sm text-muted-foreground">Email</p>
          <p className="mt-2 break-all text-sm font-bold">{user.email}</p>
        </div>

        <div className="rounded-3xl border bg-card p-5 shadow-sm">
          <div className="mb-4 flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Shield className="size-5" />
          </div>
          <p className="text-sm text-muted-foreground">Role</p>
          <p className="mt-2 text-sm font-bold">{formatRole(user.role)}</p>
        </div>

        <div className="rounded-3xl border bg-card p-5 shadow-sm">
          <div className="mb-4 flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <CheckCircle2 className="size-5" />
          </div>
          <p className="text-sm text-muted-foreground">Email Verified</p>
          <p className="mt-2 text-sm font-bold">
            {user.emailVerified ? "Verified" : "Belum Verified"}
          </p>
        </div>

        <div className="rounded-3xl border bg-card p-5 shadow-sm">
          <div className="mb-4 flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <CalendarClock className="size-5" />
          </div>
          <p className="text-sm text-muted-foreground">Dibuat</p>
          <p className="mt-2 text-sm font-bold">
            {formatDateTime(user.createdAt)}
          </p>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-6">
          <section className="rounded-3xl border bg-card p-6 shadow-sm">
            <div className="mb-5 flex items-start gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <UserRound className="size-6" />
              </div>

              <div>
                <h2 className="font-black tracking-tight">Data Member</h2>
                <p className="mt-1 text-sm leading-7 text-muted-foreground">
                  Data anggota yang terhubung ke akun user ini.
                </p>
              </div>
            </div>

            {user.member ? (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Nama Member</p>
                  <p className="mt-1 font-black">{user.member.fullName}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">NIM</p>
                  <p className="mt-1 font-semibold">{user.member.nim}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Birdep</p>
                  <p className="mt-1 font-semibold">
                    {latestBirdep
                      ? `${latestBirdep.name} (${latestBirdep.code})`
                      : "-"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Jabatan</p>
                  <p className="mt-1 font-semibold">
                    {latestMembership?.internalTitle ??
                      latestMembership?.organizationalPosition ??
                      "-"}
                  </p>
                </div>

                <Link href={`/dashboard/members/${user.member.id}`}>
                  <Button variant="outline">
                    Buka Detail Member
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed p-5 text-sm leading-7 text-muted-foreground">
                User ini belum terhubung ke data member.
              </div>
            )}
          </section>

          {user.banned ? (
            <section className="rounded-3xl border border-status-inactive/20 bg-status-inactive-soft p-6 text-status-inactive shadow-sm">
              <div className="mb-4 flex items-start gap-4">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-status-inactive text-white">
                  <Ban className="size-6" />
                </div>

                <div>
                  <h2 className="font-black tracking-tight">Informasi Ban</h2>
                  <p className="mt-1 text-sm leading-7">
                    User ini sedang dalam status banned.
                  </p>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-semibold">Alasan</p>
                  <p>{user.banReason ?? "-"}</p>
                </div>

                <div>
                  <p className="font-semibold">Berakhir</p>
                  <p>{formatDateTime(user.banExpires)}</p>
                </div>
              </div>
            </section>
          ) : null}
        </div>

        <UserManagementForm
          initialData={initialData}
          memberOptions={memberOptions}
        />
      </section>
    </div>
  );
}