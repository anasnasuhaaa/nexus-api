"use client";

import { Archive, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

import { archiveProgramAction } from "./archive-action";

type ArchiveProgramButtonProps = {
  programId: string;
  disabled?: boolean;
};

export function ArchiveProgramButton({
  programId,
  disabled = false,
}: ArchiveProgramButtonProps) {
  const router = useRouter();
  const [isArchiving, setIsArchiving] = useState(false);

  async function handleArchive() {
    setIsArchiving(true);
    const response = await archiveProgramAction(programId);
    setIsArchiving(false);

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

    router.push("/dashboard/programs");
    router.refresh();
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Button
          type="button"
          variant="outline"
          disabled={disabled || isArchiving}
          className="border-status-inactive/30 text-status-inactive hover:bg-status-inactive-soft hover:text-status-inactive"
        >
          {isArchiving ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Mengarsipkan...
            </>
          ) : (
            <>
              <Archive className="size-4" />
              Archive
            </>
          )}
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Arsipkan program kerja?</AlertDialogTitle>
          <AlertDialogDescription>
            Program kerja tidak akan dihapus permanen. Statusnya akan berubah
            menjadi ARCHIVED dan publikasi ke Tevo akan dinonaktifkan. Riwayat
            progress update tetap tersimpan.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleArchive}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Ya, arsipkan
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}