import { prisma } from "@orma/database";
import { Sparkles } from "lucide-react";

import {
  VisionMissionForm,
  VisionMissionInitialData,
} from "./vision-mission-form";

export default async function VisionMissionPage() {
  const profile = await prisma.tevoSiteProfile.findFirst({
    where: {
      isActive: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const initialData: VisionMissionInitialData = {
    profileId: profile?.id ?? null,
    siteName: profile?.siteName ?? "Tevo",
    tagline: profile?.tagline ?? "",
    organizationSummary: profile?.organizationSummary ?? "",
    vision: profile?.vision ?? "",
    mission: profile?.mission ?? "",
    heroTitle: profile?.heroTitle ?? "",
    heroSubtitle: profile?.heroSubtitle ?? "",
  };

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border bg-card p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Sparkles className="size-6" />
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
              Tevo / Visi Misi
            </p>

            <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              Site Profile & Visi Misi
            </h1>

            <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">
              Kelola konten profil organisasi, hero section, visi, dan misi
              yang akan tampil di website publik Tevo.
            </p>
          </div>
        </div>
      </section>

      <VisionMissionForm initialData={initialData} />
    </div>
  );
}