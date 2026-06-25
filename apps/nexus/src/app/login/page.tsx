import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ShieldCheck } from "lucide-react";

import { ModeToggle } from "@/components/theme/mode-toggle";
import { auth } from "@/lib/auth";

import { LoginForm } from "./login-form";

export default async function LoginPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect("/dashboard");
  }

  return (
    <main className="flex min-h-screen bg-background text-foreground">
      <section className="hidden flex-1 bg-primary p-10 text-primary-foreground lg:flex lg:flex-col lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-2xl bg-white/15">
            <ShieldCheck className="size-5" />
          </div>

          <div>
            <p className="text-lg font-black">Nexus</p>
            <p className="text-sm text-white/75">Ormawa Eksekutif PKU IPB</p>
          </div>
        </div>

        <div className="max-w-xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.26em] text-white/70">
            Kabinet Astana Angkasa
          </p>

          <h1 className="text-5xl font-black leading-tight tracking-tight">
            Sistem internal untuk monitoring organisasi yang lebih rapi.
          </h1>

          <p className="mt-5 max-w-lg text-base leading-8 text-white/75">
            Login hanya tersedia untuk pengurus yang memiliki akun resmi.
            Registrasi publik tidak diaktifkan.
          </p>
        </div>

        <p className="text-xs text-white/60">
          © 2026 Nexus — Internal Organization System
        </p>
      </section>

      <section className="flex min-h-screen w-full items-center justify-center px-4 py-10 lg:w-130">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3 lg:hidden">
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <ShieldCheck className="size-5" />
              </div>

              <div>
                <p className="font-black">Nexus</p>
                <p className="text-xs text-muted-foreground">
                  Ormawa Eksekutif PKU IPB
                </p>
              </div>
            </div>

            <div className="ml-auto">
              <ModeToggle />
            </div>
          </div>

          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
            Login Pengurus
          </p>

          <h2 className="mt-3 text-3xl font-black tracking-tight">
            Masuk ke Nexus
          </h2>

          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            Gunakan akun yang sudah dibuat oleh Super Admin untuk mengakses
            dashboard internal organisasi.
          </p>

          <LoginForm />
        </div>
      </section>
    </main>
  );
}