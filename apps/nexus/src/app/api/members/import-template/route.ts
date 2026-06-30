import { prisma } from "@orma/database";
import * as XLSX from "xlsx";

const headers = [
  "full_name",
  "email",
  "nim",
  "primary_birdep_code",
  "organizational_position",
  "internal_title",
  "subdivision",
  "instagram",
  "additional_roles",
  "temporary_password",
  "is_active",
];

const positionReferences = [
  {
    organizational_position: "KETUA_ORGANISASI",
    label: "Ketua Organisasi",
  },
  {
    organizational_position: "WAKIL_KETUA_ORGANISASI",
    label: "Wakil Ketua Organisasi",
  },
  {
    organizational_position: "SEKRETARIS_INTERNAL",
    label: "Sekretaris Internal",
  },
  {
    organizational_position: "SEKRETARIS_EKSTERNAL",
    label: "Sekretaris Eksternal",
  },
  {
    organizational_position: "BENDAHARA_INTERNAL",
    label: "Bendahara Internal",
  },
  {
    organizational_position: "BENDAHARA_EKSTERNAL",
    label: "Bendahara Eksternal",
  },
  {
    organizational_position: "KETUA_BIRDEP",
    label: "Ketua Birdep",
  },
  {
    organizational_position: "SEKRETARIS_BIRDEP",
    label: "Sekretaris Birdep",
  },
  {
    organizational_position: "BENDAHARA_BIRDEP",
    label: "Bendahara Birdep",
  },
  {
    organizational_position: "ANGGOTA_BIRDEP",
    label: "Anggota Birdep",
  },
];

export async function GET() {
  const activeCabinet = await prisma.cabinetPeriod.findFirst({
    where: {
      isActive: true,
    },
    select: {
      id: true,
      name: true,
    },
  });

  const birdeps = activeCabinet
    ? await prisma.birdep.findMany({
        where: {
          cabinetPeriodId: activeCabinet.id,
          isActive: true,
        },
        orderBy: [
          {
            unitType: "asc",
          },
          {
            name: "asc",
          },
        ],
        select: {
          code: true,
          name: true,
          unitType: true,
        },
      })
    : [];

  const exampleRows = [
    {
      full_name: "Arkan Ganteng",
      email: "arkanganteng@gmail.com",
      nim: "M0403251114",
      primary_birdep_code: "RISTEK",
      organizational_position: "ANGGOTA_BIRDEP",
      internal_title: "",
      subdivision: "",
      instagram: "username_instagram",
      additional_roles: "",
      temporary_password: "PasswordAwal123!",
      is_active: "TRUE",
    },
  ];

  const guideRows = [
    {
      kolom: "full_name",
      keterangan: "Nama lengkap anggota. Wajib diisi.",
      contoh: "Nama Lengkap Contoh",
    },
    {
      kolom: "email",
      keterangan: "Email untuk akun login Nexus. Wajib unik.",
      contoh: "arkanganteng@gmail.como",
    },
    {
      kolom: "nim",
      keterangan: "NIM anggota. Wajib unik.",
      contoh: "M0403251114",
    },
    {
      kolom: "primary_birdep_code",
      keterangan:
        "Kode Birdep utama anggota. Ambil dari sheet Referensi Kode Birdep.",
      contoh: "RISTEK",
    },
    {
      kolom: "organizational_position",
      keterangan:
        "Jabatan organisasi. Ambil dari sheet Referensi Jabatan.",
      contoh: "ANGGOTA_BIRDEP",
    },
    {
      kolom: "internal_title",
      keterangan: "Title internal opsional. Boleh dikosongkan.",
      contoh: "",
    },
    {
      kolom: "subdivision",
      keterangan: "Subdivisi opsional. Boleh dikosongkan.",
      contoh: "",
    },
    {
      kolom: "instagram",
      keterangan:
        "Username Instagram opsional. Boleh pakai @ atau tanpa @.",
      contoh: "username_instagram",
    },
    {
      kolom: "additional_roles",
      keterangan:
        "Role tambahan opsional. Pisahkan dengan koma jika lebih dari satu.",
      contoh: "TEVO_ADMIN",
    },
    {
      kolom: "temporary_password",
      keterangan:
        "Password awal akun. Wajib diisi. User nanti diarahkan ganti password.",
      contoh: "PasswordAwal123!",
    },
    {
      kolom: "is_active",
      keterangan:
        "Status aktif anggota. Gunakan TRUE/FALSE, YA/TIDAK, atau AKTIF/NONAKTIF.",
      contoh: "TRUE",
    },
  ];

  const workbook = XLSX.utils.book_new();

  const templateSheet = XLSX.utils.json_to_sheet(exampleRows, {
    header: headers,
  });

  const guideSheet = XLSX.utils.json_to_sheet(guideRows);

  const birdepSheet = XLSX.utils.json_to_sheet(
    birdeps.map((birdep) => ({
      code: birdep.code,
      name: birdep.name,
      unit_type: birdep.unitType,
      cabinet: activeCabinet?.name ?? "-",
    })),
  );

  const positionSheet = XLSX.utils.json_to_sheet(positionReferences);

  templateSheet["!cols"] = headers.map(() => ({
    wch: 24,
  }));

  guideSheet["!cols"] = [
    { wch: 24 },
    { wch: 70 },
    { wch: 28 },
  ];

  birdepSheet["!cols"] = [
    { wch: 18 },
    { wch: 55 },
    { wch: 18 },
    { wch: 32 },
  ];

  positionSheet["!cols"] = [
    { wch: 32 },
    { wch: 32 },
  ];

  XLSX.utils.book_append_sheet(
    workbook,
    templateSheet,
    "Template Import Anggota",
  );
  XLSX.utils.book_append_sheet(workbook, guideSheet, "Panduan");
  XLSX.utils.book_append_sheet(workbook, birdepSheet, "Referensi Kode Birdep");
  XLSX.utils.book_append_sheet(workbook, positionSheet, "Referensi Jabatan");

  const buffer = XLSX.write(workbook, {
    type: "buffer",
    bookType: "xlsx",
  });

  return new Response(buffer, {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition":
        'attachment; filename="template-import-anggota-nexus.xlsx"',
      "Cache-Control": "no-store",
    },
  });
}