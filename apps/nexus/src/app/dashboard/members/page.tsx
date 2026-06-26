import { prisma } from "@orma/database";
import {
  BadgeCheck,
  Search,
  UserRound,
  UsersRound,
} from "lucide-react";

function getPositionLabel(position: string) {
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

  return labels[position] ?? position;
}

async function getMembers() {
  return prisma.member.findMany({
    orderBy: {
      fullName: "asc",
    },
    include: {
      memberships: {
        orderBy: {
          createdAt: "desc",
        },
        include: {
          cabinetPeriod: true,
          primaryBirdep: true,
        },
      },
      users: {
        select: {
          id: true,
          email: true,
          role: true,
          mustChangePassword: true,
        },
      },
    },
  });
}

export default async function MembersPage() {
  const members = await getMembers();

  const activeMembers = members.filter((member) => member.isActive);
  const membersWithAccount = members.filter((member) => member.users.length > 0);

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
              Data Anggota
            </p>

            <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              Anggota Organisasi
            </h1>

            <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">
              Halaman ini membaca data langsung dari database. Untuk tahap ini,
              tabel masih bersifat read-only dan digunakan untuk memastikan
              relasi Member, Membership, Birdep, dan User sudah berjalan.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-2xl border bg-background px-3 py-2 text-sm text-muted-foreground">
            <Search className="size-4" />
            Search dan filter akan dibuat di tahap berikutnya
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-3xl border bg-card p-5 shadow-sm">
          <div className="mb-4 flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <UsersRound className="size-5" />
          </div>

          <p className="text-sm font-medium text-muted-foreground">
            Total Anggota
          </p>

          <p className="mt-2 text-3xl font-black tracking-tight">
            {members.length}
          </p>
        </div>

        <div className="rounded-3xl border bg-card p-5 shadow-sm">
          <div className="mb-4 flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <BadgeCheck className="size-5" />
          </div>

          <p className="text-sm font-medium text-muted-foreground">
            Anggota Aktif
          </p>

          <p className="mt-2 text-3xl font-black tracking-tight">
            {activeMembers.length}
          </p>
        </div>

        <div className="rounded-3xl border bg-card p-5 shadow-sm">
          <div className="mb-4 flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <UserRound className="size-5" />
          </div>

          <p className="text-sm font-medium text-muted-foreground">
            Punya Akun Login
          </p>

          <p className="mt-2 text-3xl font-black tracking-tight">
            {membersWithAccount.length}
          </p>
        </div>
      </section>

      <section className="overflow-hidden rounded-3xl border bg-card shadow-sm">
        <div className="border-b px-5 py-4">
          <h2 className="font-black tracking-tight">Tabel Anggota</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Menampilkan data awal dari database Nexus.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-left text-sm">
            <thead className="border-b bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-5 py-3 font-semibold">#</th>
                <th className="px-5 py-3 font-semibold">Nama</th>
                <th className="px-5 py-3 font-semibold">NIM</th>
                <th className="px-5 py-3 font-semibold">Birdep</th>
                <th className="px-5 py-3 font-semibold">Jabatan</th>
                <th className="px-5 py-3 font-semibold">Akun</th>
                <th className="px-5 py-3 font-semibold">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {members.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-10 text-center text-muted-foreground"
                  >
                    Belum ada data anggota.
                  </td>
                </tr>
              ) : (
                members.map((member, index) => {
                  const latestMembership = member.memberships[0];
                  const user = member.users[0];

                  return (
                    <tr key={member.id} className="align-top">
                      <td className="px-5 py-4 text-muted-foreground">
                        {index + 1}
                      </td>

                      <td className="px-5 py-4">
                        <div className="font-semibold">{member.fullName}</div>

                        {member.instagram ? (
                          <div className="mt-1 text-xs text-muted-foreground">
                            @{member.instagram}
                          </div>
                        ) : null}
                      </td>

                      <td className="px-5 py-4 text-muted-foreground">
                        {member.nim}
                      </td>

                      <td className="px-5 py-4">
                        {latestMembership ? (
                          <div>
                            <div className="font-medium">
                              {latestMembership.primaryBirdep.name}
                            </div>
                            <div className="mt-1 text-xs text-muted-foreground">
                              {latestMembership.cabinetPeriod.name}
                            </div>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">
                            Belum ada membership
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-4">
                        {latestMembership ? (
                          <div>
                            <span className="inline-flex rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                              {getPositionLabel(
                                latestMembership.organizationalPosition,
                              )}
                            </span>

                            {latestMembership.internalTitle ? (
                              <div className="mt-2 text-xs text-muted-foreground">
                                {latestMembership.internalTitle}
                              </div>
                            ) : null}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </td>

                      <td className="px-5 py-4">
                        {user ? (
                          <div>
                            <div className="font-medium">{user.email}</div>
                            <div className="mt-1 text-xs text-muted-foreground">
                              Role: {user.role}
                            </div>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">
                            Belum punya akun
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-4">
                        {member.isActive ? (
                          <span className="inline-flex rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                            Aktif
                          </span>
                        ) : (
                          <span className="inline-flex rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground">
                            Nonaktif
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}