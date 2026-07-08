import { prisma } from "@orma/database";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { admin } from "better-auth/plugins";

import { sendEmail } from "@/lib/email";

function getAppUrl() {
  return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
}

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  emailAndPassword: {
    enabled: true,
    disableSignUp: true,
    resetPasswordTokenExpiresIn: 60 * 60,
    revokeSessionsOnPasswordReset: true,

    sendResetPassword: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        subject: "Aktivasi / Reset Password Akun Nexus Ormawa Eksekutif PKU IPB",
        text: `Halo ${user.name}, klik link berikut untuk membuat password akun Nexus kamu: ${url}`,
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.7; color: #111827;">
            <h2 style="margin-bottom: 12px;">Aktivasi Akun Nexus</h2>

            <p>Halo <strong>${user.name}</strong>,</p>

            <p>
              Kamu menerima email ini karena akun Nexus kamu perlu diaktivasi
              atau password akun kamu perlu direset.
            </p>

            <p>
              Klik tombol di bawah ini untuk membuat password baru:
            </p>

            <p style="margin: 24px 0;">
              <a
                href="${url}"
                style="
                  display: inline-block;
                  background: #BE1E2D;
                  color: white;
                  padding: 12px 18px;
                  border-radius: 10px;
                  text-decoration: none;
                  font-weight: 700;
                "
              >
                Buat Password Nexus
              </a>
            </p>

            <p>
              Link ini berlaku selama 1 jam. Jika kamu tidak merasa meminta akses ini,
              abaikan email ini.
            </p>

            <p style="margin-top: 24px; color: #6B7280; font-size: 13px;">
              Nexus - Ormawa Eksekutif PKU IPB
            </p>
          </div>
        `,
      });
    },

    onPasswordReset: async ({ user }) => {
      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          mustChangePassword: false,
          emailVerified: true,
          updatedAt: new Date(),
        },
      });
    },
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

  trustedOrigins: [getAppUrl(), "http://localhost:3000"],
});
