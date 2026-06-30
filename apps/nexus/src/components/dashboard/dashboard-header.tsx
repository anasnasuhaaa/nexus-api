import Link from "next/link";
import {
  BarChart3,
  FileText,
  Home,
  ImageIcon,
  Landmark,
  LayoutDashboard,
  Menu,
  Newspaper,
  ShieldCheck,
  UsersRound,
} from "lucide-react";

import { LogoutButton } from "@/components/dashboard/logout-button";
import { ModeToggle } from "@/components/theme/mode-toggle";
import { Button } from "@/components/ui/button";

type DashboardHeaderProps = {
  user: {
    name: string;
    email: string;
    role: string;
  };
};

const mobileMenus = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Data Anggota",
    href: "/dashboard/members",
    icon: UsersRound,
  },
  {
    title: "Birdep",
    href: "/dashboard/birdep",
    icon: Landmark,
  },
  {
    title: "Program Kerja",
    href: "/dashboard/programs",
    icon: FileText,
  },
  {
    title: "Progress",
    href: "/dashboard/progress",
    icon: BarChart3,
  },
  {
    title: "Media",
    href: "/dashboard/media",
    icon: ImageIcon,
  },
  {
    title: "Konten Tevo",
    href: "/dashboard/tevo",
    icon: Newspaper,
  },
];

export function DashboardHeader({ user }: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur">
      <div className="flex h-16 items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground lg:hidden">
            <ShieldCheck className="size-5" />
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-bold leading-none sm:text-base">
              Halo, {user.name}
            </p>
            <p className="mt-1 truncate text-xs text-muted-foreground">
              {user.email} · {user.role}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ModeToggle />

          <details className="relative lg:hidden">
            <summary className="list-none">
              <Button variant="outline" size="icon" aria-label="Buka menu">
                <Menu className="size-4" />
              </Button>
            </summary>

            <div className="absolute right-0 mt-3 w-72 rounded-3xl border bg-card p-3 shadow-xl">
              <nav className="space-y-1">
                {mobileMenus.map((menu) => {
                  const Icon = menu.icon;

                  return (
                    <Link
                      key={menu.href}
                      href={menu.href}
                      className="flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition hover:bg-primary/10 hover:text-primary"
                    >
                      <Icon className="size-4" />
                      {menu.title}
                    </Link>
                  );
                })}

                <Link
                  href="/"
                  className="flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
                >
                  <Home className="size-4" />
                  Halaman Awal
                </Link>

                <div className="pt-2">
                  <LogoutButton />
                </div>
              </nav>
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}