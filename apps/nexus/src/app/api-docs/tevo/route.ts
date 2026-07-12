import { ApiReference } from "@scalar/nextjs-api-reference";

export const GET = ApiReference({
  url: "/api/public/tevo/openapi.json",
  theme: "default",
  layout: "modern",
  metaData: {
    title: "Tevo Public API Documentation",
    description:
      "Dokumentasi API publik Tevo untuk website ormawaeksekutifpku.com.",
  },
});