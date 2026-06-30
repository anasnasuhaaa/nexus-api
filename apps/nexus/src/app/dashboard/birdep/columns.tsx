"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";

export type BirdepTableRow = {
  id: string;
  number: number;
  name: string;
  code: string;
  slug: string;
  unitType: string;
  cabinetName: string;
  description: string;
  focusArea: string;
  memberCount: number;
  isActive: boolean;
};

function getUnitTypeLabel(unitType: string) {
  const labels: Record<string, string> = {
    BPH: "BPH",
    BIRO: "Biro",
    DEPARTEMEN: "Departemen",
  };

  return labels[unitType] ?? unitType;
}

export const birdepColumns: ColumnDef<BirdepTableRow>[] = [
  {
    accessorKey: "number",
    header: "#",
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.original.number}</span>
    ),
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="-ml-3 gap-2"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Nama Birdep
        <ArrowUpDown className="size-3.5" />
      </Button>
    ),
    cell: ({ row }) => (
      <div>
        <div className="font-semibold">{row.original.name}</div>
        <div className="mt-1 text-xs text-muted-foreground">
          {row.original.cabinetName}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "code",
    header: "Kode",
    cell: ({ row }) => (
      <span className="inline-flex rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
        {row.original.code}
      </span>
    ),
  },
  {
    accessorKey: "unitType",
    header: "Tipe",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {getUnitTypeLabel(row.original.unitType)}
      </span>
    ),
  },
  {
    accessorKey: "description",
    header: "Deskripsi",
    cell: ({ row }) => (
      <div className="max-w-md">
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {row.original.description}
        </p>
      </div>
    ),
  },
  {
    accessorKey: "memberCount",
    header: "Anggota",
    cell: ({ row }) => (
      <span className="font-semibold">{row.original.memberCount}</span>
    ),
  },
  {
    accessorKey: "isActive",
    header: "Status",
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