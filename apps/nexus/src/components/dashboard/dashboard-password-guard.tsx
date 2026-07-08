"use client";

import { Loader2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { getCurrentUserPasswordStateAction } from "@/app/dashboard/profile/profile-action";

export function DashboardPasswordGuard() {
  const pathname = usePathname();
  const router = useRouter();

  const [isBlocking, setIsBlocking] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function checkPasswordState() {
      const result = await getCurrentUserPasswordStateAction();

      if (!isMounted) {
        return;
      }

      const isChangePasswordPage =
        pathname === "/dashboard/profile/change-password";

      const isSuperAdmin = result.role === "SUPER_ADMIN";

      if (
        result.authenticated &&
        result.mustChangePassword &&
        !isSuperAdmin &&
        !isChangePasswordPage
      ) {
        setIsBlocking(true);
        router.replace("/dashboard/profile/change-password");
        return;
      }

      setIsBlocking(false);
    }

    checkPasswordState();

    return () => {
      isMounted = false;
    };
  }, [pathname, router]);

  if (!isBlocking) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-999 flex items-center justify-center bg-background/90 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-3 rounded-3xl border bg-card px-6 py-5 shadow-sm">
        <Loader2 className="size-6 animate-spin text-primary" />
        <p className="text-sm font-semibold">
          Mengarahkan ke halaman ganti password...
        </p>
      </div>
    </div>
  );
}