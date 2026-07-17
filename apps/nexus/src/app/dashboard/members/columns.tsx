"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Eye } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export type MemberTableRow = {
  id: string;
  number: number;
  fullName: string;
  nim: string;
  instagram: string | null;
  birdepName: string;
  birdepCode: string;
  cabinetName: string;
  position: string;
  positionLabel: string;
  internalTitle: string | null;
  isActive: boolean;
  membershipCount: number;
};

function getStatusBadge(isActive: boolean) {
  if (isActive) {
    return (
      <span className="inline-flex rounded-full bg-status-active-soft px-2.5 py-1 text-xs font-semibold text-status-active">
        Aktif
      </span>
    );
  }

  return (
    <span className="inline-flex rounded-full bg-status-inactive-soft px-2.5 py-1 text-xs font-semibold text-status-inactive">
      Nonaktif
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
      <div className="min-w-56">
        <Link
          href={`/dashboard/members/${row.original.id}`}
          className="font-semibold text-foreground transition hover:text-primary"
        >
          {row.original.fullName}
        </Link>

        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span>{row.original.nim}</span>

          {row.original.instagram ? (
            <>
              <span>•</span>
              <span>@{row.original.instagram}</span>
            </>
          ) : null}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "birdepName",
    header: "Birdep",
    cell: ({ row }) => (
      <div className="min-w-48">
        <div className="font-semibold">{row.original.birdepName}</div>

        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span>{row.original.birdepCode}</span>
          <span>•</span>
          <span>{row.original.cabinetName}</span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "position",
    header: "Jabatan Organisasi",
    cell: ({ row }) =>
      row.original.position === "-" ? (
        <span className="text-muted-foreground">Belum ada jabatan</span>
      ) : (
        <div className="min-w-52">
          <span className="inline-flex rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
            {row.original.positionLabel}
          </span>

          {row.original.internalTitle ? (
            <div className="mt-2 text-xs text-muted-foreground">
              {row.original.internalTitle}
            </div>
          ) : null}
        </div>
      ),
  },
  // {
  //   accessorKey: "membershipCount",
  //   header: "Riwayat",
  //   cell: ({ row }) => (
  //     <div className="min-w-28 text-sm text-muted-foreground">
  //       {row.original.membershipCount > 0
  //         ? `${row.original.membershipCount} membership`
  //         : "Belum ada"}
  //     </div>
  //   ),
  // },
  {
    accessorKey: "isActive",
    header: "Status Anggota",
    cell: ({ row }) => getStatusBadge(row.original.isActive),
  },
  {
    id: "actions",
    header: "Aksi",
    cell: ({ row }) => (
      <Link href={`/dashboard/members/${row.original.id}`}>
        <Button variant="outline" size="sm">
          <Eye className="size-4" />
          Detail
        </Button>
      </Link>
    ),
  },
];