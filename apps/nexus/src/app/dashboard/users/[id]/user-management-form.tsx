"use client";

import {
  Ban,
  Link2,
  Loader2,
  Mail,
  Save,
  Shield,
  ShieldOff,
  UserRound,
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import {
  banUserAction,
  sendUserActivationLinkAction,
  unbanUserAction,
  updateUserMemberAction,
  updateUserRoleAction,
} from "./user-management-action";

type RoleOption = {
  value: string;
  label: string;
  description: string;
};

type MemberOption = {
  id: string;
  fullName: string;
  nim: string;
  birdepName: string | null;
};

export type UserManagementInitialData = {
  userId: string;
  role: string;
  memberId: string;
  banned: boolean;
  banReason: string;
  banExpires: string;
};

type UserManagementFormProps = {
  initialData: UserManagementInitialData;
  memberOptions: MemberOption[];
};

const ROLE_OPTIONS: RoleOption[] = [
  {
    value: "SUPER_ADMIN",
    label: "Super Admin",
    description: "Akses penuh seluruh sistem Nexus.",
  },
  {
    value: "TEVO_ADMIN",
    label: "Tevo Admin",
    description: "Mengelola konten publik Tevo.",
  },
  {
    value: "BPH",
    label: "BPH",
    description: "Akses pengawasan dan pengelolaan konten tertentu.",
  },
  {
    value: "KSATRIA",
    label: "Ksatria",
    description: "Mengelola konten birdep sendiri.",
  },
  {
    value: "LAKSANA",
    label: "Laksana",
    description: "Akses lihat konten yang disediakan.",
  },
  {
    value: "ANGGOTA_BIRDEP",
    label: "Anggota Birdep",
    description: "Role dasar anggota internal.",
  },
];

export function UserManagementForm({
  initialData,
  memberOptions,
}: UserManagementFormProps) {
  const router = useRouter();

  const [role, setRole] = useState(initialData.role);
  const [memberId, setMemberId] = useState(initialData.memberId);
  const [banReason, setBanReason] = useState(initialData.banReason);
  const [banExpires, setBanExpires] = useState(initialData.banExpires);

  const [roleSubmitting, setRoleSubmitting] = useState(false);
  const [memberSubmitting, setMemberSubmitting] = useState(false);
  const [banSubmitting, setBanSubmitting] = useState(false);
  const [activationSubmitting, setActivationSubmitting] = useState(false);

  async function handleUpdateRole(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setRoleSubmitting(true);

    const response = await updateUserRoleAction({
      userId: initialData.userId,
      role,
    });

    setRoleSubmitting(false);

    if (!response.success) {
      toast.error("Gagal update role", {
        description: response.message,
        duration: 2000,
      });
      return;
    }

    toast.success("Role berhasil diperbarui", {
      description: response.message,
      duration: 2000,
    });

    router.refresh();
  }

  async function handleUpdateMember(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMemberSubmitting(true);

    const response = await updateUserMemberAction({
      userId: initialData.userId,
      memberId,
    });

    setMemberSubmitting(false);

    if (!response.success) {
      toast.error("Gagal update link member", {
        description: response.message,
        duration: 2000,
      });
      return;
    }

    toast.success("Link member diperbarui", {
      description: response.message,
      duration: 2000,
    });

    router.refresh();
  }

  async function handleBan(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const confirmed = window.confirm(
      "Yakin ingin melakukan ban pada user ini?",
    );

    if (!confirmed) {
      return;
    }

    setBanSubmitting(true);

    const response = await banUserAction({
      userId: initialData.userId,
      banReason,
      banExpires,
    });

    setBanSubmitting(false);

    if (!response.success) {
      toast.error("Gagal ban user", {
        description: response.message,
        duration: 2000,
      });
      return;
    }

    toast.success("User berhasil diban", {
      description: response.message,
      duration: 2000,
    });

    router.refresh();
  }

  async function handleUnban() {
    const confirmed = window.confirm("Cabut ban user ini?");

    if (!confirmed) {
      return;
    }

    setBanSubmitting(true);

    const response = await unbanUserAction(initialData.userId);

    setBanSubmitting(false);

    if (!response.success) {
      toast.error("Gagal cabut ban", {
        description: response.message,
        duration: 2000,
      });
      return;
    }

    toast.success("Ban berhasil dicabut", {
      description: response.message,
      duration: 2000,
    });

    router.refresh();
  }

  async function handleSendActivationLink() {
    const confirmed = window.confirm(
      "Kirim link aktivasi/reset password ke email user ini?",
    );

    if (!confirmed) {
      return;
    }

    setActivationSubmitting(true);

    const response = await sendUserActivationLinkAction(initialData.userId);

    setActivationSubmitting(false);

    if (!response.success) {
      toast.error("Gagal kirim link", {
        description: response.message,
        duration: 2000,
      });
      return;
    }

    toast.success("Link berhasil dikirim", {
      description: response.message,
      duration: 2000,
    });

    router.refresh();
  }

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <section className="rounded-3xl border bg-card p-6 shadow-sm">
        <div className="mb-5 flex items-start gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Shield className="size-6" />
          </div>

          <div>
            <h2 className="font-black tracking-tight">Role Dasar User</h2>
            <p className="mt-1 text-sm leading-7 text-muted-foreground">
              Role ini masih role sederhana. Permission granular akan disiapkan
              pada stage berikutnya.
            </p>
          </div>
        </div>

        <form onSubmit={handleUpdateRole} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="role" className="text-sm font-semibold">
              Role
            </label>

            <select
              id="role"
              value={role}
              onChange={(event) => setRole(event.target.value)}
              className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            >
              {ROLE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="rounded-2xl bg-muted/50 p-4 text-sm leading-7 text-muted-foreground">
            {ROLE_OPTIONS.find((option) => option.value === role)?.description}
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={roleSubmitting}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {roleSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save className="size-4" />
                  Simpan Role
                </>
              )}
            </Button>
          </div>
        </form>
      </section>

      <section className="rounded-3xl border bg-card p-6 shadow-sm">
        <div className="mb-5 flex items-start gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <UserRound className="size-6" />
          </div>

          <div>
            <h2 className="font-black tracking-tight">Hubungkan ke Member</h2>
            <p className="mt-1 text-sm leading-7 text-muted-foreground">
              Hubungkan akun login dengan data anggota organisasi.
            </p>
          </div>
        </div>

        <form onSubmit={handleUpdateMember} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="memberId" className="text-sm font-semibold">
              Member
            </label>

            <select
              id="memberId"
              value={memberId}
              onChange={(event) => setMemberId(event.target.value)}
              className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Tidak dihubungkan</option>

              {memberOptions.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.fullName} — {member.nim}
                  {member.birdepName ? ` — ${member.birdepName}` : ""}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={memberSubmitting}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {memberSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Link2 className="size-4" />
                  Simpan Link Member
                </>
              )}
            </Button>
          </div>
        </form>
      </section>

      <section className="rounded-3xl border bg-card p-6 shadow-sm">
        <div className="mb-5 flex items-start gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-status-inactive-soft text-status-inactive">
            <Ban className="size-6" />
          </div>

          <div>
            <h2 className="font-black tracking-tight">Ban / Unban User</h2>
            <p className="mt-1 text-sm leading-7 text-muted-foreground">
              Gunakan ini untuk menonaktifkan akses login user bermasalah.
            </p>
          </div>
        </div>

        {initialData.banned ? (
          <div className="space-y-4">
            <div className="rounded-2xl border border-status-inactive/20 bg-status-inactive-soft p-4 text-sm leading-7 text-status-inactive">
              User ini sedang diban.
            </div>

            <Button
              type="button"
              disabled={banSubmitting}
              onClick={handleUnban}
              variant="outline"
              className="text-status-active hover:text-status-active"
            >
              {banSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Memproses...
                </>
              ) : (
                <>
                  <ShieldOff className="size-4" />
                  Cabut Ban
                </>
              )}
            </Button>
          </div>
        ) : (
          <form onSubmit={handleBan} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="banReason" className="text-sm font-semibold">
                Alasan Ban
              </label>

              <textarea
                id="banReason"
                value={banReason}
                onChange={(event) => setBanReason(event.target.value)}
                rows={3}
                placeholder="Contoh: Penyalahgunaan akses dashboard."
                className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="banExpires" className="text-sm font-semibold">
                Ban Sampai
              </label>

              <input
                id="banExpires"
                type="date"
                value={banExpires}
                onChange={(event) => setBanExpires(event.target.value)}
                className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              />

              <p className="text-xs leading-6 text-muted-foreground">
                Kosongkan jika ban tidak memiliki tanggal berakhir.
              </p>
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={banSubmitting}
                variant="outline"
                className="text-destructive hover:text-destructive"
              >
                {banSubmitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  <>
                    <Ban className="size-4" />
                    Ban User
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </section>

      <section className="rounded-3xl border bg-card p-6 shadow-sm">
        <div className="mb-5 flex items-start gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Mail className="size-6" />
          </div>

          <div>
            <h2 className="font-black tracking-tight">
              Link Aktivasi / Reset Password
            </h2>
            <p className="mt-1 text-sm leading-7 text-muted-foreground">
              Kirim ulang link untuk user yang belum aktivasi atau lupa
              password.
            </p>
          </div>
        </div>

        <Button
          type="button"
          disabled={activationSubmitting || initialData.banned}
          onClick={handleSendActivationLink}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {activationSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Mengirim...
            </>
          ) : (
            <>
              <Mail className="size-4" />
              Kirim Link Aktivasi
            </>
          )}
        </Button>

        {initialData.banned ? (
          <p className="mt-3 text-xs leading-6 text-muted-foreground">
            Link aktivasi tidak bisa dikirim selama user sedang diban.
          </p>
        ) : null}
      </section>
    </div>
  );
}