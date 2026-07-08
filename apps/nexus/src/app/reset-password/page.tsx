import Link from "next/link";

import { ResetPasswordForm } from "./reset-password-form";

type ResetPasswordPageProps = {
  searchParams: Promise<{
    token?: string;
    error?: string;
  }>;
};

export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const { token, error } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-10">
      <div className="w-full max-w-md rounded-3xl border bg-card p-6 shadow-sm">
        <div className="mb-6 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
            Nexus
          </p>

          <h1 className="mt-3 text-2xl font-black tracking-tight">
            Buat Password Baru
          </h1>

          <p className="mt-2 text-sm leading-7 text-muted-foreground">
            Masukkan password baru untuk menyelesaikan aktivasi akun atau reset
            password.
          </p>
        </div>

        {error ? (
          <div className="rounded-2xl border border-status-inactive/30 bg-status-inactive-soft p-4 text-sm leading-7 text-status-inactive">
            Link reset password tidak valid atau sudah kedaluwarsa. Silakan
            minta link baru kepada Super Admin.
          </div>
        ) : token ? (
          <ResetPasswordForm token={token} />
        ) : (
          <div className="rounded-2xl border border-status-inactive/30 bg-status-inactive-soft p-4 text-sm leading-7 text-status-inactive">
            Token reset password tidak ditemukan. Silakan buka ulang link dari
            email aktivasi.
          </div>
        )}

        <div className="mt-6 text-center">
          <Link
            href="/login"
            className="text-sm font-semibold text-primary transition hover:underline"
          >
            Kembali ke Login
          </Link>
        </div>
      </div>
    </main>
  );
}