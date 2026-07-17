"use client";

import { Loader2, Mail, Send, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import { bulkSendActivationLinksAction } from "./bulk-activation-action";

type BulkActivationButtonProps = {
  eligibleCount: number;
};

export function BulkActivationButton({
  eligibleCount,
}: BulkActivationButtonProps) {
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

    const response = await bulkSendActivationLinksAction();

    setIsSubmitting(false);

    if (!response.success) {
      toast.error("Gagal mengirim email aktivasi", {
        description: response.message,
        duration: 2000,
      });
      return;
    }

    toast.success("Email aktivasi berhasil dikirim", {
      description: response.message,
      duration: 2000,
    });

    closeModal();
    router.refresh();
  }

  return (
    <>
      <Button
        type="button"
        variant="outline"
        onClick={() => setIsOpen(true)}
        disabled={eligibleCount === 0}
        className="border-primary/30 text-primary hover:bg-primary/10 hover:text-primary"
      >
        <Mail className="size-4" />
        Kirim Aktivasi Massal
      </Button>

      {isOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-lg rounded-3xl border bg-card p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-black tracking-tight">
                  Kirim email aktivasi massal?
                </h2>

                <p className="mt-2 text-sm leading-7 text-muted-foreground">
                  Sistem akan mengirim link aktivasi/reset password ke user yang
                  belum menyelesaikan aktivasi akun.
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
                Target Pengiriman
              </p>

              <p className="mt-2 text-2xl font-black tracking-tight">
                {eligibleCount} user
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                Hanya user dengan status belum aktivasi yang akan dikirim email.
              </p>
            </div>

            <p className="mt-4 text-xs leading-6 text-muted-foreground">
              Untuk keamanan dan limit email, sistem mengirim maksimal 80 email
              dalam satu kali proses. Jika masih ada sisa user, tombol ini bisa
              digunakan kembali.
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
                disabled={isSubmitting || eligibleCount === 0}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Mengirim...
                  </>
                ) : (
                  <>
                    <Send className="size-4" />
                    Ya, Kirim Email
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