import { NextResponse } from "next/server";

import { tevoOpenApiSpec } from "@/lib/tevo-openapi";

export async function GET() {
  return NextResponse.json(tevoOpenApiSpec, {
    headers: {
      "Cache-Control":
        "public, max-age=60, s-maxage=300, stale-while-revalidate=86400",
    },
  });
}