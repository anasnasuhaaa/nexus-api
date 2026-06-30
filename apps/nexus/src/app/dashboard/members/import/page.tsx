import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Download,
  FileSpreadsheet,
  Info,
  ShieldCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import { MemberImportForm } from "./import-form";

const birdepCodes = [
  "BPH",
  "INTERNAL",
  "MEDBRAND",
  "RISTEK",
  "KOMIT",
  "ADKESMAH",
  "AKPRES",
  "KASTRAT",
  "PERAGA",
  "PSDM",
  "SENBUD",
  "SLH",
  "EKRAF",
];

const organizationalPositions = [
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

const roleOptions = [
  "SUPER_ADMIN",
  "BPH",
  "TEVO_ADMIN",
  "KETUA_BIRDEP",
  "SEKRETARIS_BIRDEP",
  "BENDAHARA_BIRDEP",
  "ANGGOTA_BIRDEP",
];

export default function MemberImportPage() {
  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-3xl border bg-card shadow-sm">
        <div className="border-b bg-muted/30 px-6 py-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
                Import Anggota
              </p>

              <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
                Validasi File XLSX
              </h1>

              <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">
                Upload file anggota dalam format .xlsx untuk memeriksa struktur
                kolom, kode Birdep, jabatan organisasi, dan potensi duplikasi
                sebelum data benar-benar disimpan ke database.
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <Link href="/api/members/import-template">
                <Button variant="outline" className="w-full sm:w-auto">
                  <Download className="size-4" />
                  Download Template
                </Button>
              </Link>

              <Link href="/dashboard/members">
                <Button variant="outline" className="w-full sm:w-auto">
                  <ArrowLeft className="size-4" />
                  Kembali
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="grid gap-4 px-6 py-5 md:grid-cols-3">
          <div className="flex gap-3 rounded-2xl border bg-background p-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <FileSpreadsheet className="size-5" />
            </div>

            <div>
              <p className="text-sm font-bold">Format File</p>
              <p className="mt-1 text-xs leading-6 text-muted-foreground">
                Hanya mendukung file .xlsx. CSV tidak digunakan pada sistem ini.
              </p>
            </div>
          </div>

          <div className="flex gap-3 rounded-2xl border bg-background p-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-status-active-soft text-status-active">
              <CheckCircle2 className="size-5" />
            </div>

            <div>
              <p className="text-sm font-bold">Validasi Dulu</p>
              <p className="mt-1 text-xs leading-6 text-muted-foreground">
                Data akan diperiksa dan ditampilkan sebagai preview sebelum
                masuk database.
              </p>
            </div>
          </div>

          <div className="flex gap-3 rounded-2xl border bg-background p-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <ShieldCheck className="size-5" />
            </div>

            <div>
              <p className="text-sm font-bold">Aman untuk Admin</p>
              <p className="mt-1 text-xs leading-6 text-muted-foreground">
                Template sudah menyediakan header wajib, panduan, dan referensi
                pilihan.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border bg-card p-5 shadow-sm">
        <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-start">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Info className="size-5" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="max-w-3xl">
              <h2 className="font-black tracking-tight">
                Panduan Pilihan Isian
              </h2>

              <p className="mt-1 text-sm leading-7 text-muted-foreground">
                Beberapa kolom memiliki nilai pilihan yang harus ditulis sesuai
                format. Gunakan daftar berikut agar file valid saat diupload.
              </p>
            </div>

            <div className="mt-5 grid gap-4 xl:grid-cols-2">
              <div className="rounded-2xl border bg-background p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold text-foreground">
                      primary_birdep_code
                    </p>

                    <p className="mt-1 text-xs leading-6 text-muted-foreground">
                      Gunakan salah satu kode Birdep berikut.
                    </p>
                  </div>

                  <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                    Required
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {birdepCodes.map((code) => (
                    <code
                      key={code}
                      className="rounded-lg border bg-muted px-2.5 py-1.5 text-xs font-semibold text-muted-foreground"
                    >
                      {code}
                    </code>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border bg-background p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold text-foreground">
                      organizational_position
                    </p>

                    <p className="mt-1 text-xs leading-6 text-muted-foreground">
                      Gunakan salah satu jabatan organisasi berikut.
                    </p>
                  </div>

                  <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                    Required
                  </span>
                </div>

                <div className="mt-4 grid gap-2 text-xs">
                  {organizationalPositions.map((position) => (
                    <div
                      key={position.value}
                      className="grid gap-1 rounded-xl border bg-muted/40 px-3 py-2 sm:grid-cols-[1fr_auto] sm:items-center"
                    >
                      <code className="font-semibold text-primary">
                        {position.value}
                      </code>

                      <span className="text-muted-foreground">
                        {position.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border bg-background p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold text-foreground">
                      is_active
                    </p>

                    <p className="mt-1 text-xs leading-6 text-muted-foreground">
                      Menentukan apakah anggota aktif atau tidak. Sistem
                      menerima beberapa variasi penulisan berikut.
                    </p>
                  </div>

                  <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                    Required
                  </span>
                </div>

                <div className="mt-4 grid gap-3 text-xs sm:grid-cols-2">
                  <div className="rounded-xl border bg-status-active-soft px-3 py-2 text-status-active">
                    <p className="font-semibold">Aktif</p>
                    <p className="mt-1 leading-5">TRUE, 1, YA, YES, AKTIF</p>
                  </div>

                  <div className="rounded-xl border bg-status-inactive-soft px-3 py-2 text-status-inactive">
                    <p className="font-semibold">Nonaktif</p>
                    <p className="mt-1 leading-5">
                      FALSE, 0, TIDAK, NO, NONAKTIF
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border bg-background p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold text-foreground">
                      additional_roles
                    </p>

                    <p className="mt-1 text-xs leading-6 text-muted-foreground">
                      Opsional. Isi jika anggota punya role tambahan di luar
                      jabatan utama. Jika lebih dari satu, pisahkan dengan koma.
                    </p>
                  </div>

                  <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground">
                    Optional
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {roleOptions.map((role) => (
                    <code
                      key={role}
                      className="rounded-lg border bg-muted px-2.5 py-1.5 text-xs font-semibold text-muted-foreground"
                    >
                      {role}
                    </code>
                  ))}
                </div>

                <div className="mt-4 rounded-xl border bg-muted/40 px-3 py-2 text-xs leading-6 text-muted-foreground">
                  Contoh: <code className="text-primary">TEVO_ADMIN</code> atau{" "}
                  <code className="text-primary">TEVO_ADMIN,BPH</code>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <MemberImportForm />
    </div>
  );
}