import type { CSSProperties } from "react";

import Image from "next/image";
import Link from "next/link";
import { Asimovian } from "next/font/google";
import {
  ArrowRight,
  CheckCircle2,
  LayoutDashboard,
  ShieldCheck,
  Users,
} from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
    WebkitMaskPosition: "top left, top right, bottom left, bottom right",
    maskPosition: "top left, top right, bottom left, bottom right",
    WebkitMaskRepeat: "no-repeat",
    maskRepeat: "no-repeat",
  };
}

const outerTicketMask = createTicketMask("var(--ticket-notch)");

const innerTicketMask = createTicketMask(
  "calc(var(--ticket-notch) - 1.5px)",
);

const features = [
  {
    icon: LayoutDashboard,
    title: "Dashboard Terpusat",
    description: "Pantau informasi dan aktivitas organisasi dalam satu sistem.",
  },
  {
    icon: Users,
    title: "Kolaborasi Pengurus",
    description: "Akses dan fitur disesuaikan berdasarkan peran setiap pengurus.",
  },
  {
    icon: CheckCircle2,
    title: "Alur Lebih Teratur",
    description: "Kelola program kerja dan publikasi dengan proses yang jelas.",
  },
];

export default function HomePage() {
  return (
    <main
      className="relative h-screen h-[100svh] max-h-[100svh] overflow-hidden bg-[#1b0d08] text-[#34271f] [color-scheme:light]"
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
          className="scale-[1.035] object-cover object-center"
        />

        <div className="absolute inset-0 bg-black/15" />

        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(31,13,6,0.12)_0%,rgba(31,13,6,0.28)_48%,rgba(20,8,4,0.66)_100%)]" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,246,219,0.06)_0%,rgba(31,13,6,0.12)_45%,rgba(17,7,3,0.58)_100%)]" />

        <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-black/35 to-transparent" />
        <div className="absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-black/35 to-transparent" />
      </div>


      {/* Hero */}
      <section className="relative z-10 flex h-full min-h-0 items-center justify-center px-4 pb-4 pt-20 sm:px-6 sm:pb-6 sm:pt-24 lg:px-8">
        <div className="w-full max-w-6xl origin-center [@media(max-height:720px)]:scale-[0.92] [@media(max-height:640px)]:scale-[0.84]">
          <div
            style={outerTicketMask}
            className="relative bg-[#d8a95d] p-[1.5px] drop-shadow-[0_30px_70px_rgba(34,12,3,0.5)] [--ticket-notch:24px] sm:[--ticket-notch:34px] lg:[--ticket-notch:44px]"
          >
            <div
              style={innerTicketMask}
              className="relative bg-[#fff9ee]/96 backdrop-blur-xl"
            >
              <div className="grid min-h-[500px] items-center gap-8 px-7 py-8 sm:px-10 sm:py-10 lg:grid-cols-[1.18fr_0.82fr] lg:gap-12 lg:px-14 lg:py-12">
                {/* Konten utama */}
                <div>
                  <Image
                    src="/login/logo.png"
                    alt="Logo Astana Angkasa"
                    width={210}
                    height={72}
                    priority
                    className="h-auto w-[155px] object-contain sm:w-[180px]"
                  />

                  <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.22em] text-[#b1833f]">
                    Kabinet Astana Angkasa
                  </p>

                  <h1
                    className={`${asimovian.className} mt-3 max-w-2xl text-[2.65rem] leading-[1.08] tracking-[0.01em] text-[#a51616] sm:text-[3.4rem] lg:text-[4rem]`}
                  >
                    Sistem Informasi Ormawa Eksekutif PKU IPB.
                  </h1>

                  <p className="mt-5 max-w-xl text-sm leading-7 text-[#746456] sm:text-base sm:leading-8">
                    Nexus membantu pengurus mengelola informasi, memantau
                    program kerja, dan menjalankan proses organisasi melalui
                    satu sistem internal yang terstruktur.
                  </p>

                  <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                    <Link
                      href="/login"
                      className={cn(
                        buttonVariants(),
                        "h-12 rounded-full bg-[#b51d1d] px-7 font-bold text-white",
                        "shadow-[0_10px_24px_rgba(181,29,29,0.22)]",
                        "transition hover:-translate-y-0.5 hover:bg-[#9f1717]",
                        "hover:shadow-[0_14px_30px_rgba(181,29,29,0.3)]",
                      )}
                    >
                      Masuk ke Nexus
                      <ArrowRight className="size-4" />
                    </Link>

                    <div className="flex h-12 items-center justify-center gap-2 rounded-full border border-[#e4cfa9] bg-[#fff4df] px-5 text-xs font-semibold text-[#846b4d] sm:text-sm">
                      <ShieldCheck className="size-4 text-[#b51d1d]" />
                      Akses khusus pengurus
                    </div>
                  </div>
                </div>

                {/* Feature panel */}
                <div className="relative hidden lg:block">
                  <div className="absolute -inset-8 rounded-full bg-[#e3b669]/20 blur-3xl" />

                  <div className="relative rounded-[30px] border border-[#ead8b8] bg-[#f8eedc]/80 p-5 shadow-[0_20px_50px_rgba(121,74,22,0.12)]">
                    <div className="flex items-center justify-between border-b border-[#e5d2b2] pb-4">
                      <div>
                        <p className="text-lg font-bold uppercase tracking-[0.18em] text-[#592f24]">
                          Nexus Workspace
                        </p>

                        {/* <p className="mt-1 text-lg font-bold text-[#592f24]">
                          Sistem internal organisasi
                        </p> */}
                      </div>

                      <div className="flex size-11 items-center justify-center rounded-2xl bg-[#a51616] text-white shadow-md">
                        <ShieldCheck className="size-5" />
                      </div>
                    </div>

                    <div className="mt-4 space-y-3">
                      {features.map((feature) => {
                        const Icon = feature.icon;

                        return (
                          <div
                            key={feature.title}
                            className="flex items-start gap-4 rounded-2xl border border-[#ead9bd] bg-white/65 p-4 transition hover:-translate-y-0.5 hover:border-[#d9b878] hover:bg-white"
                          >
                            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#f6e5c8] text-[#a51616]">
                              <Icon className="size-4.5" />
                            </div>

                            <div>
                              <p className="text-sm font-bold text-[#4b3025]">
                                {feature.title}
                              </p>

                              <p className="mt-1 text-xs leading-5 text-[#7b6959]">
                                {feature.description}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
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