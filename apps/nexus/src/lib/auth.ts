import { prisma } from "@orma/database";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { admin } from "better-auth/plugins";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  emailAndPassword: {
    enabled: true,
    disableSignUp: true,
  },

  session: {
    expiresIn: 60 * 15,
    updateAge: 60 * 5,
  },

  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: "ANGGOTA_BIRDEP",
        input: false,
      },
      mustChangePassword: {
        type: "boolean",
        required: true,
        defaultValue: true,
        input: false,
      },
      memberId: {
        type: "string",
        required: false,
        input: false,
      },
    },
  },

  plugins: [admin()],

  trustedOrigins: ["http://localhost:3000"],
});