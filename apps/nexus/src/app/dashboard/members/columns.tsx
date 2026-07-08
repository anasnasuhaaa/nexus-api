"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export type MemberActivationStatus =
  | "NO_ACCOUNT"
  | "PENDING_ACTIVATION"
  | "ACTIVE"
  | "BANNED";

export type MemberTableRow = {
  id: string;
  number: number;
  fullName: string;
  nim: string;
  instagram: string | null;
  birdepName: string;
  cabinetName: string;
  position: string;
  internalTitle: string | null;
  email: string | null;
  role: string | null;
  isActive: boolean;
  activationStatus: MemberActivationStatus;
};

function getPositionLabel(position: string) {
  const labels: Record<string, string> = {
    KETUA_ORGANISASI: "Ketua Organisasi",
    WAKIL_KETUA_ORGANISASI: "Wakil Ketua Organisasi",
    SEKRETARIS_INTERNAL: "Sekretaris Internal",
    SEKRETARIS_EKSTERNAL: "Sekretaris Eksternal",
    BENDAHARA_INTERNAL: "Bendahara Internal",
    BENDAHARA_EKSTERNAL: "Bendahara Eksternal",
    KETUA_BIRDEP: "Ketua Birdep",
    SEKRETARIS_BIRDEP: "Sekretaris Birdep",
    BENDAHARA_BIRDEP: "Bendahara Birdep",
    ANGGOTA_BIRDEP: "Anggota Birdep",
  };

  return labels[position] ?? position;
}

function getRoleLabel(role: string | null) {
  if (!role) return "-";

  const labels: Record<string, string> = {
    SUPER_ADMIN: "Super Admin",
    TEVO_ADMIN: "Tevo Admin",
    BPH: "BPH",
    KETUA_BIRDEP: "Ketua Birdep",
    SEKRETARIS_BIRDEP: "Sekretaris Birdep",
    BENDAHARA_BIRDEP: "Bendahara Birdep",
    ANGGOTA_BIRDEP: "Anggota Birdep",
  };

  return labels[role] ?? role.replaceAll("_", " ");
}

function getActivationBadge(status: MemberActivationStatus) {
  if (status === "NO_ACCOUNT") {
    return (
      <span className="inline-flex rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground">
        Belum Punya Akun
      </span>
    );
  }

  if (status === "PENDING_ACTIVATION") {
    return (
      <span className="inline-flex rounded-full bg-yellow-100 px-2.5 py-1 text-xs font-semibold text-yellow-700 dark:bg-yellow-950/40 dark:text-yellow-300">
        Belum Aktivasi
      </span>
    );
  }

  if (status === "BANNED") {
    return (
      <span className="inline-flex rounded-full bg-status-inactive-soft px-2.5 py-1 text-xs font-semibold text-status-inactive">
        Dibekukan
      </span>
    );
  }

  return (
    <span className="inline-flex rounded-full bg-status-active-soft px-2.5 py-1 text-xs font-semibold text-status-active">
      Aktif
    </span>
  );
}

export const memberColumns: ColumnDef<MemberTableRow>[] = [
  {
    accessorKey: "number",
    header: "#",
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.original.number}</span>
    ),
  },
  {
    accessorKey: "fullName",
    header: ({ column }) => (
      <Button
        type="button"
        variant="ghost"
        className="-ml-3 gap-2"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Nama
        <ArrowUpDown className="size-3.5" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="min-w-52">
        <Link
          href={`/dashboard/members/${row.original.id}`}
          className="font-semibold text-foreground transition hover:text-primary"
        >
          {row.original.fullName}
        </Link>

        {row.original.instagram ? (
          <div className="mt-1 text-xs text-muted-foreground">
            @{row.original.instagram}
          </div>
        ) : null}
      </div>
    ),
  },
  {
    accessorKey: "nim",
    header: "NIM",
    cell: ({ row }) => (
      <span className="whitespace-nowrap text-muted-foreground">
        {row.original.nim}
      </span>
    ),
  },
  {
    accessorKey: "birdepName",
    header: "Birdep",
    cell: ({ row }) => (
      <div className="min-w-40">
        <div className="font-medium">{row.original.birdepName}</div>
        <div className="mt-1 text-xs text-muted-foreground">
          {row.original.cabinetName}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "position",
    header: "Jabatan",
    cell: ({ row }) =>
      row.original.position === "-" ? (
        <span className="text-muted-foreground">-</span>
      ) : (
        <div className="min-w-44">
          <span className="inline-flex rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
            {getPositionLabel(row.original.position)}
          </span>

          {row.original.internalTitle ? (
            <div className="mt-2 text-xs text-muted-foreground">
              {row.original.internalTitle}
            </div>
          ) : null}
        </div>
      ),
  },
  {
    accessorKey: "email",
    header: "Akun",
    cell: ({ row }) =>
      row.original.email ? (
        <div className="min-w-56">
          <div className="wrap-break-word font-medium">{row.original.email}</div>
          <div className="mt-1 text-xs text-muted-foreground">
            Role: {getRoleLabel(row.original.role)}
          </div>
        </div>
      ) : (
        <span className="text-muted-foreground">Belum punya akun</span>
      ),
  },
  {
    accessorKey: "activationStatus",
    header: "Aktivasi",
    cell: ({ row }) => getActivationBadge(row.original.activationStatus),
  },
  {
    accessorKey: "isActive",
    header: "Status Anggota",
    cell: ({ row }) =>
      row.original.isActive ? (
        <span className="inline-flex rounded-full bg-status-active-soft px-2.5 py-1 text-xs font-semibold text-status-active">
          Aktif
        </span>
      ) : (
        <span className="inline-flex rounded-full bg-status-inactive-soft px-2.5 py-1 text-xs font-semibold text-status-inactive">
          Nonaktif
        </span>
      ),
  },
];