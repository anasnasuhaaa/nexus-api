"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";

export type ProgramTableRow = {
  id: string;
  number: number;
  title: string;
  slug: string;
  birdepName: string;
  birdepCode: string;
  status: string;
  progressPercent: number;
  startDate: string;
  endDate: string;
  isPublishedToTevo: boolean;
  publishStatus: "PUBLISHED" | "INTERNAL";
};

function getProgramStatusLabel(status: string) {
  const labels: Record<string, string> = {
    PLANNED: "Direncanakan",
    ONGOING: "Berjalan",
    COMPLETED: "Selesai",
    CANCELLED: "Dibatalkan",
    ARCHIVED: "Diarsipkan",
  };

  return labels[status] ?? status;
}

function getProgramStatusClassName(status: string) {
  const classNames: Record<string, string> = {
    PLANNED: "bg-primary/10 text-primary",
    ONGOING: "bg-status-active-soft text-status-active",
    COMPLETED: "bg-status-active-soft text-status-active",
    CANCELLED: "bg-status-inactive-soft text-status-inactive",
    ARCHIVED: "bg-muted text-muted-foreground",
  };

  return classNames[status] ?? "bg-muted text-muted-foreground";
}

export const programColumns: ColumnDef<ProgramTableRow>[] = [
  {
    accessorKey: "number",
    header: "#",
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.original.number}</span>
    ),
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <Button
        type="button"
        variant="ghost"
        className="-ml-3 gap-2"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Program Kerja
        <ArrowUpDown className="size-3.5" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="min-w-56">
        <Link
          href={`/dashboard/programs/${row.original.id}`}
          className="font-semibold text-foreground transition hover:text-primary"
        >
          {row.original.title}
        </Link>

        <div className="mt-1 text-xs text-muted-foreground">
          {row.original.slug}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "birdepName",
    header: "Birdep",
    cell: ({ row }) => (
      <div className="min-w-32">
        <div className="font-medium">{row.original.birdepName}</div>
        <div className="mt-1 text-xs text-muted-foreground">
          {row.original.birdepCode}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <span
        className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${getProgramStatusClassName(
          row.original.status,
        )}`}
      >
        {getProgramStatusLabel(row.original.status)}
      </span>
    ),
  },
  {
    accessorKey: "progressPercent",
    header: ({ column }) => (
      <Button
        type="button"
        variant="ghost"
        className="-ml-3 gap-2"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Progress
        <ArrowUpDown className="size-3.5" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="min-w-36">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Capaian</span>
          <span className="font-semibold text-primary">
            {row.original.progressPercent}%
          </span>
        </div>

        <div className="mt-2 h-2 rounded-full bg-primary/10">
          <div
            className="h-2 rounded-full bg-primary"
            style={{
              width: `${row.original.progressPercent}%`,
            }}
          />
        </div>
      </div>
    ),
  },
  {
    accessorKey: "startDate",
    header: "Tanggal",
    cell: ({ row }) => (
      <div className="min-w-32 text-sm">
        <div>{row.original.startDate}</div>
        <div className="mt-1 text-xs text-muted-foreground">
          s.d. {row.original.endDate}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "publishStatus",
    header: "Tevo",
    cell: ({ row }) =>
      row.original.publishStatus === "PUBLISHED" ? (
        <span className="inline-flex whitespace-nowrap rounded-full bg-status-active-soft px-2.5 py-1 text-xs font-semibold text-status-active">
          Published
        </span>
      ) : (
        <span className="inline-flex whitespace-nowrap rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground">
          Internal
        </span>
      ),
  },
];