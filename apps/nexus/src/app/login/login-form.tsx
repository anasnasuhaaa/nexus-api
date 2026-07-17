"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  LogIn,
  Mail,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

type LoginStatus = "idle" | "error" | "success";

export function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<LoginStatus>("idle");
  const [isLoading, setIsLoading] = useState(false);

  function resetStatus() {
    if (status !== "idle") {
      setStatus("idle");
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setStatus("idle");
    setIsLoading(true);

    const { error } = await authClient.signIn.email({
      email,
      password,
    });

    setIsLoading(false);

    if (error) {
      setStatus("error");

      toast.error("Login gagal", {
        description:
          error.message || "Periksa kembali email dan password yang digunakan.",
        duration: 2000,
      });

      return;
    }

    setStatus("success");

    toast.success("Login berhasil", {
      description: "Selamat datang di Nexus.",
      duration: 2000,
    });

    router.replace("/dashboard");
    router.refresh();
  }

  const fieldStateClass =
    status === "error"
      ? "border-red-500 bg-[#FFF7E8] focus-within:border-red-500 focus-within:ring-4 focus-within:ring-red-500/10"
      : status === "success"
        ? "border-lime-500 bg-[#FFF7E8] focus-within:border-lime-500 focus-within:ring-4 focus-within:ring-lime-500/10"
        : "border-[#E4CFA9] bg-[#FFF7E8] hover:border-[#D4A85F] focus-within:border-[#B61D1D] focus-within:ring-4 focus-within:ring-[#B61D1D]/10";

  const iconStateClass =
    status === "error"
      ? "text-red-500"
      : status === "success"
        ? "text-lime-500"
        : "text-[#B1833F] group-focus-within:text-[#B61D1D]";

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-5 space-y-4 sm:mt-6"
    >
      <div className="space-y-1.5">
        <label
          htmlFor="email"
          className="block text-[11px] font-bold uppercase tracking-[0.14em] text-[#5C4635]"
        >
          Email
        </label>

        <div
          className={`group flex h-11 items-center rounded-full border px-4 shadow-sm transition duration-200 ${fieldStateClass}`}
        >
          <Mail
            aria-hidden="true"
            className={`mr-3 size-4.25 shrink-0 transition-colors ${iconStateClass}`}
          />

          <input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              resetStatus();
            }}
            disabled={isLoading}
            aria-invalid={status === "error"}
            className="h-full min-w-0 flex-1 bg-transparent text-sm text-[#34271F] outline-none placeholder:text-[#B9A993] disabled:cursor-not-allowed disabled:opacity-60"
            placeholder="Masukkan email"
            required
          />

          {status === "success" && (
            <CheckCircle2
              aria-hidden="true"
              className="ml-2 size-4.25 shrink-0 text-lime-500"
            />
          )}
        </div>
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor="password"
          className="block text-[11px] font-bold uppercase tracking-[0.14em] text-[#5C4635]"
        >
          Password
        </label>

        <div
          className={`group flex h-11 items-center rounded-full border px-4 shadow-sm transition duration-200 ${fieldStateClass}`}
        >
          <KeyRound
            aria-hidden="true"
            className={`mr-3 size-4.25 shrink-0 transition-colors ${iconStateClass}`}
          />

          <input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
              resetStatus();
            }}
            disabled={isLoading}
            aria-invalid={status === "error"}
            className="h-full min-w-0 flex-1 bg-transparent text-sm text-[#34271F] outline-none placeholder:text-[#B9A993] disabled:cursor-not-allowed disabled:opacity-60"
            placeholder="Masukkan password"
            required
          />

          <button
            type="button"
            onClick={() => setShowPassword((current) => !current)}
            disabled={isLoading}
            aria-label={
              showPassword ? "Sembunyikan password" : "Tampilkan password"
            }
            className="ml-2 flex size-8 shrink-0 items-center justify-center rounded-full text-[#A98B63] transition hover:bg-[#F3E4CA] hover:text-[#A51616] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B61D1D]/30 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {showPassword ? (
              <EyeOff className="size-4.25" />
            ) : (
              <Eye className="size-4.25" />
            )}
          </button>
        </div>

        {status === "error" && (
          <p role="alert" className="text-xs leading-5 text-red-600">
            Email atau password tidak sesuai. Silakan periksa kembali.
          </p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="h-11 w-full rounded-full bg-[#DFAE61] font-bold text-[#8E1717] shadow-[0_8px_20px_rgba(139,82,16,0.18)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#D39D4A] hover:text-[#7A1111] active:translate-y-0 disabled:translate-y-0 disabled:shadow-none"
      >
        {isLoading ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Memverifikasi akun...
          </>
        ) : status === "success" ? (
          <>
            <CheckCircle2 className="size-4" />
            Login berhasil
          </>
        ) : (
          <>
            <LogIn className="size-4" />
            Masuk ke Nexus
          </>
        )}
      </Button>
    </form>
  );
}