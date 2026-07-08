"use client";

import { Loader2, Mail, Send, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import { sendSelectedActivationLinksAction } from "./selected-activation-action";

export type ActivationTargetRow = {
  userId: string;
  memberName: string;
  email: string;
  birdepName: string;
  lastSentAt: string | null;
  lastStatus: string | null;
};

type SelectedActivationPanelProps = {
  users: ActivationTargetRow[];
};

export function SelectedActivationPanel({
  users,
}: SelectedActivationPanelProps) {
  const router = useRouter();

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedCount = selectedIds.length;
  const isAllSelected = users.length > 0 && selectedCount === users.length;

  const selectedUsers = useMemo(() => {
    return users.filter((user) => selectedIds.includes(user.userId));
  }, [selectedIds, users]);

  function toggleUser(userId: string) {
    setSelectedIds((current) =>
      current.includes(userId)
        ? current.filter((id) => id !== userId)
        : [...current, userId],
    );
  }

  function toggleAll() {
    if (isAllSelected) {
      setSelectedIds([]);
      return;
    }

    setSelectedIds(users.map((user) => user.userId));
  }

  function closeModal() {
    if (isSubmitting) {
      return;
    }

    setIsOpen(false);
  }

  async function handleSubmit() {
    setIsSubmitting(true);

    const response = await sendSelectedActivationLinksAction(selectedIds);

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

    setSelectedIds([]);
    closeModal();
    router.refresh();
  }

  if (!users.length) {
    return (
      <section className="rounded-3xl border bg-card p-5 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-status-active-soft text-status-active">
            <Mail className="size-5" />
          </div>

          <div>
            <h2 className="font-black tracking-tight">
              Aktivasi Akun Selesai
            </h2>
            <p className="mt-1 text-sm leading-7 text-muted-foreground">
              Tidak ada user yang menunggu email aktivasi saat ini.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="rounded-3xl border bg-card p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h2 className="font-black tracking-tight">
              Kirim Aktivasi Terpilih
            </h2>

            <p className="mt-1 text-sm leading-7 text-muted-foreground">
              Pilih user yang akan dikirimi link aktivasi/reset password. Log
              pengiriman akan tercatat otomatis.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Button type="button" variant="outline" onClick={toggleAll}>
              {isAllSelected ? "Batal Pilih Semua" : "Pilih Semua"}
            </Button>

            <Button
              type="button"
              onClick={() => setIsOpen(true)}
              disabled={selectedCount === 0}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Send className="size-4" />
              Kirim ke {selectedCount} User
            </Button>
          </div>
        </div>

        <div className="mt-5 overflow-hidden rounded-2xl border">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="w-12 px-4 py-3 text-center">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      onChange={toggleAll}
                      aria-label="Pilih semua user"
                    />
                  </th>
                  <th className="px-4 py-3 text-left">Nama</th>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">Birdep</th>
                  <th className="px-4 py-3 text-left">Log Terakhir</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => {
                  const isSelected = selectedIds.includes(user.userId);

                  return (
                    <tr key={user.userId} className="border-t">
                      <td className="px-4 py-3 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleUser(user.userId)}
                          aria-label={`Pilih ${user.memberName}`}
                        />
                      </td>

                      <td className="px-4 py-3 font-semibold">
                        {user.memberName}
                      </td>

                      <td className="px-4 py-3 text-muted-foreground">
                        {user.email}
                      </td>

                      <td className="px-4 py-3 text-muted-foreground">
                        {user.birdepName}
                      </td>

                      <td className="px-4 py-3 text-muted-foreground">
                        {user.lastSentAt ? (
                          <span>
                            {user.lastStatus} · {user.lastSentAt}
                          </span>
                        ) : (
                          "Belum pernah dikirim"
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {isOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-lg rounded-3xl border bg-card p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-black tracking-tight">
                  Kirim email aktivasi?
                </h2>

                <p className="mt-2 text-sm leading-7 text-muted-foreground">
                  Sistem akan mengirim link aktivasi/reset password ke user yang
                  dipilih.
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
                Jumlah User Terpilih
              </p>

              <p className="mt-2 text-2xl font-black tracking-tight">
                {selectedCount} user
              </p>

              <div className="mt-3 max-h-36 space-y-2 overflow-y-auto text-sm text-muted-foreground">
                {selectedUsers.map((user) => (
                  <div key={user.userId}>
                    {user.memberName} · {user.email}
                  </div>
                ))}
              </div>
            </div>

            <p className="mt-4 text-xs leading-6 text-muted-foreground">
              Batas pengiriman sekali proses adalah 80 user agar tetap aman
              terhadap limit email.
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
                disabled={isSubmitting || selectedCount === 0}
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
                    Ya, Kirim
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