import { NextResponse } from "next/server";

const PUBLIC_API_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Max-Age": "86400",
  "Cache-Control":
    "public, max-age=60, s-maxage=300, stale-while-revalidate=86400",
};

function mergeHeaders(headers?: HeadersInit) {
  const mergedHeaders = new Headers(PUBLIC_API_HEADERS);

  if (headers) {
    const extraHeaders = new Headers(headers);

    extraHeaders.forEach((value, key) => {
      mergedHeaders.set(key, value);
    });
  }

  return mergedHeaders;
}

export function publicJson<TData>(
  data: TData,
  init?: ResponseInit,
) {
  return NextResponse.json(
    {
      success: true,
      data,
    },
    {
      ...init,
      headers: mergeHeaders(init?.headers),
    },
  );
}

export function publicError(message: string, status = 500) {
  return NextResponse.json(
    {
      success: false,
      message,
    },
    {
      status,
      headers: mergeHeaders(),
    },
  );
}

export function publicNotFound(message = "Data tidak ditemukan.") {
  return publicError(message, 404);
}

export function publicOptions() {
  return new NextResponse(null, {
    status: 204,
    headers: mergeHeaders(),
  });
}

export function toIsoString(date: Date | null | undefined) {
  return date ? date.toISOString() : null;
}

export function getPublicMediaUrl(url: string | null | undefined) {
  if (!url) {
    return null;
  }

  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "");

  if (!baseUrl) {
    return url;
  }

  return `${baseUrl}${url.startsWith("/") ? url : `/${url}`}`;
}

export function formatOrganizationalPosition(position: string) {
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

export function formatUnitType(unitType: string) {
  const labels: Record<string, string> = {
    BPH: "BPH",
    BIRO: "Biro",
    DEPARTEMEN: "Departemen",
  };

  return labels[unitType] ?? unitType;
}