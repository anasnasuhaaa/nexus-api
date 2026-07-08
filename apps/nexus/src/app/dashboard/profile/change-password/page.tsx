import { prisma } from "@orma/database";
import Link from "next/link";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { ArrowLeft, KeyRound, ShieldAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";

import { ChangePasswordForm } from "./change-password-form";

async function getCurrentUser() {
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
      name: true,
      email: true,
      mustChangePassword: true,
    },
  });
}

export default async function ChangePasswordPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border bg-card p-6 shadow-sm">
        <div className="mb-4">
          <Link href="/dashboard/profile">
            <Button variant="outline">
              <ArrowLeft className="size-4" />
              Kembali ke Profil
            </Button>
          </Link>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
            Keamanan Akun
          </p>

          <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
            Ganti Password
          </h1>

          <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">
            Perbarui password akun Nexus kamu secara berkala untuk menjaga
            keamanan akses dashboard.
          </p>
        </div>
      </section>

      {user.mustChangePassword ? (
        <section className="rounded-3xl border border-primary/20 bg-primary/5 p-5 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
              <ShieldAlert className="size-5" />
            </div>

            <div>
              <h2 className="font-black tracking-tight">
                Kamu wajib mengganti password
              </h2>
              <p className="mt-1 text-sm leading-7 text-muted-foreground">
                Akun kamu ditandai wajib mengganti password. Setelah password
                baru disimpan, kamu bisa mengakses dashboard seperti biasa.
              </p>
            </div>
          </div>
        </section>
      ) : null}

      <section className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-3xl border bg-card p-6 shadow-sm">
          <div className="mb-4 flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <KeyRound className="size-5" />
          </div>

          <h2 className="font-black tracking-tight">Akun</h2>
          <p className="mt-2 text-sm leading-7 text-muted-foreground">
            Password akan diperbarui untuk akun berikut.
          </p>

          <div className="mt-5 space-y-3 rounded-2xl border bg-card p-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Nama
              </p>
              <p className="mt-1 font-bold">{user.name}</p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Email
              </p>
              <p className="mt-1 wrap-break-word font-bold">{user.email}</p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border bg-card p-6 shadow-sm">
          <div className="mb-5">
            <h2 className="font-black tracking-tight">Form Ganti Password</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Masukkan password lama dan password baru.
            </p>
          </div>

          <ChangePasswordForm />
        </div>
      </section>
    </div>
  );
}