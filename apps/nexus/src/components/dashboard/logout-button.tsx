"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await authClient.signOut();

    toast.success("Berhasil keluar", {
      description: "Session Nexus telah diakhiri.",
    });

    router.push("/login");
    router.refresh();
  }

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full justify-start gap-2"
      onClick={handleLogout}
    >
      <LogOut className="size-4" />
      Keluar
    </Button>
  );
}