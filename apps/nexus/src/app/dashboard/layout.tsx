import { ReactNode } from "react";
import { prisma } from "@orma/database";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { DashboardPasswordGuard } from "@/components/dashboard/dashboard-password-guard";
import { auth } from "@/lib/auth";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      name: true,
      email: true,
      role: true,
    },
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <DashboardShell
      user={{
        name: user.name,
        email: user.email,
        role: user.role,
      }}
    >
      <DashboardPasswordGuard />
      {children}
    </DashboardShell>
  );
}