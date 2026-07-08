"use server";

import { prisma } from "@orma/database";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";

export async function getCurrentUserPasswordStateAction() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return {
      authenticated: false,
      mustChangePassword: false,
      role: null,
    };
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      role: true,
      mustChangePassword: true,
    },
  });

  return {
    authenticated: true,
    mustChangePassword: user?.mustChangePassword ?? false,
    role: user?.role ?? null,
  };
}