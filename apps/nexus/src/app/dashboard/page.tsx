import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ShieldCheck, UserRound } from "lucide-react";

import { ModeToggle } from "@/components/theme/mode-toggle";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b bg-card">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <ShieldCheck className="size-5" />
            </div>

            <div>
              <p className="text-lg font-bold tracking-tight">Nexus</p>
              <p className="text-xs text-muted-foreground">
                Dashboard Internal
              </p>
            </div>
          </div>

          <ModeToggle />
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-3xl border bg-card p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <UserRound className="size-6" />
            </div>

            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
                Login Berhasil
              </p>

              <h1 className="mt-2 text-3xl font-black tracking-tight">
                Selamat datang, {session.user.name}
              </h1>

              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                Fondasi autentikasi Nexus sudah aktif. Tahap berikutnya kita
                akan membangun layout dashboard dengan sidebar, role display,
                dan menu awal Super Admin.
              </p>

              <div className="mt-6 rounded-2xl border bg-background p-4 text-sm">
                <p>
                  <span className="font-semibold">Email:</span>{" "}
                  {session.user.email}
                </p>

                <p className="mt-2">
                  <span className="font-semibold">User ID:</span>{" "}
                  {session.user.id}
                </p>
              </div>

              <Button className="mt-6 bg-primary text-primary-foreground hover:bg-primary/90">
                Dashboard Foundation Siap
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}