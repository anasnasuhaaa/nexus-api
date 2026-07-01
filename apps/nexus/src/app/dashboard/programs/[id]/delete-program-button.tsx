"use client";

import { Trash2, Loader2 } from "lucide-react";
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
// Import buttonVariants dari komponen Button
import { buttonVariants } from "@/components/ui/button";
import { deleteProgramAction } from "./delete-action";

type DeleteProgramButtonProps = {
  programId: string;
  disabled?: boolean;
};

export function DeleteProgramButton({
  programId,
  disabled = false,
}: DeleteProgramButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    setIsDeleting(true);
    const response = await deleteProgramAction(programId);
    setIsDeleting(false);

    if (!response.success) {
      toast.error("Gagal menghapus program", {
        description: response.message,
        duration: 2000,
      });
      return;
    }

    toast.success("Program dihapus", {
      description: response.message,
      duration: 2000,
    });

    router.push("/dashboard/programs");
    router.refresh();
  }

  return (
    <AlertDialog>
      {/* Terapkan class dari buttonVariants langsung ke Trigger */}
      <AlertDialogTrigger
        className={buttonVariants({ variant: "destructive" })}
        disabled={disabled || isDeleting}
      >
        {isDeleting ? (
          <>
            <Loader2 className="size-4 animate-spin mr-2" />
            Menghapus...
          </>
        ) : (
          <>
            <Trash2 className="size-4 mr-2" />
            Hapus Permanen
          </>
        )}
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus permanen program kerja?</AlertDialogTitle>
          <AlertDialogDescription>
            Aksi ini tidak dapat dibatalkan. Program kerja ini beserta seluruh riwayat progress update yang terkait akan dihapus selamanya dari sistem.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Ya, hapus permanen
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}