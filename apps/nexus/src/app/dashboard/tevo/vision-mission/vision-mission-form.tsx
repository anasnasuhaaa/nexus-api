"use client";

import { Loader2, Save } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

import { updateVisionMissionAction } from "./vision-mission-action";

export type VisionMissionInitialData = {
  profileId: string | null;
  siteName: string;
  tagline: string;
  organizationSummary: string;
  vision: string;
  mission: string;
  heroTitle: string;
  heroSubtitle: string;
};

type VisionMissionFormProps = {
  initialData: VisionMissionInitialData;
};

export function VisionMissionForm({ initialData }: VisionMissionFormProps) {
  const router = useRouter();

  const [siteName, setSiteName] = useState(initialData.siteName);
  const [tagline, setTagline] = useState(initialData.tagline);
  const [organizationSummary, setOrganizationSummary] = useState(
    initialData.organizationSummary,
  );
  const [vision, setVision] = useState(initialData.vision);
  const [mission, setMission] = useState(initialData.mission);
  const [heroTitle, setHeroTitle] = useState(initialData.heroTitle);
  const [heroSubtitle, setHeroSubtitle] = useState(
    initialData.heroSubtitle,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsSubmitting(true);

    const response = await updateVisionMissionAction({
      profileId: initialData.profileId,
      siteName,
      tagline,
      organizationSummary,
      vision,
      mission,
      heroTitle,
      heroSubtitle,
    });

    setIsSubmitting(false);

    if (!response.success) {
      toast.error("Gagal menyimpan visi misi", {
        description: response.message,
        duration: 2000,
      });
      return;
    }

    toast.success("Visi misi berhasil diperbarui", {
      description: response.message,
      duration: 2000,
    });

    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <section className="rounded-3xl border bg-card p-6 shadow-sm">
        <div className="mb-5">
          <h2 className="font-black tracking-tight">Identitas Website</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Konten dasar untuk hero dan profil publik Tevo.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <Field label="Nama Website" htmlFor="siteName" required>
            <input
              id="siteName"
              value={siteName}
              onChange={(event) => setSiteName(event.target.value)}
              className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </Field>

          <Field label="Tagline" htmlFor="tagline">
            <input
              id="tagline"
              value={tagline}
              onChange={(event) => setTagline(event.target.value)}
              className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </Field>

          <Field label="Hero Title" htmlFor="heroTitle">
            <input
              id="heroTitle"
              value={heroTitle}
              onChange={(event) => setHeroTitle(event.target.value)}
              className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </Field>

          <Field label="Hero Subtitle" htmlFor="heroSubtitle">
            <textarea
              id="heroSubtitle"
              value={heroSubtitle}
              onChange={(event) => setHeroSubtitle(event.target.value)}
              rows={4}
              className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </Field>

          <div className="lg:col-span-2">
            <Field
              label="Ringkasan Organisasi"
              htmlFor="organizationSummary"
            >
              <textarea
                id="organizationSummary"
                value={organizationSummary}
                onChange={(event) =>
                  setOrganizationSummary(event.target.value)
                }
                rows={5}
                className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </Field>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border bg-card p-6 shadow-sm">
        <div className="mb-5">
          <h2 className="font-black tracking-tight">Visi & Misi</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Konten ini akan menjadi isi halaman About / Profil Organisasi di
            website Tevo.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <Field label="Visi" htmlFor="vision">
            <textarea
              id="vision"
              value={vision}
              onChange={(event) => setVision(event.target.value)}
              rows={8}
              className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </Field>

          <Field label="Misi" htmlFor="mission">
            <textarea
              id="mission"
              value={mission}
              onChange={(event) => setMission(event.target.value)}
              rows={8}
              className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </Field>
        </div>
      </section>

      <section className="flex justify-end rounded-3xl border bg-card p-5 shadow-sm">
        <Button
          type="submit"
          disabled={isSubmitting || !siteName.trim()}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Menyimpan...
            </>
          ) : (
            <>
              <Save className="size-4" />
              Simpan Visi Misi
            </>
          )}
        </Button>
      </section>
    </form>
  );
}

type FieldProps = {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
  required?: boolean;
};

function Field({ label, htmlFor, children, required = false }: FieldProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={htmlFor} className="text-sm font-semibold">
        {label}
        {required ? <span className="text-primary"> *</span> : null}
      </label>
      {children}
    </div>
  );
}