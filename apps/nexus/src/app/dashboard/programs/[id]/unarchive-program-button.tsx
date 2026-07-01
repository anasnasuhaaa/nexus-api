"use client";

import { RefreshCw, Loader2 } from "lucide-react";
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
import { unarchiveProgramAction } from "./unarchive-action";

type UnarchiveProgramButtonProps = {
  programId: string;
  disabled?: boolean;
};

export function UnarchiveProgramButton({
  programId,
  disabled = false,
}: UnarchiveProgramButtonProps) {
  const router = useRouter();
  const [isUnarchiving, setIsUnarchiving] = useState(false);

  async function handleUnarchive() {
    setIsUnarchiving(true);
    const response = await unarchiveProgramAction(programId);
    setIsUnarchiving(false);

    if (!response.success) {
      toast.error("Gagal memulihkan program", {
        description: response.message,
        duration: 2000,
      });
      return;
    }

    toast.success("Program dipulihkan", {
      description: response.message,
      duration: 2000,
    });

    router.push(`/dashboard/programs/${programId}`);
    router.refresh();
  }

  return (
    <AlertDialog>
      {/* Terapkan class dari buttonVariants langsung ke Trigger */}
      <AlertDialogTrigger
        className={buttonVariants({ variant: "outline" })}
        disabled={disabled || isUnarchiving}
      >
        {isUnarchiving ? (
          <>
            <Loader2 className="size-4 animate-spin mr-2" />
            Memulihkan...
          </>
        ) : (
          <>
            <RefreshCw className="size-4 mr-2" />
            Unarchive
          </>
        )}
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Pulihkan program kerja?</AlertDialogTitle>
          <AlertDialogDescription>
            Status program kerja akan dikembalikan menjadi Direncanakan (PLANNED) dan dapat diedit atau dilanjutkan kembali.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleUnarchive}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Ya, pulihkan
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}