"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export type ProgressUpdateTableRow = {
  id: string;
  number: number;
  title: string;
  programTitle: string;
  programSlug: string;
  birdepName: string;
  birdepCode: string;
  authorName: string;
  progressPercent: number;
  status: string;
  reportedAt: string;
};

function getProgressStatusLabel(status: string) {
  const labels: Record<string, string> = {
    ON_TRACK: "Sesuai Rencana",
    AT_RISK: "Berisiko",
    BLOCKED: "Terhambat",
    DONE: "Selesai",
  };

  return labels[status] ?? status;
}

function getProgressStatusClassName(status: string) {
  const classNames: Record<string, string> = {
    ON_TRACK: "bg-status-active-soft text-status-active",
    AT_RISK: "bg-primary/10 text-primary",
    BLOCKED: "bg-status-inactive-soft text-status-inactive",
    DONE: "bg-status-active-soft text-status-active",
  };

  return classNames[status] ?? "bg-muted text-muted-foreground";
}

export const progressUpdateColumns: ColumnDef<ProgressUpdateTableRow>[] = [
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
        Progress Update
        <ArrowUpDown className="size-3.5" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="min-w-56">
        <Link
          href={`/dashboard/progress/${row.original.id}`}
          className="font-semibold text-foreground transition hover:text-primary"
        >
          {row.original.title}
        </Link>

        <div className="mt-1 text-xs text-muted-foreground">
          Dilaporkan: {row.original.reportedAt}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "programTitle",
    header: "Program",
    cell: ({ row }) => (
      <div className="min-w-56">
        <div className="font-medium">{row.original.programTitle}</div>
        <div className="mt-1 text-xs text-muted-foreground">
          {row.original.programSlug}
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
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <span
        className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${getProgressStatusClassName(
          row.original.status,
        )}`}
      >
        {getProgressStatusLabel(row.original.status)}
      </span>
    ),
  },
  {
    accessorKey: "authorName",
    header: "Pelapor",
    cell: ({ row }) => (
      <span className="whitespace-nowrap text-muted-foreground">
        {row.original.authorName}
      </span>
    ),
  },
];