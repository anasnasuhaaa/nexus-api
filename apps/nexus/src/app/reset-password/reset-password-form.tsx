"use client";

import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

type ResetPasswordFormProps = {
  token: string;
};

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (password.length < 8) {
      toast.error("Password terlalu pendek", {
        description: "Password minimal 8 karakter.",
        duration: 2000,
      });
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Konfirmasi tidak sesuai", {
        description: "Konfirmasi password harus sama dengan password baru.",
        duration: 2000,
      });
      return;
    }

    setIsSubmitting(true);

    const { error } = await authClient.resetPassword({
      token,
      newPassword: password,
    });

    setIsSubmitting(false);

    if (error) {
      toast.error("Gagal membuat password baru", {
        description:
          error.message ??
          "Token tidak valid atau sudah kedaluwarsa. Silakan minta link baru.",
        duration: 2000,
      });
      return;
    }

    toast.success("Password berhasil dibuat", {
      description: "Silakan login menggunakan password baru.",
      duration: 2000,
    });

    router.replace("/login");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-semibold">
          Password baru
        </label>

        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Minimal 8 karakter"
            className="w-full rounded-xl border border-input bg-background px-3 py-2 pr-11 text-sm outline-none focus:ring-2 focus:ring-ring"
          />

          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground"
            aria-label={
              showPassword ? "Sembunyikan password" : "Tampilkan password"
            }
          >
            {showPassword ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="confirmPassword" className="text-sm font-semibold">
          Konfirmasi password
        </label>

        <input
          id="confirmPassword"
          type={showPassword ? "text" : "password"}
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          placeholder="Ulangi password baru"
          className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <Button
        type="submit"
        disabled={
          isSubmitting || password.length < 8 || password !== confirmPassword
        }
        className="w-full"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Menyimpan...
          </>
        ) : (
          "Simpan Password Baru"
        )}
      </Button>
    </form>
  );
}