"use client";

import { Eye, EyeOff, Loader2, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import { changeOwnPasswordAction } from "./change-password-action";

export function ChangePasswordForm() {
  const router = useRouter();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsSubmitting(true);

    const response = await changeOwnPasswordAction(
      currentPassword,
      newPassword,
      confirmPassword,
    );

    setIsSubmitting(false);

    if (!response.success) {
      toast.error("Gagal mengganti password", {
        description: response.message,
        duration: 2000,
      });
      return;
    }

    toast.success("Password berhasil diperbarui", {
      description: response.message,
      duration: 2000,
    });

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");

    router.replace("/dashboard/profile");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <PasswordInput
        id="currentPassword"
        label="Password lama"
        value={currentPassword}
        onChange={setCurrentPassword}
        showPassword={showPassword}
        placeholder="Masukkan password lama"
      />

      <PasswordInput
        id="newPassword"
        label="Password baru"
        value={newPassword}
        onChange={setNewPassword}
        showPassword={showPassword}
        placeholder="Minimal 8 karakter"
      />

      <PasswordInput
        id="confirmPassword"
        label="Konfirmasi password baru"
        value={confirmPassword}
        onChange={setConfirmPassword}
        showPassword={showPassword}
        placeholder="Ulangi password baru"
      />

      <button
        type="button"
        onClick={() => setShowPassword((value) => !value)}
        className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:underline"
      >
        {showPassword ? (
          <EyeOff className="size-4" />
        ) : (
          <Eye className="size-4" />
        )}
        {showPassword ? "Sembunyikan password" : "Tampilkan password"}
      </button>

      <div className="rounded-2xl border bg-muted/30 p-4 text-xs leading-6 text-muted-foreground">
        Setelah password berhasil diganti, sistem akan menandai akun sebagai
        sudah selesai setup password.
      </div>

      <Button
        type="submit"
        disabled={
          isSubmitting ||
          currentPassword.length === 0 ||
          newPassword.length < 8 ||
          newPassword !== confirmPassword
        }
        className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Menyimpan...
          </>
        ) : (
          <>
            <Save className="size-4" />
            Simpan Password Baru
          </>
        )}
      </Button>
    </form>
  );
}

type PasswordInputProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  showPassword: boolean;
  placeholder: string;
};

function PasswordInput({
  id,
  label,
  value,
  onChange,
  showPassword,
  placeholder,
}: PasswordInputProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm font-semibold">
        {label}
      </label>

      <input
        id={id}
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
      />
    </div>
  );
}