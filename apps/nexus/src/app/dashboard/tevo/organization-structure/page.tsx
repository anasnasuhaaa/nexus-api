import { prisma } from "@orma/database";
import { BadgeCheck, Building2, Landmark, UsersRound } from "lucide-react";

function formatText(value: unknown) {
  if (!value) return "-";

  return String(value)
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export default async function OrganizationStructurePage() {
  const activeCabinet = await prisma.cabinetPeriod.findFirst({
    where: {
      isActive: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      name: true,
    },
  });

  const birdeps = await prisma.birdep.findMany({
    where: {
      isActive: true,
      ...(activeCabinet
        ? {
            cabinetPeriodId: activeCabinet.id,
          }
        : {}),
    },
    orderBy: {
      name: "asc",
    },
    include: {
      memberships: {
        orderBy: {
          createdAt: "asc",
        },
        include: {
          member: true,
        },
      },
    },
  });

  const totalMembers = birdeps.reduce(
    (total, birdep) => total + birdep.memberships.length,
    0,
  );

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border bg-card p-6 shadow-sm">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
            Tevo / Struktur Organisasi
          </p>

          <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
            Struktur Organisasi Publik
          </h1>

          <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">
            Halaman ini menyusun data Birdep dan anggota aktif dari Nexus untuk
            menjadi dasar struktur organisasi publik Tevo.
          </p>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-3xl border bg-card p-5 shadow-sm">
          <div className="mb-4 flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <BadgeCheck className="size-5" />
          </div>
          <p className="text-sm text-muted-foreground">Kabinet Aktif</p>
          <p className="mt-2 text-xl font-black tracking-tight">
            {activeCabinet?.name ?? "-"}
          </p>
        </div>

        <div className="rounded-3xl border bg-card p-5 shadow-sm">
          <div className="mb-4 flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Landmark className="size-5" />
          </div>
          <p className="text-sm text-muted-foreground">Birdep Aktif</p>
          <p className="mt-2 text-3xl font-black tracking-tight">
            {birdeps.length}
          </p>
        </div>

        <div className="rounded-3xl border bg-card p-5 shadow-sm">
          <div className="mb-4 flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <UsersRound className="size-5" />
          </div>
          <p className="text-sm text-muted-foreground">Membership</p>
          <p className="mt-2 text-3xl font-black tracking-tight">
            {totalMembers}
          </p>
        </div>
      </section>

      <section className="grid gap-4">
        {birdeps.length ? (
          birdeps.map((birdep) => (
            <div
              key={birdep.id}
              className="rounded-3xl border bg-card p-5 shadow-sm"
            >
              <div className="mb-5 flex items-start gap-4">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Building2 className="size-5" />
                </div>

                <div>
                  <h2 className="text-xl font-black tracking-tight">
                    {birdep.name}
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {birdep.code} · {birdep.memberships.length} anggota
                  </p>
                </div>
              </div>

              {birdep.memberships.length ? (
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {birdep.memberships.map((membership) => (
                    <div
                      key={membership.id}
                      className="rounded-2xl border bg-background p-4"
                    >
                      <p className="font-bold">{membership.member.fullName}</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {formatText(membership.organizationalPosition)}
                      </p>
                      {membership.internalTitle ? (
                        <p className="mt-1 text-xs text-muted-foreground">
                          {membership.internalTitle}
                        </p>
                      ) : null}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed p-5 text-sm text-muted-foreground">
                  Belum ada anggota pada Birdep ini.
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="rounded-3xl border border-dashed bg-card p-6 text-sm text-muted-foreground">
            Belum ada data struktur organisasi yang bisa ditampilkan.
          </div>
        )}
      </section>
    </div>
  );
}