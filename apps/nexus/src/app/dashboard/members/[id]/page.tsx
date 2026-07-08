import { prisma } from "@orma/database";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  BadgeCheck,
  Building2,
  CalendarDays,
  Mail,
  Pencil,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import { MemberLifecycleButton } from "./member-lifecycle-button";
import { ResetPasswordButton } from "./reset-password-button";

type MemberDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

type InfoItemProps = {
  label: string;
  value: string | number;
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

function formatText(value: unknown) {
  if (value === null || value === undefined || value === "") {
    return "-";
  }

  return String(value)
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function getRecordValue(record: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const value = record[key];

    if (value !== null && value !== undefined && value !== "") {
      return value;
    }
  }

  return "-";
}

function getObjectRecord(
  record: Record<string, unknown>,
  keys: string[],
): Record<string, unknown> {
  for (const key of keys) {
    const value = record[key];

    if (value && typeof value === "object" && !Array.isArray(value)) {
      return value as Record<string, unknown>;
    }
  }

  return {};
}

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

async function getMemberDetail(memberId: string) {
  const member = await prisma.member.findUnique({
    where: {
      id: memberId,
    },
    include: {
      memberships: {
        orderBy: {
          createdAt: "desc",
        },
        include: {
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
            },
          },
        },
      },
    },
  });

  if (!member) {
    return null;
  }

  const linkedUser = await prisma.user.findFirst({
    where: {
      memberId: member.id,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      mustChangePassword: true,
      banned: true,
      createdAt: true,
    },
  });

  const activeCabinetPeriod = await prisma.cabinetPeriod.findFirst({
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
      isActive: true,
    },
  });

  return {
    member,
    linkedUser,
    activeCabinetPeriod,
  };
}

export default async function MemberDetailPage({
  params,
}: MemberDetailPageProps) {
  const { id } = await params;
  const result = await getMemberDetail(id);

  if (!result) {
    notFound();
  }

  const { member, linkedUser, activeCabinetPeriod } = result;

  const memberRecord = member as unknown as Record<string, unknown>;

  const memberName = String(
    getRecordValue(memberRecord, ["fullName", "name", "fullname"]),
  );

  const memberEmail = String(getRecordValue(memberRecord, ["email"]));

  const memberNim = String(
    getRecordValue(memberRecord, ["nim", "studentId", "studentNumber"]),
  );

  const memberPhone = String(
    getRecordValue(memberRecord, [
      "phone",
      "phoneNumber",
      "whatsapp",
      "whatsappNumber",
    ]),
  );

  const memberInstagram = String(
    getRecordValue(memberRecord, ["instagram", "instagramUsername"]),
  );

  const activeCabinetRecord =
    activeCabinetPeriod as unknown as Record<string, unknown> | null;

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border bg-card p-6 shadow-sm">
        <div className="mb-4 flex flex-wrap gap-2">
          <Link href="/dashboard/members">
            <Button variant="outline">
              <ArrowLeft className="size-4" />
              Kembali
            </Button>
          </Link>

          <Link href={`/dashboard/members/${member.id}/edit`}>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Pencil className="size-4" />
              Edit Anggota
            </Button>
          </Link>

          <MemberLifecycleButton
            memberId={member.id}
            memberName={memberName}
            isActive={member.isActive}
          />
        </div>

        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
              Detail Anggota
            </p>

            <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              {memberName}
            </h1>

            <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">
              Detail data anggota, status keanggotaan, membership organisasi,
              serta akun login yang terhubung dengan Nexus.
            </p>
          </div>

          <div>
            {member.isActive ? (
              <span className="inline-flex rounded-full bg-status-active-soft px-3 py-1 text-sm font-semibold text-status-active">
                Aktif
              </span>
            ) : (
              <span className="inline-flex rounded-full bg-status-inactive-soft px-3 py-1 text-sm font-semibold text-status-inactive">
                Nonaktif
              </span>
            )}
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-3xl border bg-card p-5 shadow-sm">
          <div className="mb-4 flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <UserRound className="size-5" />
          </div>

          <p className="text-sm text-muted-foreground">Nama Anggota</p>
          <p className="mt-2 text-lg font-black tracking-tight">
            {memberName}
          </p>
        </div>

        <div className="rounded-3xl border bg-card p-5 shadow-sm">
          <div className="mb-4 flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Mail className="size-5" />
          </div>

          <p className="text-sm text-muted-foreground">Email</p>
          <p className="mt-2 wrap-break-word text-lg font-black tracking-tight">
            {memberEmail}
          </p>
        </div>

        <div className="rounded-3xl border bg-card p-5 shadow-sm">
          <div className="mb-4 flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <BadgeCheck className="size-5" />
          </div>

          <p className="text-sm text-muted-foreground">NIM</p>
          <p className="mt-2 text-lg font-black tracking-tight">
            {memberNim}
          </p>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border bg-card p-6 shadow-sm">
          <div className="mb-5">
            <h2 className="font-black tracking-tight">Informasi Anggota</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Data dasar anggota yang tersimpan di database Nexus.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <InfoItem label="Nama" value={memberName} />
            <InfoItem label="Email" value={memberEmail} />
            <InfoItem label="NIM" value={memberNim} />
            <InfoItem label="Nomor HP / WhatsApp" value={memberPhone} />
            <InfoItem label="Instagram" value={memberInstagram} />
            <InfoItem
              label="Status Anggota"
              value={member.isActive ? "Aktif" : "Nonaktif"}
            />
            <InfoItem
              label="Dibuat Pada"
              value={formatDate(member.createdAt)}
            />
            <InfoItem
              label="Diperbarui Pada"
              value={formatDate(member.updatedAt)}
            />
          </div>
        </div>

        <div className="rounded-3xl border bg-card p-6 shadow-sm">
          <div className="mb-5">
            <h2 className="font-black tracking-tight">Akun Login</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Akun Better Auth yang terhubung dengan anggota ini.
            </p>
          </div>

          {linkedUser ? (
            <div className="space-y-4">
              <div className="flex items-start gap-4 rounded-2xl border bg-card p-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <ShieldCheck className="size-5" />
                </div>

                <div className="min-w-0">
                  <p className="font-bold">{linkedUser.name}</p>
                  <p className="mt-1 wrap-break-word text-sm text-muted-foreground">
                    {linkedUser.email}
                  </p>
                </div>
              </div>

              <div className="grid gap-3">
                <InfoItem
                  label="Role Utama"
                  value={formatText(linkedUser.role)}
                />
                <InfoItem
                  label="Wajib Ganti Password"
                  value={linkedUser.mustChangePassword ? "Ya" : "Tidak"}
                />
                <InfoItem
                  label="Status Login"
                  value={linkedUser.banned ? "Dibekukan" : "Aktif"}
                />
                <InfoItem
                  label="Akun Dibuat"
                  value={formatDate(linkedUser.createdAt)}
                />
              </div>

              <ResetPasswordButton
                memberId={member.id}
                userId={linkedUser.id}
                userEmail={linkedUser.email}
              />
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed bg-card p-5 text-sm leading-7 text-muted-foreground">
              Belum ada akun login yang terhubung dengan anggota ini.
            </div>
          )}
        </div>
      </section>

      <section className="rounded-3xl border bg-card p-6 shadow-sm">
        <div className="mb-5">
          <h2 className="font-black tracking-tight">Membership Organisasi</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Riwayat keanggotaan anggota dalam periode kabinet dan Birdep.
          </p>
        </div>

        {member.memberships.length ? (
          <div className="space-y-3">
            {member.memberships.map((membership) => {
              const membershipRecord =
                membership as unknown as Record<string, unknown>;

              const primaryBirdepRecord = getObjectRecord(membershipRecord, [
                "primaryBirdep",
              ]);

              const cabinetPeriodRecord = getObjectRecord(membershipRecord, [
                "cabinetPeriod",
                "period",
              ]);

              const birdepName = String(
                getRecordValue(primaryBirdepRecord, ["name"]),
              );

              const birdepCode = String(
                getRecordValue(primaryBirdepRecord, ["code"]),
              );

              const fallbackCabinetName = activeCabinetRecord
                ? getRecordValue(activeCabinetRecord, ["name"])
                : "-";

              const fallbackCabinetPeriodRange = activeCabinetPeriod
                ? `${formatDate(activeCabinetPeriod.startDate)} - ${formatDate(
                    activeCabinetPeriod.endDate,
                  )}`
                : "-";

              const cabinetPeriodName = String(
                getRecordValue(cabinetPeriodRecord, ["name"]) === "-"
                  ? fallbackCabinetName
                  : getRecordValue(cabinetPeriodRecord, ["name"]),
              );

              const cabinetStartDate = getRecordValue(cabinetPeriodRecord, [
                "startDate",
              ]);
              const cabinetEndDate = getRecordValue(cabinetPeriodRecord, [
                "endDate",
              ]);

              const cabinetPeriodRange =
                cabinetStartDate === "-"
                  ? fallbackCabinetPeriodRange
                  : `${formatDate(cabinetStartDate as Date)} - ${formatDate(
                      cabinetEndDate as Date,
                    )}`;

              const cabinetPeriodIsActive =
                getRecordValue(cabinetPeriodRecord, ["isActive"]) === true ||
                getRecordValue(activeCabinetRecord ?? {}, ["isActive"]) ===
                  true;

              const membershipId = String(
                getRecordValue(membershipRecord, ["id"]),
              );

              return (
                <div
                  key={membershipId}
                  className="rounded-2xl border bg-card p-4"
                >
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex items-start gap-4">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Building2 className="size-5" />
                      </div>

                      <div>
                        <p className="font-bold">{birdepName}</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {birdepCode}
                        </p>
                      </div>
                    </div>

                    <div className="flex w-fit items-center gap-2 rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
                      <CalendarDays className="size-3.5" />
                      {cabinetPeriodName} · {cabinetPeriodRange}
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    <InfoItem
                      label="Posisi"
                      value={formatText(
                        getRecordValue(membershipRecord, [
                          "organizationalPosition",
                          "position",
                          "memberPosition",
                        ]),
                      )}
                    />

                    <InfoItem
                      label="Jabatan Internal"
                      value={formatText(
                        getRecordValue(membershipRecord, [
                          "internalTitle",
                          "title",
                          "positionTitle",
                        ]),
                      )}
                    />

                    <InfoItem
                      label="Periode Aktif"
                      value={cabinetPeriodIsActive ? "Ya" : "Tidak"}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed bg-card p-5 text-sm leading-7 text-muted-foreground">
            Belum ada data membership untuk anggota ini.
          </div>
        )}
      </section>
    </div>
  );
}