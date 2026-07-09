import { prisma } from "@orma/database";
import Link from "next/link";
import { ArrowRight, UsersRound } from "lucide-react";

import { Button } from "@/components/ui/button";

function formatText(value: unknown) {
  if (!value) return "-";

  return String(value)
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export default async function TevoMembersPage() {
  const members = await prisma.member.findMany({
    where: {
      isActive: true,
    },
    orderBy: {
      fullName: "asc",
    },
    include: {
      memberships: {
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
        include: {
          primaryBirdep: true,
        },
      },
    },
  });

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border bg-card p-6 shadow-sm">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
            Tevo / Anggota Birdep
          </p>

          <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
            Data Anggota Publik
          </h1>

          <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">
            Halaman ini menampilkan data anggota aktif yang dapat digunakan
            sebagai dasar tampilan publik Tevo.
          </p>
        </div>
      </section>

      <section className="rounded-3xl border bg-card p-5 shadow-sm">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <UsersRound className="size-5" />
          </div>

          <div>
            <h2 className="font-black tracking-tight">Anggota Aktif</h2>
            <p className="text-sm text-muted-foreground">
              Total {members.length} anggota aktif.
            </p>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left">Nama</th>
                  <th className="px-4 py-3 text-left">NIM</th>
                  <th className="px-4 py-3 text-left">Birdep</th>
                  <th className="px-4 py-3 text-left">Posisi</th>
                  <th className="px-4 py-3 text-center">Detail</th>
                </tr>
              </thead>

              <tbody>
                {members.map((member) => {
                  const membership = member.memberships[0];

                  return (
                    <tr key={member.id} className="border-t">
                      <td className="px-4 py-3 font-semibold">
                        {member.fullName}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {member.nim}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {membership?.primaryBirdep.name ?? "-"}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {formatText(membership?.organizationalPosition)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Link href={`/dashboard/members/${member.id}`}>
                          <Button variant="outline" size="sm">
                            Detail
                            <ArrowRight className="size-4" />
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}