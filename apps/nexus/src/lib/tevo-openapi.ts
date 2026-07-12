const appUrl =
  process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ??
  "http://localhost:3000";

export const tevoOpenApiSpec = {
  openapi: "3.1.0",
  info: {
    title: "Tevo Public API",
    version: "1.0.0",
    description:
      "Dokumentasi API publik Tevo untuk mengambil data profile, program kerja, artikel, struktur organisasi, dan anggota dari Nexus.",
  },
  servers: [
    {
      url: appUrl,
      description: "Nexus API Server",
    },
  ],
  tags: [
    {
      name: "Site Profile",
      description: "Data profil website publik Tevo.",
    },
    {
      name: "Programs",
      description: "Data program kerja yang sudah dipublish ke Tevo.",
    },
    {
      name: "Articles",
      description: "Data berita dan artikel Tevo yang sudah published.",
    },
    {
      name: "Organization",
      description: "Data struktur organisasi dan anggota aktif.",
    },
  ],
  paths: {
    "/api/public/tevo/site-profile": {
      get: {
        tags: ["Site Profile"],
        summary: "Get active Tevo site profile",
        description:
          "Mengambil data profil website Tevo yang sedang aktif, termasuk nama situs, tagline, visi, misi, dan hero content.",
        responses: {
          "200": {
            description: "Site profile berhasil diambil.",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/SiteProfileResponse",
                },
              },
            },
          },
        },
      },
    },

    "/api/public/tevo/programs": {
      get: {
        tags: ["Programs"],
        summary: "Get published Tevo programs",
        description:
          "Mengambil daftar program kerja yang sudah dipublish ke website publik Tevo.",
        responses: {
          "200": {
            description: "Daftar program berhasil diambil.",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProgramsResponse",
                },
              },
            },
          },
        },
      },
    },

    "/api/public/tevo/programs/{slug}": {
      get: {
        tags: ["Programs"],
        summary: "Get Tevo program detail by slug",
        description:
          "Mengambil detail program kerja publik berdasarkan slug program.",
        parameters: [
          {
            name: "slug",
            in: "path",
            required: true,
            description: "Slug publik program kerja.",
            schema: {
              type: "string",
              example: "angkasakost",
            },
          },
        ],
        responses: {
          "200": {
            description: "Detail program berhasil diambil.",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProgramDetailResponse",
                },
              },
            },
          },
          "404": {
            description: "Program tidak ditemukan.",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
        },
      },
    },

    "/api/public/tevo/articles": {
      get: {
        tags: ["Articles"],
        summary: "Get published Tevo articles",
        description:
          "Mengambil daftar artikel atau berita yang sudah berstatus published.",
        responses: {
          "200": {
            description: "Daftar artikel berhasil diambil.",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ArticlesResponse",
                },
              },
            },
          },
        },
      },
    },

    "/api/public/tevo/articles/{slug}": {
      get: {
        tags: ["Articles"],
        summary: "Get Tevo article detail by slug",
        description:
          "Mengambil detail artikel atau berita publik berdasarkan slug.",
        parameters: [
          {
            name: "slug",
            in: "path",
            required: true,
            description: "Slug artikel Tevo.",
            schema: {
              type: "string",
              example: "launching-program-kerja-astana-angkasa",
            },
          },
        ],
        responses: {
          "200": {
            description: "Detail artikel berhasil diambil.",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ArticleDetailResponse",
                },
              },
            },
          },
          "404": {
            description: "Artikel tidak ditemukan.",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErrorResponse",
                },
              },
            },
          },
        },
      },
    },

    "/api/public/tevo/organization-structure": {
      get: {
        tags: ["Organization"],
        summary: "Get active organization structure",
        description:
          "Mengambil struktur organisasi dari cabinet period yang sedang aktif.",
        responses: {
          "200": {
            description: "Struktur organisasi berhasil diambil.",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/OrganizationStructureResponse",
                },
              },
            },
          },
        },
      },
    },

    "/api/public/tevo/members": {
      get: {
        tags: ["Organization"],
        summary: "Get active members",
        description:
          "Mengambil daftar anggota aktif pada cabinet period yang sedang aktif.",
        responses: {
          "200": {
            description: "Daftar anggota berhasil diambil.",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/MembersResponse",
                },
              },
            },
          },
        },
      },
    },
  },

  components: {
    schemas: {
      SuccessBase: {
        type: "object",
        properties: {
          success: {
            type: "boolean",
            example: true,
          },
        },
        required: ["success"],
      },

      ErrorResponse: {
        type: "object",
        properties: {
          success: {
            type: "boolean",
            example: false,
          },
          message: {
            type: "string",
            example: "Data tidak ditemukan.",
          },
        },
        required: ["success", "message"],
      },

      SiteProfile: {
        type: "object",
        properties: {
          id: {
            type: "string",
            example: "uuid",
          },
          siteName: {
            type: "string",
            example: "Tevo",
          },
          tagline: {
            type: ["string", "null"],
            example: "Astana Angkasa dalam satu ruang digital.",
          },
          organizationSummary: {
            type: ["string", "null"],
          },
          vision: {
            type: ["string", "null"],
          },
          mission: {
            type: ["string", "null"],
          },
          heroTitle: {
            type: ["string", "null"],
          },
          heroSubtitle: {
            type: ["string", "null"],
          },
          updatedAt: {
            type: ["string", "null"],
            format: "date-time",
          },
        },
      },

      SiteProfileResponse: {
        allOf: [
          {
            $ref: "#/components/schemas/SuccessBase",
          },
          {
            type: "object",
            properties: {
              data: {
                anyOf: [
                  {
                    $ref: "#/components/schemas/SiteProfile",
                  },
                  {
                    type: "null",
                  },
                ],
              },
            },
          },
        ],
      },

      BirdepSummary: {
        type: "object",
        properties: {
          id: {
            type: "string",
          },
          name: {
            type: "string",
            example: "Biro Riset dan Teknologi",
          },
          code: {
            type: "string",
            example: "RISTEK",
          },
          slug: {
            type: "string",
            example: "riset-dan-teknologi",
          },
          unitType: {
            type: "string",
            example: "BIRO",
          },
          unitTypeLabel: {
            type: "string",
            example: "Biro",
          },
        },
      },

      ProgramListItem: {
        type: "object",
        properties: {
          id: {
            type: "string",
          },
          title: {
            type: ["string", "null"],
            example: "AngkasaKost",
          },
          slug: {
            type: ["string", "null"],
            example: "angkasakost",
          },
          summary: {
            type: ["string", "null"],
          },
          coverUrl: {
            type: ["string", "null"],
            example:
              "https://nexus.ormawaeksekutifpku.com/uploads/media/example.webp",
          },
          publishedAt: {
            type: ["string", "null"],
            format: "date-time",
          },
          updatedAt: {
            type: ["string", "null"],
            format: "date-time",
          },
          birdep: {
            $ref: "#/components/schemas/BirdepSummary",
          },
        },
      },

      ProgramsResponse: {
        allOf: [
          {
            $ref: "#/components/schemas/SuccessBase",
          },
          {
            type: "object",
            properties: {
              data: {
                type: "array",
                items: {
                  $ref: "#/components/schemas/ProgramListItem",
                },
              },
            },
          },
        ],
      },

      ProgramDetail: {
        allOf: [
          {
            $ref: "#/components/schemas/ProgramListItem",
          },
          {
            type: "object",
            properties: {
              description: {
                type: ["string", "null"],
              },
              birdep: {
                allOf: [
                  {
                    $ref: "#/components/schemas/BirdepSummary",
                  },
                  {
                    type: "object",
                    properties: {
                      description: {
                        type: "string",
                      },
                      focusArea: {
                        type: "string",
                      },
                    },
                  },
                ],
              },
            },
          },
        ],
      },

      ProgramDetailResponse: {
        allOf: [
          {
            $ref: "#/components/schemas/SuccessBase",
          },
          {
            type: "object",
            properties: {
              data: {
                $ref: "#/components/schemas/ProgramDetail",
              },
            },
          },
        ],
      },

      ArticleListItem: {
        type: "object",
        properties: {
          id: {
            type: "string",
          },
          title: {
            type: "string",
            example: "Launching Program Kerja Astana Angkasa",
          },
          slug: {
            type: "string",
            example: "launching-program-kerja-astana-angkasa",
          },
          excerpt: {
            type: ["string", "null"],
          },
          coverUrl: {
            type: ["string", "null"],
          },
          authorName: {
            type: ["string", "null"],
          },
          publishedAt: {
            type: ["string", "null"],
            format: "date-time",
          },
          updatedAt: {
            type: ["string", "null"],
            format: "date-time",
          },
        },
      },

      ArticlesResponse: {
        allOf: [
          {
            $ref: "#/components/schemas/SuccessBase",
          },
          {
            type: "object",
            properties: {
              data: {
                type: "array",
                items: {
                  $ref: "#/components/schemas/ArticleListItem",
                },
              },
            },
          },
        ],
      },

      ArticleDetail: {
        allOf: [
          {
            $ref: "#/components/schemas/ArticleListItem",
          },
          {
            type: "object",
            properties: {
              content: {
                type: "string",
              },
            },
          },
        ],
      },

      ArticleDetailResponse: {
        allOf: [
          {
            $ref: "#/components/schemas/SuccessBase",
          },
          {
            type: "object",
            properties: {
              data: {
                $ref: "#/components/schemas/ArticleDetail",
              },
            },
          },
        ],
      },

      OrganizationMember: {
        type: "object",
        properties: {
          id: {
            type: "string",
          },
          fullName: {
            type: "string",
            example: "Nama Anggota",
          },
          instagram: {
            type: ["string", "null"],
          },
          position: {
            type: ["string", "null"],
            example: "KETUA_BIRDEP",
          },
          positionLabel: {
            type: ["string", "null"],
            example: "Ketua Birdep",
          },
          internalTitle: {
            type: ["string", "null"],
          },
          subdivision: {
            type: ["string", "null"],
          },
          programRoles: {
            type: ["string", "null"],
          },
        },
      },

      OrganizationUnit: {
        type: "object",
        properties: {
          id: {
            type: "string",
          },
          name: {
            type: "string",
          },
          code: {
            type: "string",
          },
          slug: {
            type: "string",
          },
          unitType: {
            type: "string",
          },
          unitTypeLabel: {
            type: "string",
          },
          description: {
            type: "string",
          },
          focusArea: {
            type: "string",
          },
          members: {
            type: "array",
            items: {
              $ref: "#/components/schemas/OrganizationMember",
            },
          },
        },
      },

      Cabinet: {
        type: "object",
        properties: {
          id: {
            type: "string",
          },
          name: {
            type: "string",
          },
          slug: {
            type: "string",
          },
          startDate: {
            type: ["string", "null"],
            format: "date-time",
          },
          endDate: {
            type: ["string", "null"],
            format: "date-time",
          },
        },
      },

      OrganizationStructureResponse: {
        allOf: [
          {
            $ref: "#/components/schemas/SuccessBase",
          },
          {
            type: "object",
            properties: {
              data: {
                type: "object",
                properties: {
                  cabinet: {
                    anyOf: [
                      {
                        $ref: "#/components/schemas/Cabinet",
                      },
                      {
                        type: "null",
                      },
                    ],
                  },
                  units: {
                    type: "array",
                    items: {
                      $ref: "#/components/schemas/OrganizationUnit",
                    },
                  },
                },
              },
            },
          },
        ],
      },

      MemberListItem: {
        allOf: [
          {
            $ref: "#/components/schemas/OrganizationMember",
          },
          {
            type: "object",
            properties: {
              birdep: {
                anyOf: [
                  {
                    $ref: "#/components/schemas/BirdepSummary",
                  },
                  {
                    type: "null",
                  },
                ],
              },
            },
          },
        ],
      },

      MembersResponse: {
        allOf: [
          {
            $ref: "#/components/schemas/SuccessBase",
          },
          {
            type: "object",
            properties: {
              data: {
                type: "object",
                properties: {
                  cabinet: {
                    anyOf: [
                      {
                        type: "object",
                        properties: {
                          id: {
                            type: "string",
                          },
                          name: {
                            type: "string",
                          },
                        },
                      },
                      {
                        type: "null",
                      },
                    ],
                  },
                  members: {
                    type: "array",
                    items: {
                      $ref: "#/components/schemas/MemberListItem",
                    },
                  },
                },
              },
            },
          },
        ],
      },
    },
  },
} as const;