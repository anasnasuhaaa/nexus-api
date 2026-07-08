import { prisma } from "@orma/database";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  MailCheck,
  Send,
  XCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import { BulkActivationButton } from "./bulk-activation-button";
import { getBulkActivationStatsAction } from "./bulk-activation-action";
import {
  ActivationTargetRow,
  SelectedActivationPanel,
} from "./selected-activation-panel";

function formatDateTime(date: Date | null | undefined) {
  if (!date) {
    return null;
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

async function getActivationTargets(): Promise<ActivationTargetRow[]> {
  const users = await prisma.user.findMany({
    where: {
      mustChangePassword: true,
      banned: false,
      memberId: {
        not: null,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      name: true,
      email: true,
      member: {
        select: {
          fullName: true,
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
      },
    },
  });

  const logs = await prisma.userActivationEmailLog.findMany({
    where: {
      targetUserId: {
        in: users.map((user) => user.id),
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      targetUserId: true,
      status: true,
      createdAt: true,
    },
  });

  const latestLogMap = new Map<
    string,
    {
      status: string;
      createdAt: Date;
    }
  >();

  for (const log of logs) {
    if (!latestLogMap.has(log.targetUserId)) {
      latestLogMap.set(log.targetUserId, {
        status: log.status,
        createdAt: log.createdAt,
      });
    }
  }

  return users.map((user) => {
    const latestLog = latestLogMap.get(user.id);

    return {
      userId: user.id,
      memberName: user.member?.fullName ?? user.name,
      email: user.email,
      birdepName:
        user.member?.memberships[0]?.primaryBirdep.name ?? "Belum ada Birdep",
      lastStatus: latestLog?.status ?? null,
      lastSentAt: formatDateTime(latestLog?.createdAt),
    };
  });
}

async function getActivationLogStats() {
  const [totalLogs, successLogs, failedLogs] = await Promise.all([
    prisma.userActivationEmailLog.count(),
    prisma.userActivationEmailLog.count({
      where: {
        status: "SUCCESS",
      },
    }),
    prisma.userActivationEmailLog.count({
      where: {
        status: "FAILED",
      },
    }),
  ]);

  return {
    totalLogs,
    successLogs,
    failedLogs,
  };
}

async function getRecentActivationLogs() {
  return prisma.userActivationEmailLog.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 20,
    select: {
      id: true,
      targetEmail: true,
      targetName: true,
      status: true,
      errorMessage: true,
      createdAt: true,
    },
  });
}

function getLogStatusBadge(status: string) {
  if (status === "SUCCESS") {
    return (
      <span className="inline-flex rounded-full bg-status-active-soft px-2.5 py-1 text-xs font-semibold text-status-active">
        SUCCESS
      </span>
    );
  }

  return (
    <span className="inline-flex rounded-full bg-status-inactive-soft px-2.5 py-1 text-xs font-semibold text-status-inactive">
      FAILED
    </span>
  );
}

export default async function MemberActivationPage() {
  const [activationStats, activationTargets, logStats, recentLogs] =
    await Promise.all([
      getBulkActivationStatsAction(),
      getActivationTargets(),
      getActivationLogStats(),
      getRecentActivationLogs(),
    ]);

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border bg-card p-6 shadow-sm">
        <div className="mb-4">
          <Link href="/dashboard/members">
            <Button variant="outline">
              <ArrowLeft className="size-4" />
              Kembali ke Data Anggota
            </Button>
          </Link>
        </div>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
              Aktivasi Akun
            </p>

            <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              Aktivasi & Log Email
            </h1>

            <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">
              Kelola pengiriman link aktivasi/reset password untuk user yang
              belum menyelesaikan aktivasi akun Nexus.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <BulkActivationButton
              eligibleCount={activationStats.eligibleCount}
            />
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-4">
        <div className="rounded-3xl border bg-card p-5 shadow-sm">
          <div className="mb-4 flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <MailCheck className="size-5" />
          </div>

          <p className="text-sm font-medium text-muted-foreground">
            Belum Aktivasi
          </p>

          <p className="mt-2 text-3xl font-black tracking-tight">
            {activationStats.eligibleCount}
          </p>
        </div>

        <div className="rounded-3xl border bg-card p-5 shadow-sm">
          <div className="mb-4 flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Send className="size-5" />
          </div>

          <p className="text-sm font-medium text-muted-foreground">
            Total Log
          </p>

          <p className="mt-2 text-3xl font-black tracking-tight">
            {logStats.totalLogs}
          </p>
        </div>

        <div className="rounded-3xl border bg-card p-5 shadow-sm">
          <div className="mb-4 flex size-11 items-center justify-center rounded-2xl bg-status-active-soft text-status-active">
            <CheckCircle2 className="size-5" />
          </div>

          <p className="text-sm font-medium text-muted-foreground">
            Berhasil
          </p>

          <p className="mt-2 text-3xl font-black tracking-tight">
            {logStats.successLogs}
          </p>
        </div>

        <div className="rounded-3xl border bg-card p-5 shadow-sm">
          <div className="mb-4 flex size-11 items-center justify-center rounded-2xl bg-status-inactive-soft text-status-inactive">
            <XCircle className="size-5" />
          </div>

          <p className="text-sm font-medium text-muted-foreground">Gagal</p>

          <p className="mt-2 text-3xl font-black tracking-tight">
            {logStats.failedLogs}
          </p>
        </div>
      </section>

      <SelectedActivationPanel users={activationTargets} />

      <section className="rounded-3xl border bg-card p-5 shadow-sm">
        <div className="mb-5">
          <h2 className="font-black tracking-tight">Log Email Aktivasi</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Menampilkan 20 log pengiriman aktivasi terbaru.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left">Waktu</th>
                  <th className="px-4 py-3 text-left">Nama</th>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Catatan</th>
                </tr>
              </thead>

              <tbody>
                {recentLogs.length ? (
                  recentLogs.map((log) => (
                    <tr key={log.id} className="border-t">
                      <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                        {formatDateTime(log.createdAt)}
                      </td>

                      <td className="px-4 py-3 font-semibold">
                        {log.targetName}
                      </td>

                      <td className="px-4 py-3 text-muted-foreground">
                        {log.targetEmail}
                      </td>

                      <td className="px-4 py-3">
                        {getLogStatusBadge(log.status)}
                      </td>

                      <td className="max-w-md px-4 py-3 text-muted-foreground">
                        {log.errorMessage ?? "-"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="h-24 px-4 py-3 text-center text-muted-foreground"
                    >
                      Belum ada log pengiriman email aktivasi.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}