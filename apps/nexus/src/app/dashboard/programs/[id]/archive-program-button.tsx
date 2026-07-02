"use client";

import { Archive, Loader2, RotateCcw, Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import {
  archiveProgramAction,
  deleteProgramPermanentlyAction,
  unarchiveProgramAction,
} from "./archive-action";

type ProgramLifecycleActionsProps = {
  programId: string;
  programTitle: string;
  programStatus: string;
};

type ModalMode = "ARCHIVE" | "UNARCHIVE" | "DELETE" | null;

export function ProgramLifecycleActions({
  programId,
  programTitle,
  programStatus,
}: ProgramLifecycleActionsProps) {
  const router = useRouter();

  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");

  const isArchived = programStatus === "ARCHIVED";

  function closeModal() {
    if (isLoading) {
      return;
    }

    setModalMode(null);
    setDeleteConfirmation("");
  }

  async function handleArchive() {
    setIsLoading(true);
    const response = await archiveProgramAction(programId);
    setIsLoading(false);

    if (!response.success) {
      toast.error("Gagal mengarsipkan program", {
        description: response.message,
        duration: 2000,
      });
      return;
    }

    toast.success("Program diarsipkan", {
      description: response.message,
      duration: 2000,
    });

    closeModal();
    router.push("/dashboard/programs");
    router.refresh();
  }

  async function handleUnarchive() {
    setIsLoading(true);
    const response = await unarchiveProgramAction(programId);
    setIsLoading(false);

    if (!response.success) {
      toast.error("Gagal mengembalikan program", {
        description: response.message,
        duration: 2000,
      });
      return;
    }

    toast.success("Program dikembalikan", {
      description: response.message,
      duration: 2000,
    });

    closeModal();
    router.push(`/dashboard/programs/${programId}`);
    router.refresh();
  }

  async function handlePermanentDelete() {
    setIsLoading(true);
    const response = await deleteProgramPermanentlyAction(
      programId,
      deleteConfirmation,
    );
    setIsLoading(false);

    if (!response.success) {
      toast.error("Gagal menghapus program", {
        description: response.message,
        duration: 2000,
      });
      return;
    }

    toast.success("Program dihapus permanen", {
      description: response.message,
      duration: 2000,
    });

    closeModal();
    router.push("/dashboard/programs");
    router.refresh();
  }

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {!isArchived ? (
          <Button
            type="button"
            variant="outline"
            onClick={() => setModalMode("ARCHIVE")}
            className="border-status-inactive/30 text-status-inactive hover:bg-status-inactive-soft hover:text-status-inactive"
          >
            <Archive className="size-4" />
            Archive
          </Button>
        ) : (
          <>
            <Button
              type="button"
              variant="outline"
              onClick={() => setModalMode("UNARCHIVE")}
              className="border-primary/30 text-primary hover:bg-primary/10 hover:text-primary"
            >
              <RotateCcw className="size-4" />
              Unarchive
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => setModalMode("DELETE")}
              className="border-status-inactive/30 text-status-inactive hover:bg-status-inactive-soft hover:text-status-inactive"
            >
              <Trash2 className="size-4" />
              Delete Permanen
            </Button>
          </>
        )}
      </div>

      {modalMode ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-lg rounded-3xl border bg-card p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-black tracking-tight">
                  {modalMode === "ARCHIVE"
                    ? "Arsipkan program kerja?"
                    : modalMode === "UNARCHIVE"
                      ? "Kembalikan program kerja?"
                      : "Hapus permanen program kerja?"}
                </h2>

                <p className="mt-2 text-sm leading-7 text-muted-foreground">
                  {modalMode === "ARCHIVE"
                    ? "Program tidak akan dihapus permanen. Statusnya akan menjadi ARCHIVED, publikasi Tevo akan dinonaktifkan, dan riwayat progress tetap tersimpan."
                    : modalMode === "UNARCHIVE"
                      ? "Program akan dikembalikan ke status Direncanakan. Publikasi Tevo tetap nonaktif sampai diaktifkan kembali secara manual."
                      : "Tindakan ini tidak dapat dibatalkan. Program dan seluruh progress update terkait akan dihapus permanen dari database."}
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={isLoading}
                className="rounded-xl border p-2 text-muted-foreground transition hover:text-foreground"
                aria-label="Tutup modal"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="mt-5 rounded-2xl border bg-card p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Program
              </p>
              <p className="mt-2 font-bold">{programTitle}</p>
            </div>

            {modalMode === "DELETE" ? (
              <div className="mt-5 space-y-2">
                <label
                  htmlFor="deleteConfirmation"
                  className="text-sm font-semibold"
                >
                  Ketik HAPUS untuk melanjutkan
                </label>

                <input
                  id="deleteConfirmation"
                  value={deleteConfirmation}
                  onChange={(event) =>
                    setDeleteConfirmation(event.target.value)
                  }
                  placeholder="HAPUS"
                  className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                />

                <p className="text-xs leading-6 text-status-inactive">
                  Delete permanen hanya bisa dilakukan pada program berstatus
                  ARCHIVED.
                </p>
              </div>
            ) : null}

            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={closeModal}
                disabled={isLoading}
              >
                Batal
              </Button>

              {modalMode === "ARCHIVE" ? (
                <Button
                  type="button"
                  onClick={handleArchive}
                  disabled={isLoading}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Mengarsipkan...
                    </>
                  ) : (
                    <>
                      <Archive className="size-4" />
                      Ya, arsipkan
                    </>
                  )}
                </Button>
              ) : null}

              {modalMode === "UNARCHIVE" ? (
                <Button
                  type="button"
                  onClick={handleUnarchive}
                  disabled={isLoading}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Mengembalikan...
                    </>
                  ) : (
                    <>
                      <RotateCcw className="size-4" />
                      Ya, kembalikan
                    </>
                  )}
                </Button>
              ) : null}

              {modalMode === "DELETE" ? (
                <Button
                  type="button"
                  onClick={handlePermanentDelete}
                  disabled={isLoading || deleteConfirmation !== "HAPUS"}
                  className="bg-status-inactive text-status-inactive-foreground hover:bg-status-inactive/90"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Menghapus...
                    </>
                  ) : (
                    <>
                      <Trash2 className="size-4" />
                      Hapus permanen
                    </>
                  )}
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}