"use client";

import { FormEvent, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  FileSpreadsheet,
  Loader2,
  Upload,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import {
  ImportPreviewResult,
  parseMemberImportFile,
} from "./actions";

export function MemberImportForm() {
  const [result, setResult] = useState<ImportPreviewResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    setIsLoading(true);
    const response = await parseMemberImportFile(formData);
    setIsLoading(false);

    setResult(response);

    if (!response.success) {
      toast.error("Validasi gagal", {
        description: response.message,
        duration: 2000,
      });
      return;
    }

    if (response.summary.invalidRows > 0) {
      toast.error("File perlu diperbaiki", {
        description: `${response.summary.invalidRows} baris masih invalid.`,
        duration: 2000,
      });
      return;
    }

    toast.success("File valid", {
      description: "Semua baris siap untuk diimport.",
      duration: 2000,
    });
  }

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border bg-card p-5 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-2">
              <label
                htmlFor="file"
                className="text-sm font-semibold text-foreground"
              >
                Upload File XLSX
              </label>

              <input
                id="file"
                name="file"
                type="file"
                accept=".xlsx"
                required
                className="block w-full rounded-xl border border-input bg-background px-3 py-2 text-sm file:mr-4 file:rounded-lg file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-primary-foreground"
              />

              <p className="text-xs text-muted-foreground">
                Hanya mendukung format .xlsx. CSV tidak digunakan pada sistem
                ini.
              </p>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isLoading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Memvalidasi...
                </>
              ) : (
                <>
                  <Upload className="size-4" />
                  Validasi File
                </>
              )}
            </Button>
          </div>
        </form>
      </section>

      {result ? (
        <section className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl border bg-card p-5 shadow-sm">
              <div className="mb-4 flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <FileSpreadsheet className="size-5" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Baris
              </p>
              <p className="mt-2 text-3xl font-black tracking-tight">
                {result.summary.totalRows}
              </p>
            </div>

            <div className="rounded-3xl border bg-card p-5 shadow-sm">
              <div className="mb-4 flex size-11 items-center justify-center rounded-2xl bg-status-active-soft text-status-active">
                <CheckCircle2 className="size-5" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">
                Valid
              </p>
              <p className="mt-2 text-3xl font-black tracking-tight">
                {result.summary.validRows}
              </p>
            </div>

            <div className="rounded-3xl border bg-card p-5 shadow-sm">
              <div className="mb-4 flex size-11 items-center justify-center rounded-2xl bg-status-inactive-soft text-status-inactive">
                <AlertCircle className="size-5" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">
                Invalid
              </p>
              <p className="mt-2 text-3xl font-black tracking-tight">
                {result.summary.invalidRows}
              </p>
            </div>
          </div>

          <div className="overflow-hidden rounded-3xl border bg-card shadow-sm">
            <div className="border-b px-5 py-4">
              <h2 className="font-black tracking-tight">Preview Validasi</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Data belum disimpan ke database pada tahap ini.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-300 text-left text-sm">
                <thead className="border-b bg-muted/50 text-center text-xs uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="px-5 py-3 font-semibold">Row</th>
                    <th className="px-5 py-3 font-semibold">Nama</th>
                    <th className="px-5 py-3 font-semibold">Email</th>
                    <th className="px-5 py-3 font-semibold">NIM</th>
                    <th className="px-5 py-3 font-semibold">Birdep</th>
                    <th className="px-5 py-3 font-semibold">Jabatan</th>
                    <th className="px-5 py-3 font-semibold">Status</th>
                    <th className="px-5 py-3 font-semibold">Catatan</th>
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {result.rows.map((row) => (
                    <tr key={row.rowNumber} className="align-top">
                      <td className="px-5 py-4 text-muted-foreground">
                        {row.rowNumber}
                      </td>
                      <td className="px-5 py-4 font-medium">{row.fullName}</td>
                      <td className="px-5 py-4 text-muted-foreground">
                        {row.email}
                      </td>
                      <td className="px-5 py-4 text-muted-foreground">
                        {row.nim}
                      </td>
                      <td className="px-5 py-4">{row.primaryBirdepCode}</td>
                      <td className="px-5 py-4">
                        {row.organizationalPosition}
                      </td>
                      <td className="px-5 py-4">
                        {row.status === "VALID" ? (
                          <span className="inline-flex rounded-full bg-status-active-soft px-2.5 py-1 text-xs font-semibold text-status-active">
                            Valid
                          </span>
                        ) : (
                          <span className="inline-flex rounded-full bg-status-inactive-soft px-2.5 py-1 text-xs font-semibold text-status-inactive">
                            Invalid
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        {row.errors.length > 0 ? (
                          <ul className="list-disc space-y-1 pl-4 text-xs text-status-inactive">
                            {row.errors.map((error) => (
                              <li key={error}>{error}</li>
                            ))}
                          </ul>
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            Siap import
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}