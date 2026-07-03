"use client";

import { Loader2, Power, PowerOff, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import { updateMemberActiveStatusAction } from "./member-lifecycle-action";

type MemberLifecycleButtonProps = {
  memberId: string;
  memberName: string;
  isActive: boolean;
};

export function MemberLifecycleButton({
  memberId,
  memberName,
  isActive,
}: MemberLifecycleButtonProps) {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const nextStatus = !isActive;

  function closeModal() {
    if (isSubmitting) {
      return;
    }

    setIsOpen(false);
  }

  async function handleSubmit() {
    setIsSubmitting(true);
    const response = await updateMemberActiveStatusAction(memberId, nextStatus);
    setIsSubmitting(false);

    if (!response.success) {
      toast.error("Gagal memperbarui status anggota", {
        description: response.message,
        duration: 2000,
      });
      return;
    }

    toast.success("Status anggota diperbarui", {
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
        className={
          isActive
            ? "border-status-inactive/30 text-status-inactive hover:bg-status-inactive-soft hover:text-status-inactive"
            : "border-status-active/30 text-status-active hover:bg-status-active-soft hover:text-status-active"
        }
      >
        {isActive ? (
          <>
            <PowerOff className="size-4" />
            Nonaktifkan
          </>
        ) : (
          <>
            <Power className="size-4" />
            Aktifkan
          </>
        )}
      </Button>

      {isOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-lg rounded-3xl border bg-card p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-black tracking-tight">
                  {isActive
                    ? "Nonaktifkan anggota?"
                    : "Aktifkan kembali anggota?"}
                </h2>

                <p className="mt-2 text-sm leading-7 text-muted-foreground">
                  {isActive
                    ? "Anggota akan ditandai sebagai nonaktif. Data anggota tidak dihapus dan tetap tersimpan di database Nexus."
                    : "Anggota akan ditandai aktif kembali dan dapat digunakan dalam data organisasi."}
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
                Anggota
              </p>
              <p className="mt-2 font-bold">{memberName}</p>
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
                disabled={isSubmitting}
                className={
                  isActive
                    ? "bg-status-inactive text-status-inactive-foreground hover:bg-status-inactive/90"
                    : "bg-status-active text-status-active-foreground hover:bg-status-active/90"
                }
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Menyimpan...
                  </>
                ) : isActive ? (
                  <>
                    <PowerOff className="size-4" />
                    Ya, nonaktifkan
                  </>
                ) : (
                  <>
                    <Power className="size-4" />
                    Ya, aktifkan
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