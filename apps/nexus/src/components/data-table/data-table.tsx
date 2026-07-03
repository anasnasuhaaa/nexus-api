"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { RotateCcw, Search } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type FilterOption = {
  label: string;
  value: string;
};

type DataTableFilter = {
  columnId: string;
  label: string;
  options: FilterOption[];
};

type DataTableSortOption = {
  label: string;
  value: string;
  columnId: string;
  desc?: boolean;
};

type DataTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKey?: string;
  searchPlaceholder?: string;
  filters?: DataTableFilter[];
  sortOptions?: DataTableSortOption[];
};

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  searchPlaceholder = "Cari data...",
  filters = [],
  sortOptions = [],
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [selectedSort, setSelectedSort] = useState("");

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const searchColumn = searchKey ? table.getColumn(searchKey) : undefined;

  const hasActiveFilter = useMemo(() => {
    return columnFilters.length > 0 || sorting.length > 0 || selectedSort !== "";
  }, [columnFilters.length, selectedSort, sorting.length]);

  function handleSelectFilter(columnId: string, value: string) {
    const column = table.getColumn(columnId);

    if (!column) {
      return;
    }

    column.setFilterValue(value === "ALL" ? undefined : value);
    table.setPageIndex(0);
  }

  function getFilterValue(columnId: string) {
    const column = table.getColumn(columnId);
    return (column?.getFilterValue() as string | undefined) ?? "ALL";
  }

  function handleSortChange(value: string) {
    setSelectedSort(value);

    const selectedOption = sortOptions.find((option) => option.value === value);

    if (!selectedOption) {
      setSorting([]);
      table.setPageIndex(0);
      return;
    }

    setSorting([
      {
        id: selectedOption.columnId,
        desc: selectedOption.desc ?? false,
      },
    ]);

    table.setPageIndex(0);
  }

  function resetFilters() {
    setColumnFilters([]);
    setSorting([]);
    setSelectedSort("");
    table.resetColumnFilters();
    table.resetSorting();
    table.setPageIndex(0);
  }

  const filteredRowsCount = table.getFilteredRowModel().rows.length;
  const currentRowsCount = table.getRowModel().rows.length;

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border bg-card p-4 shadow-sm">
        <div className="grid gap-3 lg:grid-cols-[minmax(220px,1.3fr)_repeat(4,minmax(150px,0.7fr))_auto]">
          {searchColumn ? (
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={searchPlaceholder}
                value={(searchColumn.getFilterValue() as string) ?? ""}
                onChange={(event) => {
                  searchColumn.setFilterValue(event.target.value);
                  table.setPageIndex(0);
                }}
                className="pl-9"
              />
            </div>
          ) : null}

          {filters.map((filter) => (
            <div key={filter.columnId}>
              <label className="sr-only">{filter.label}</label>

              <select
                value={getFilterValue(filter.columnId)}
                onChange={(event) =>
                  handleSelectFilter(filter.columnId, event.target.value)
                }
                className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none transition focus:ring-2 focus:ring-ring"
              >
                {filter.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          ))}

          {sortOptions.length > 0 ? (
            <div>
              <label className="sr-only">Urutkan data</label>

              <select
                value={selectedSort}
                onChange={(event) => handleSortChange(event.target.value)}
                className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none transition focus:ring-2 focus:ring-ring"
              >
                <option value="">Urutkan</option>

                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          ) : null}

          <Button
            type="button"
            variant="outline"
            onClick={resetFilters}
            disabled={!hasActiveFilter}
            className="h-10"
          >
            <RotateCcw className="size-4" />
            Reset
          </Button>
        </div>

        <div className="mt-3 flex flex-col gap-1 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            Menampilkan {currentRowsCount} data pada halaman ini dari{" "}
            {filteredRowsCount} hasil.
          </p>

          {hasActiveFilter ? (
            <p className="font-medium text-primary">Filter sedang aktif</p>
          ) : (
            <p>Total data: {data.length}</p>
          )}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border bg-card">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="bg-muted/50">
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="whitespace-nowrap text-center"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="align-top">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center text-muted-foreground"
                  >
                    Tidak ada data yang sesuai dengan filter.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Halaman {table.getState().pagination.pageIndex + 1} dari{" "}
          {table.getPageCount() || 1}
        </p>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Sebelumnya
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Berikutnya
          </Button>
        </div>
      </div>
    </div>
  );
}