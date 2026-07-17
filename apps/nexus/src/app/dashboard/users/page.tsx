import { prisma } from "@orma/database";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  Ban,
  CheckCircle2,
  MailCheck,
  Shield,
  UserCog,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

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

function getRoleBadge(role: string) {
  if (role === "SUPER_ADMIN") {
    return (
      <span className="inline-flex rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
        {formatRole(role)}
      </span>
    );
  }

  if (role === "TEVO_ADMIN") {
    return (
      <span className="inline-flex rounded-full bg-status-active-soft px-2.5 py-1 text-xs font-semibold text-status-active">
        {formatRole(role)}
      </span>
    );
  }

  return (
    <span className="inline-flex rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground">
      {formatRole(role)}
    </span>
  );
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

export default async function UsersPage() {
  await ensureSuperAdminPage();

  const users = await prisma.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      name: true,
      email: true,
      emailVerified: true,
      role: true,
      banned: true,
      mustChangePassword: true,
      createdAt: true,
      member: {
        select: {
          id: true,
          fullName: true,
          nim: true,
          isActive: true,
          memberships: {
            orderBy: {
              createdAt: "desc",
            },
            take: 1,
            select: {
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
  });

  const totalUsers = users.length;
  const activeUsers = users.filter((user) => !user.banned).length;
  const bannedUsers = users.filter((user) => user.banned).length;
  const linkedUsers = users.filter((user) => user.member).length;

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border bg-card p-6 shadow-sm">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
            Nexus / User Management
          </p>

          <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
            Kelola User
          </h1>

          <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">
            Kelola akun login, role dasar, hubungan user ke member, serta
            status ban user Nexus.
          </p>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-4">
        <div className="rounded-3xl border bg-card p-5 shadow-sm">
          <div className="mb-4 flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Users className="size-5" />
          </div>
          <p className="text-sm text-muted-foreground">Total User</p>
          <p className="mt-2 text-3xl font-black tracking-tight">
            {totalUsers}
          </p>
        </div>

        <div className="rounded-3xl border bg-card p-5 shadow-sm">
          <div className="mb-4 flex size-11 items-center justify-center rounded-2xl bg-status-active-soft text-status-active">
            <CheckCircle2 className="size-5" />
          </div>
          <p className="text-sm text-muted-foreground">Aktif</p>
          <p className="mt-2 text-3xl font-black tracking-tight">
            {activeUsers}
          </p>
        </div>

        <div className="rounded-3xl border bg-card p-5 shadow-sm">
          <div className="mb-4 flex size-11 items-center justify-center rounded-2xl bg-status-inactive-soft text-status-inactive">
            <Ban className="size-5" />
          </div>
          <p className="text-sm text-muted-foreground">Banned</p>
          <p className="mt-2 text-3xl font-black tracking-tight">
            {bannedUsers}
          </p>
        </div>

        <div className="rounded-3xl border bg-card p-5 shadow-sm">
          <div className="mb-4 flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <UserCog className="size-5" />
          </div>
          <p className="text-sm text-muted-foreground">Linked Member</p>
          <p className="mt-2 text-3xl font-black tracking-tight">
            {linkedUsers}
          </p>
        </div>
      </section>

      <section className="rounded-3xl border bg-card p-5 shadow-sm">
        <div className="mb-5">
          <h2 className="font-black tracking-tight">Daftar User</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Klik detail untuk mengubah role, link member, ban/unban, atau
            mengirim link aktivasi.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left">User</th>
                  <th className="px-4 py-3 text-left">Role</th>
                  <th className="px-4 py-3 text-left">Member</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Dibuat</th>
                  <th className="px-4 py-3 text-center">Aksi</th>
                </tr>
              </thead>

              <tbody>
                {users.length ? (
                  users.map((user) => {
                    const latestMembership = user.member?.memberships[0];
                    const birdep = latestMembership?.primaryBirdep;

                    return (
                      <tr key={user.id} className="border-t">
                        <td className="px-4 py-3">
                          <p className="font-semibold">{user.name}</p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {user.email}
                          </p>
                        </td>

                        <td className="px-4 py-3">{getRoleBadge(user.role)}</td>

                        <td className="px-4 py-3">
                          {user.member ? (
                            <div>
                              <p className="font-semibold">
                                {user.member.fullName}
                              </p>
                              <p className="mt-1 text-xs text-muted-foreground">
                                {user.member.nim}
                                {birdep ? ` • ${birdep.code}` : ""}
                              </p>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">
                              Belum terhubung
                            </span>
                          )}
                        </td>

                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-2">
                            {user.banned ? (
                              <span className="inline-flex rounded-full bg-status-inactive-soft px-2.5 py-1 text-xs font-semibold text-status-inactive">
                                Banned
                              </span>
                            ) : (
                              <span className="inline-flex rounded-full bg-status-active-soft px-2.5 py-1 text-xs font-semibold text-status-active">
                                Active
                              </span>
                            )}

                            {user.emailVerified ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                                <MailCheck className="size-3" />
                                Verified
                              </span>
                            ) : null}

                            {user.mustChangePassword ? (
                              <span className="inline-flex rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground">
                                Must Change Password
                              </span>
                            ) : null}
                          </div>
                        </td>

                        <td className="px-4 py-3 text-muted-foreground">
                          {formatDateTime(user.createdAt)}
                        </td>

                        <td className="px-4 py-3 text-center">
                          <Link href={`/dashboard/users/${user.id}`}>
                            <Button variant="outline" size="sm">
                              Detail
                              <ArrowRight className="size-4" />
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="h-24 px-4 py-3 text-center text-muted-foreground"
                    >
                      Belum ada user.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-5 rounded-2xl border bg-background p-4 text-sm leading-7 text-muted-foreground">
          <div className="flex gap-3">
            <Shield className="mt-1 size-4 shrink-0 text-primary" />
            <p>
              Stage ini masih memakai role dasar di field <strong>user.role</strong>.
              Permission granular akan disiapkan pada Stage 46 dan diaktifkan
              pada Stage 47.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}