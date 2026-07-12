import type { CSSProperties } from "react";

import Image from "next/image";
import { Asimovian } from "next/font/google";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { KeyRound, ShieldCheck } from "lucide-react";

import { auth } from "@/lib/auth";

import { LoginForm } from "./login-form";

const asimovian = Asimovian({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

function createTicketMask(radius: string): CSSProperties {
  const maskImage = [
    `radial-gradient(circle ${radius} at 0 0, transparent 97%, #000 100%)`,
    `radial-gradient(circle ${radius} at 100% 0, transparent 97%, #000 100%)`,
    `radial-gradient(circle ${radius} at 0 100%, transparent 97%, #000 100%)`,
    `radial-gradient(circle ${radius} at 100% 100%, transparent 97%, #000 100%)`,
  ].join(", ");

  return {
    WebkitMaskImage: maskImage,
    maskImage,
    WebkitMaskSize: "51% 51%",
    maskSize: "51% 51%",
    WebkitMaskPosition:
      "top left, top right, bottom left, bottom right",
    maskPosition:
      "top left, top right, bottom left, bottom right",
    WebkitMaskRepeat: "no-repeat",
    maskRepeat: "no-repeat",
  };
}

const outerTicketMask = createTicketMask("var(--ticket-notch)");

const innerTicketMask = createTicketMask(
  "calc(var(--ticket-notch) - 1.5px)",
);

export default async function LoginPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect("/dashboard");
  }

  return (
    <main
      className="relative h-svh max-h-svh overflow-hidden bg-[#1B0D08] text-[#34271F] scheme-light"
      style={{ colorScheme: "light" }}
    >
      {/* Background */}
      <div className="absolute inset-0">
        <Image
          src="/login/bg.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="scale-[1.03] object-cover object-center"
        />

        <div className="absolute inset-0 bg-black/20" />

        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(31,13,6,0.18)_0%,rgba(31,13,6,0.38)_45%,rgba(20,8,4,0.68)_100%)]" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,246,219,0.08)_0%,rgba(31,13,6,0.16)_42%,rgba(17,7,3,0.6)_100%)]" />

        <div className="absolute inset-y-0 left-0 w-1/4 bg-linear-to-r from-black/35 to-transparent" />

        <div className="absolute inset-y-0 right-0 w-1/4 bg-linear-to-l from-black/35 to-transparent" />
      </div>


      {/* Seluruh konten dibatasi setinggi viewport */}
      <section className="relative z-10 flex h-full min-h-0 items-center justify-center px-4 py-3 sm:px-6 sm:py-5">
        <div className="w-full max-w-107.5 origin-center [@media(max-height:680px)]:scale-[0.92] [@media(max-height:600px)]:scale-[0.84]">
          {/* Shape utama dengan empat sudut cekung */}
          <div
            style={outerTicketMask}
            className="relative bg-[#D8A95D] p-[1.5px] drop-shadow-[0_28px_55px_rgba(34,12,3,0.48)] [--ticket-notch:28px] sm:[--ticket-notch:38px]"
          >
            <div
              style={innerTicketMask}
              className="relative bg-[#FFF9EE]/95 backdrop-blur-xl"
            >
              <div className="px-7 pb-6 pt-6 sm:px-10 sm:pb-8 sm:pt-8">
                <div className="flex flex-col items-center text-center">
                  <div className="flex min-h-14 items-center justify-center sm:min-h-16">
                    <Image
                      src="/login/logo.png"
                      alt="Logo Astana Angkasa"
                      width={210}
                      height={72}
                      priority
                      className="h-auto w-40 object-contain sm:w-46.25"
                    />
                  </div>

                  <h1
                    className={`${asimovian.className} mt-3 text-[2rem] leading-tight tracking-[0.02em] text-[#A51616] sm:mt-4 sm:text-[2.35rem]`}
                  >
                    Halo, Astaners!
                  </h1>
                </div>

                <LoginForm />

                <div className="mt-5 flex items-start gap-3 rounded-2xl border border-[#E8D8BC] bg-[#F8EEDC]/75 p-3">
                  <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-xl bg-white text-[#A51616] shadow-sm">
                    <KeyRound className="size-4" />
                  </div>

                  <p className="text-xs leading-5 text-[#746456]">
                    Halaman ini hanya tersedia bagi pengurus yang telah memiliki
                    akun dari Super Admin.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <footer className="mt-3 text-center text-[10px] leading-4 text-white/65 sm:mt-4 sm:text-[11px]">
            <p className="font-medium text-white/85">
              Nexus · Kabinet Astana Angkasa
            </p>
            <p>© 2026 Ormawa Eksekutif PKU IPB</p>
          </footer>
        </div>
      </section>
    </main>
  );
}