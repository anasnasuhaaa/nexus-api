import { prisma } from "@orma/database";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  BadgeCheck,
  Building2,
  CalendarDays,
  IdCard,
  Landmark,
  Mail,
  Pencil,
  Phone,
  UserRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import { MemberLifecycleButton } from "./member-lifecycle-button";

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

function getPositionLabel(position: string | null | undefined) {
  if (!position) {
    return "-";
  }

  const labels: Record<string, string> = {
    KETUA_ORGANISASI: "Ketua Organisasi",
    WAKIL_KETUA_ORGANISASI: "Wakil Ketua Organisasi",
    SEKRETARIS_INTERNAL: "Sekretaris Internal",
    SEKRETARIS_EKSTERNAL: "Sekretaris Eksternal",
    BENDAHARA_INTERNAL: "Bendahara Internal",
    BENDAHARA_EKSTERNAL: "Bendahara Eksternal",
    KETUA_BIRDEP: "Ketua Birdep",
    SEKRETARIS_BIRDEP: "Sekretaris Birdep",
    BENDAHARA_BIRDEP: "Bendahara Birdep",
    ANGGOTA_BIRDEP: "Anggota Birdep",
  };

  return labels[position] ?? formatText(position);
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
  return prisma.member.findUnique({
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
              unitType: true,
              description: true,
              focusArea: true,
            },
          },
        },
      },
    },
  });
}

export default async function MemberDetailPage({
  params,
}: MemberDetailPageProps) {
  const { id } = await params;
  const member = await getMemberDetail(id);

  if (!member) {
    notFound();
  }

  const latestMembership = member.memberships[0];
  const latestBirdep = latestMembership?.primaryBirdep;
  const latestCabinet = latestMembership?.cabinetPeriod;

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

  const latestPositionLabel = getPositionLabel(
    latestMembership?.organizationalPosition,
  );

  const latestInternalTitle = latestMembership?.internalTitle ?? "-";
  const latestBirdepName = latestBirdep?.name ?? "Belum ada Birdep";
  const latestBirdepCode = latestBirdep?.code ?? "-";
  const latestCabinetName = latestCabinet?.name ?? "-";

  const latestCabinetRange =
    latestCabinet?.startDate || latestCabinet?.endDate
      ? `${formatDate(latestCabinet.startDate)} - ${formatDate(
          latestCabinet.endDate,
        )}`
      : "-";

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
              Detail identitas anggota dan perannya di organisasi. Pengaturan
              akun login, aktivasi, reset password, role akses, dan ban user
              dikelola melalui menu Akun & Akses.
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

      <section className="grid gap-4 lg:grid-cols-4">
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
            <IdCard className="size-5" />
          </div>

          <p className="text-sm text-muted-foreground">NIM</p>
          <p className="mt-2 text-lg font-black tracking-tight">
            {memberNim}
          </p>
        </div>

        <div className="rounded-3xl border bg-card p-5 shadow-sm">
          <div className="mb-4 flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Landmark className="size-5" />
          </div>

          <p className="text-sm text-muted-foreground">Birdep Saat Ini</p>
          <p className="mt-2 text-lg font-black tracking-tight">
            {latestBirdepCode}
          </p>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            {latestBirdepName}
          </p>
        </div>

        <div className="rounded-3xl border bg-card p-5 shadow-sm">
          <div className="mb-4 flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <BadgeCheck className="size-5" />
          </div>

          <p className="text-sm text-muted-foreground">Jabatan Saat Ini</p>
          <p className="mt-2 text-lg font-black tracking-tight">
            {latestPositionLabel}
          </p>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-6">
          <section className="rounded-3xl border bg-card p-6 shadow-sm">
            <div className="mb-5">
              <h2 className="font-black tracking-tight">Informasi Anggota</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Data identitas anggota yang tersimpan di database Nexus.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <InfoItem label="Nama" value={memberName} />
              <InfoItem label="NIM" value={memberNim} />
              <InfoItem label="Email" value={memberEmail} />
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
          </section>

          <section className="rounded-3xl border bg-card p-6 shadow-sm">
            <div className="mb-5">
              <h2 className="font-black tracking-tight">
                Peran Organisasi Saat Ini
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Ringkasan membership terbaru anggota ini.
              </p>
            </div>

            {latestMembership ? (
              <div className="space-y-4">
                <div className="rounded-2xl border bg-background p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <Building2 className="size-5" />
                    </div>

                    <div>
                      <p className="font-black">{latestBirdepName}</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {latestBirdepCode}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4">
                  <InfoItem label="Jabatan" value={latestPositionLabel} />
                  <InfoItem
                    label="Jabatan Internal"
                    value={latestInternalTitle}
                  />
                  <InfoItem label="Periode Kabinet" value={latestCabinetName} />
                  <InfoItem label="Rentang Periode" value={latestCabinetRange} />
                  <InfoItem
                    label="Periode Aktif"
                    value={latestCabinet?.isActive ? "Ya" : "Tidak"}
                  />
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed bg-card p-5 text-sm leading-7 text-muted-foreground">
                Anggota ini belum memiliki membership organisasi. Tambahkan atau
                edit data anggota untuk menghubungkan anggota ke Birdep dan
                jabatan.
              </div>
            )}
          </section>
        </div>

        <section className="rounded-3xl border bg-card p-6 shadow-sm">
          <div className="mb-5">
            <h2 className="font-black tracking-tight">Riwayat Membership</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Riwayat peran anggota dalam periode kabinet dan Birdep.
            </p>
          </div>

          {member.memberships.length ? (
            <div className="space-y-3">
              {member.memberships.map((membership) => {
                const birdep = membership.primaryBirdep;
                const cabinet = membership.cabinetPeriod;

                const birdepName = birdep?.name ?? "Belum ada Birdep";
                const birdepCode = birdep?.code ?? "-";
                const positionLabel = getPositionLabel(
                  membership.organizationalPosition,
                );

                const cabinetName = cabinet?.name ?? "-";
                const cabinetRange =
                  cabinet?.startDate || cabinet?.endDate
                    ? `${formatDate(cabinet.startDate)} - ${formatDate(
                        cabinet.endDate,
                      )}`
                    : "-";

                return (
                  <div
                    key={membership.id}
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
                        {cabinetName}
                      </div>
                    </div>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <InfoItem label="Jabatan" value={positionLabel} />

                      <InfoItem
                        label="Jabatan Internal"
                        value={membership.internalTitle ?? "-"}
                      />

                      <InfoItem label="Rentang Periode" value={cabinetRange} />

                      <InfoItem
                        label="Periode Aktif"
                        value={cabinet?.isActive ? "Ya" : "Tidak"}
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
      </section>

      <section className="rounded-3xl border bg-muted/40 p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h2 className="font-black tracking-tight">
              Informasi akun login tidak ditampilkan di halaman ini
            </h2>
            <p className="mt-1 max-w-3xl text-sm leading-7 text-muted-foreground">
              Halaman ini hanya berfokus pada data anggota dan peran organisasi.
              Untuk mengelola akun login, aktivasi, reset password, role akses,
              dan ban user, gunakan menu Akun & Akses.
            </p>
          </div>

          <Link href="/dashboard/users">
            <Button variant="outline">
              <UserRound className="size-4" />
              Buka Akun & Akses
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}