import { ReactNode } from "react";

import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { SessionExitGuard } from "@/components/dashboard/session-exit-guard";

type DashboardShellProps = {
  children: ReactNode;
  user: {
    name: string;
    email: string;
    role: string;
  };
};

export function DashboardShell({ children, user }: DashboardShellProps) {
  return (
    <div className="min-h-screen bg-muted/30 text-foreground">
      <SessionExitGuard />

      <div className="flex min-h-screen">
        <DashboardSidebar />

        <div className="flex min-w-0 flex-1 flex-col">
          <DashboardHeader user={user} />

          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}