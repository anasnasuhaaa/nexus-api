"use client";

import { ArrowLeft, Loader2, Save } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import { updateMemberAction } from "./edit-member-action";

type CabinetPeriodOption = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
};

type BirdepOption = {
  id: string;
  name: string;
  code: string;
  cabinetPeriodId: string;
};

export type EditMemberInitialData = {
  memberId: string;
  membershipId: string | null;
  fullName: string;
  nim: string;
  instagram: string;
  isActive: boolean;
  cabinetPeriodId: string;
  primaryBirdepId: string;
  organizationalPosition: string;
  internalTitle: string;
  subdivision: string;
  programRoles: string;
};

type EditMemberFormProps = {
  initialData: EditMemberInitialData;
  cabinetPeriods: CabinetPeriodOption[];
  birdeps: BirdepOption[];
};

const POSITION_OPTIONS = [
  {
    value: "KETUA_ORGANISASI",
    label: "Ketua Organisasi",
  },
  {
    value: "WAKIL_KETUA_ORGANISASI",
    label: "Wakil Ketua Organisasi",
  },
  {
    value: "SEKRETARIS_INTERNAL",
    label: "Sekretaris Internal",
  },
  {
    value: "SEKRETARIS_EKSTERNAL",
    label: "Sekretaris Eksternal",
  },
  {
    value: "BENDAHARA_INTERNAL",
    label: "Bendahara Internal",
  },
  {
    value: "BENDAHARA_EKSTERNAL",
    label: "Bendahara Eksternal",
  },
  {
    value: "KETUA_BIRDEP",
    label: "Ketua Birdep",
  },
  {
    value: "SEKRETARIS_BIRDEP",
    label: "Sekretaris Birdep",
  },
  {
    value: "BENDAHARA_BIRDEP",
    label: "Bendahara Birdep",
  },
  {
    value: "ANGGOTA_BIRDEP",
    label: "Anggota Birdep",
  },
];

export function EditMemberForm({
  initialData,
  cabinetPeriods,
  birdeps,
}: EditMemberFormProps) {
  const router = useRouter();

  const [fullName, setFullName] = useState(initialData.fullName);
  const [nim, setNim] = useState(initialData.nim);
  const [instagram, setInstagram] = useState(initialData.instagram);
  const [isActive, setIsActive] = useState(initialData.isActive);
  const [cabinetPeriodId, setCabinetPeriodId] = useState(
    initialData.cabinetPeriodId,
  );
  const [primaryBirdepId, setPrimaryBirdepId] = useState(
    initialData.primaryBirdepId,
  );
  const [organizationalPosition, setOrganizationalPosition] = useState(
    initialData.organizationalPosition,
  );
  const [internalTitle, setInternalTitle] = useState(initialData.internalTitle);
  const [subdivision, setSubdivision] = useState(initialData.subdivision);
  const [programRoles, setProgramRoles] = useState(initialData.programRoles);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredBirdeps = useMemo(() => {
    return birdeps.filter(
      (birdep) => birdep.cabinetPeriodId === cabinetPeriodId,
    );
  }, [birdeps, cabinetPeriodId]);

  function handleCabinetPeriodChange(value: string) {
    setCabinetPeriodId(value);

    const birdepStillValid = birdeps.some(
      (birdep) =>
        birdep.id === primaryBirdepId && birdep.cabinetPeriodId === value,
    );

    if (!birdepStillValid) {
      const firstBirdep = birdeps.find(
        (birdep) => birdep.cabinetPeriodId === value,
      );

      setPrimaryBirdepId(firstBirdep?.id ?? "");
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsSubmitting(true);

    const response = await updateMemberAction({
      memberId: initialData.memberId,
      membershipId: initialData.membershipId,
      fullName,
      nim,
      instagram,
      isActive,
      cabinetPeriodId,
      primaryBirdepId,
      organizationalPosition,
      internalTitle,
      subdivision,
      programRoles,
    });

    setIsSubmitting(false);

    if (!response.success) {
      toast.error("Gagal memperbarui anggota", {
        description: response.message,
        duration: 2000,
      });
      return;
    }

    toast.success("Data anggota diperbarui", {
      description: response.message,
      duration: 2000,
    });

    router.replace(`/dashboard/members/${initialData.memberId}`);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <section className="rounded-3xl border bg-card p-6 shadow-sm">
        <div className="mb-5">
          <h2 className="font-black tracking-tight">Data Dasar Anggota</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Perbarui identitas utama anggota organisasi.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <FieldWrapper label="Nama Lengkap" htmlFor="fullName" required>
            <input
              id="fullName"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              placeholder="Nama lengkap anggota"
              className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none transition focus:ring-2 focus:ring-ring"
            />
          </FieldWrapper>

          <FieldWrapper label="NIM" htmlFor="nim" required>
            <input
              id="nim"
              value={nim}
              onChange={(event) => setNim(event.target.value)}
              placeholder="NIM anggota"
              className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none transition focus:ring-2 focus:ring-ring"
            />
          </FieldWrapper>

          <FieldWrapper label="Instagram" htmlFor="instagram">
            <input
              id="instagram"
              value={instagram}
              onChange={(event) => setInstagram(event.target.value)}
              placeholder="username tanpa @"
              className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none transition focus:ring-2 focus:ring-ring"
            />
          </FieldWrapper>

          <FieldWrapper label="Status Anggota" htmlFor="isActive">
            <select
              id="isActive"
              value={isActive ? "true" : "false"}
              onChange={(event) => setIsActive(event.target.value === "true")}
              className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none transition focus:ring-2 focus:ring-ring"
            >
              <option value="true">Aktif</option>
              <option value="false">Nonaktif</option>
            </select>
          </FieldWrapper>
        </div>
      </section>

      <section className="rounded-3xl border bg-card p-6 shadow-sm">
        <div className="mb-5">
          <h2 className="font-black tracking-tight">Membership Organisasi</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Perbarui periode kabinet, Birdep, posisi, dan peran internal
            anggota.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <FieldWrapper
            label="Periode Kabinet"
            htmlFor="cabinetPeriodId"
            required
          >
            <select
              id="cabinetPeriodId"
              value={cabinetPeriodId}
              onChange={(event) =>
                handleCabinetPeriodChange(event.target.value)
              }
              className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none transition focus:ring-2 focus:ring-ring"
            >
              <option value="">Pilih periode kabinet</option>

              {cabinetPeriods.map((period) => (
                <option key={period.id} value={period.id}>
                  {period.name} ({period.startDate} - {period.endDate})
                </option>
              ))}
            </select>
          </FieldWrapper>

          <FieldWrapper label="Birdep Utama" htmlFor="primaryBirdepId" required>
            <select
              id="primaryBirdepId"
              value={primaryBirdepId}
              onChange={(event) => setPrimaryBirdepId(event.target.value)}
              className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none transition focus:ring-2 focus:ring-ring"
            >
              <option value="">Pilih Birdep</option>

              {filteredBirdeps.map((birdep) => (
                <option key={birdep.id} value={birdep.id}>
                  {birdep.name} ({birdep.code})
                </option>
              ))}
            </select>
          </FieldWrapper>

          <FieldWrapper
            label="Posisi Organisasi"
            htmlFor="organizationalPosition"
            required
          >
            <select
              id="organizationalPosition"
              value={organizationalPosition}
              onChange={(event) =>
                setOrganizationalPosition(event.target.value)
              }
              className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none transition focus:ring-2 focus:ring-ring"
            >
              {POSITION_OPTIONS.map((position) => (
                <option key={position.value} value={position.value}>
                  {position.label}
                </option>
              ))}
            </select>
          </FieldWrapper>

          <FieldWrapper label="Jabatan Internal" htmlFor="internalTitle">
            <input
              id="internalTitle"
              value={internalTitle}
              onChange={(event) => setInternalTitle(event.target.value)}
              placeholder="Contoh: Staff Frontend, Koordinator, dll"
              className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none transition focus:ring-2 focus:ring-ring"
            />
          </FieldWrapper>

          <FieldWrapper label="Subdivision" htmlFor="subdivision">
            <input
              id="subdivision"
              value={subdivision}
              onChange={(event) => setSubdivision(event.target.value)}
              placeholder="Contoh: Frontend, Backend, UI/UX"
              className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none transition focus:ring-2 focus:ring-ring"
            />
          </FieldWrapper>

          <FieldWrapper label="Program Roles" htmlFor="programRoles">
            <textarea
              id="programRoles"
              value={programRoles}
              onChange={(event) => setProgramRoles(event.target.value)}
              placeholder="Catatan peran anggota dalam program kerja"
              rows={4}
              className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-ring"
            />
          </FieldWrapper>
        </div>
      </section>

      <section className="flex flex-col-reverse gap-2 rounded-3xl border bg-card p-5 shadow-sm sm:flex-row sm:justify-end">
        <Link href={`/dashboard/members/${initialData.memberId}`}>
          <Button type="button" variant="outline">
            <ArrowLeft className="size-4" />
            Batal
          </Button>
        </Link>

        <Button
          type="submit"
          disabled={
            isSubmitting ||
            !fullName.trim() ||
            !nim.trim() ||
            !cabinetPeriodId ||
            !primaryBirdepId ||
            !organizationalPosition
          }
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
              Simpan Perubahan
            </>
          )}
        </Button>
      </section>
    </form>
  );
}

type FieldWrapperProps = {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
  required?: boolean;
};

function FieldWrapper({
  label,
  htmlFor,
  children,
  required = false,
}: FieldWrapperProps) {
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