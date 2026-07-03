"use client";

import { Eye, EyeOff, KeyRound, Loader2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import { resetMemberUserPasswordAction } from "./reset-password-action";

type ResetPasswordButtonProps = {
  memberId: string;
  userId: string;
  userEmail: string;
};

export function ResetPasswordButton({
  memberId,
  userId,
  userEmail,
}: ResetPasswordButtonProps) {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [temporaryPassword, setTemporaryPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  function closeModal() {
    if (isSubmitting) {
      return;
    }

    setIsOpen(false);
    setTemporaryPassword("");
    setConfirmPassword("");
    setShowPassword(false);
  }

  async function handleSubmit() {
    setIsSubmitting(true);

    const response = await resetMemberUserPasswordAction(
      memberId,
      userId,
      temporaryPassword,
      confirmPassword,
    );

    setIsSubmitting(false);

    if (!response.success) {
      toast.error("Gagal reset password", {
        description: response.message,
        duration: 2000,
      });
      return;
    }

    toast.success("Password berhasil direset", {
      description: response.message,
      duration: 2000,
    });

    closeModal();
    router.replace(`/dashboard/members/${memberId}`);
    router.refresh();
  }

  return (
    <>
      <Button
        type="button"
        variant="outline"
        onClick={() => setIsOpen(true)}
        className="border-primary/30 text-primary hover:bg-primary/10 hover:text-primary"
      >
        <KeyRound className="size-4" />
        Reset Password
      </Button>

      {isOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-lg rounded-3xl border bg-card p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-black tracking-tight">
                  Reset password user?
                </h2>

                <p className="mt-2 text-sm leading-7 text-muted-foreground">
                  Password akun akan diganti menjadi password sementara. User
                  akan diwajibkan mengganti password saat login berikutnya.
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={isSubmitting}
                className="rounded-xl border p-2 text-muted-foreground transition hover:text-foreground"
                aria-label="Tutup modal"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="mt-5 rounded-2xl border bg-card p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Akun User
              </p>
              <p className="mt-2 wrap-break-word font-bold">{userEmail}</p>
            </div>

            <div className="mt-5 space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="temporaryPassword"
                  className="text-sm font-semibold"
                >
                  Password sementara
                </label>

                <div className="relative">
                  <input
                    id="temporaryPassword"
                    type={showPassword ? "text" : "password"}
                    value={temporaryPassword}
                    onChange={(event) =>
                      setTemporaryPassword(event.target.value)
                    }
                    placeholder="Minimal 8 karakter"
                    className="w-full rounded-xl border border-input bg-background px-3 py-2 pr-11 text-sm outline-none focus:ring-2 focus:ring-ring"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground"
                    aria-label={
                      showPassword
                        ? "Sembunyikan password"
                        : "Tampilkan password"
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
                <label
                  htmlFor="confirmPassword"
                  className="text-sm font-semibold"
                >
                  Konfirmasi password
                </label>

                <input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="Ulangi password sementara"
                  className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <p className="text-xs leading-6 text-muted-foreground">
                Setelah reset, berikan password sementara ini kepada user secara
                aman. User akan diminta mengganti password sendiri.
              </p>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={closeModal}
                disabled={isSubmitting}
              >
                Batal
              </Button>

              <Button
                type="button"
                onClick={handleSubmit}
                disabled={
                  isSubmitting ||
                  temporaryPassword.length < 8 ||
                  temporaryPassword !== confirmPassword
                }
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Mereset...
                  </>
                ) : (
                  <>
                    <KeyRound className="size-4" />
                    Reset Password
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}