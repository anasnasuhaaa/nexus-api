"use client";

import { KeyRound, Loader2, Mail, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import { sendMemberResetPasswordLinkAction } from "./reset-password-action";

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

  function closeModal() {
    if (isSubmitting) {
      return;
    }

    setIsOpen(false);
  }

  async function handleSubmit() {
    setIsSubmitting(true);

    const response = await sendMemberResetPasswordLinkAction(memberId, userId);

    setIsSubmitting(false);

    if (!response.success) {
      toast.error("Gagal mengirim link", {
        description: response.message,
        duration: 2000,
      });
      return;
    }

    toast.success("Link berhasil dikirim", {
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
        <Mail className="size-4" />
        Kirim Link Aktivasi
      </Button>

      {isOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-lg rounded-3xl border bg-card p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-black tracking-tight">
                  Kirim link aktivasi?
                </h2>

                <p className="mt-2 text-sm leading-7 text-muted-foreground">
                  Sistem akan mengirim email berisi link untuk membuat password
                  baru. User akan mengatur password sendiri melalui link
                  tersebut.
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
                Email Tujuan
              </p>
              <p className="mt-2 wrap-break-word font-bold">{userEmail}</p>
            </div>

            <p className="mt-4 text-xs leading-6 text-muted-foreground">
              Link berlaku selama 1 jam. Jika user tidak menerima email,
              Super Admin dapat mengirim ulang link aktivasi nanti.
            </p>

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
                disabled={isSubmitting}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Mengirim...
                  </>
                ) : (
                  <>
                    <KeyRound className="size-4" />
                    Kirim Link
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