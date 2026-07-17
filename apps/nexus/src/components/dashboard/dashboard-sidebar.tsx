"use client";

import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  ChevronDown,
  FileText,
  Home,
  ImageIcon,
  Landmark,
  LayoutDashboard,
  MailCheck,
  Newspaper,
  PlusCircle,
  ShieldCheck,
  Sparkles,
  Settings,
  Table2,
  Upload,
  UserCircle,
  UserCog,
  UsersRound,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { LogoutButton } from "@/components/dashboard/logout-button";
import { cn } from "@/lib/utils";

type DashboardSubMenu = {
  title: string;
  href: string;
  icon: LucideIcon;
};

type DashboardMenu = {
  title: string;
  href: string;
  icon: LucideIcon;
  children?: DashboardSubMenu[];
};

const dashboardMenus: DashboardMenu[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
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
    children: [
      {
        title: "Tabel Program",
        href: "/dashboard/programs",
        icon: Table2,
      },
      {
        title: "Tambah Program",
        href: "/dashboard/programs/new",
        icon: PlusCircle,
      },
      {
        title: "Import XLSX",
        href: "/dashboard/programs/import",
        icon: Upload,
      },
    ],
  },
  {
    title: "Progress",
    href: "/dashboard/progress",
    icon: BarChart3,
    children: [
      {
        title: "Tabel Progress",
        href: "/dashboard/progress",
        icon: Table2,
      },
      {
        title: "Tambah Progress",
        href: "/dashboard/progress/new",
        icon: PlusCircle,
      },
      {
        title: "Import XLSX",
        href: "/dashboard/progress/import",
        icon: Upload,
      },
    ],
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
    children: [
      {
        title: "Overview",
        href: "/dashboard/tevo",
        icon: LayoutDashboard,
      },
      {
        title: "Program Kerja",
        href: "/dashboard/tevo/programs",
        icon: FileText,
      },
      {
        title: "Visi Misi",
        href: "/dashboard/tevo/vision-mission",
        icon: Sparkles,
      },
      {
        title: "Struktur Organisasi",
        href: "/dashboard/tevo/organization-structure",
        icon: Landmark,
      },
      {
        title: "Anggota Birdep",
        href: "/dashboard/tevo/members",
        icon: UsersRound,
      },
      {
        title: "CMS / Berita",
        href: "/dashboard/tevo/news",
        icon: Newspaper,
      },
      {
        title: "Pengaturan Tevo",
        href: "/dashboard/tevo/settings",
        icon: Settings,
      },
    ],
  },
  {
    title: "Data Anggota",
    href: "/dashboard/members",
    icon: UsersRound,
    children: [
      {
        title: "Tabel Anggota",
        href: "/dashboard/members",
        icon: Table2,
      },
      {
        title: "Import XLSX",
        href: "/dashboard/members/import",
        icon: Upload,
      },
    ],
  },
  {
    title: "Akun & Akses",
    href: "/dashboard/users",
    icon: UserCog,
    children: [
      {
        title: "Daftar Akun",
        href: "/dashboard/users",
        icon: Table2,
      },
      {
        title: "Aktivasi Akun",
        href: "/dashboard/users/activation",
        icon: MailCheck,
      },
    ],
  },
];

function isNestedPath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function isDashboardSubMenuActive(pathname: string, href: string) {
  if (href === "/dashboard") {
    return pathname === "/dashboard";
  }

  /**
   * Akun & Akses
   *
   * /dashboard/users             => Daftar Akun active
   * /dashboard/users/[id]        => Daftar Akun active
   * /dashboard/users/activation  => Aktivasi Akun active only
   */
  if (href === "/dashboard/users") {
    return (
      pathname === "/dashboard/users" ||
      (pathname.startsWith("/dashboard/users/") &&
        !pathname.startsWith("/dashboard/users/activation"))
    );
  }

  if (href === "/dashboard/users/activation") {
    return isNestedPath(pathname, "/dashboard/users/activation");
  }

  /**
   * Data Anggota
   *
   * /dashboard/members             => Tabel Anggota active
   * /dashboard/members/[id]        => Tabel Anggota active
   * /dashboard/members/[id]/edit   => Tabel Anggota active
   * /dashboard/members/import      => Import XLSX active only
   */
  if (href === "/dashboard/members") {
    return (
      pathname === "/dashboard/members" ||
      (pathname.startsWith("/dashboard/members/") &&
        !pathname.startsWith("/dashboard/members/import"))
    );
  }

  if (href === "/dashboard/members/import") {
    return isNestedPath(pathname, "/dashboard/members/import");
  }

  /**
   * Program Kerja
   *
   * /dashboard/programs            => Tabel Program active
   * /dashboard/programs/[id]       => Tabel Program active
   * /dashboard/programs/new        => Tambah Program active only
   * /dashboard/programs/import     => Import XLSX active only
   */
  if (href === "/dashboard/programs") {
    return (
      pathname === "/dashboard/programs" ||
      (pathname.startsWith("/dashboard/programs/") &&
        !pathname.startsWith("/dashboard/programs/new") &&
        !pathname.startsWith("/dashboard/programs/import"))
    );
  }

  if (href === "/dashboard/programs/new") {
    return isNestedPath(pathname, "/dashboard/programs/new");
  }

  if (href === "/dashboard/programs/import") {
    return isNestedPath(pathname, "/dashboard/programs/import");
  }

  /**
   * Progress
   *
   * /dashboard/progress            => Tabel Progress active
   * /dashboard/progress/[id]       => Tabel Progress active
   * /dashboard/progress/new        => Tambah Progress active only
   * /dashboard/progress/import     => Import XLSX active only
   */
  if (href === "/dashboard/progress") {
    return (
      pathname === "/dashboard/progress" ||
      (pathname.startsWith("/dashboard/progress/") &&
        !pathname.startsWith("/dashboard/progress/new") &&
        !pathname.startsWith("/dashboard/progress/import"))
    );
  }

  if (href === "/dashboard/progress/new") {
    return isNestedPath(pathname, "/dashboard/progress/new");
  }

  if (href === "/dashboard/progress/import") {
    return isNestedPath(pathname, "/dashboard/progress/import");
  }

  /**
   * Konten Tevo
   *
   * /dashboard/tevo                => Overview active only
   * /dashboard/tevo/programs       => Program Kerja active
   * /dashboard/tevo/news           => CMS / Berita active
   */
  if (href === "/dashboard/tevo") {
    return pathname === "/dashboard/tevo";
  }

  return isNestedPath(pathname, href);
}

function isDashboardMenuActive(pathname: string, menu: DashboardMenu) {
  if (menu.href === "/dashboard") {
    return pathname === "/dashboard";
  }

  if (menu.children?.length) {
    return menu.children.some((child) =>
      isDashboardSubMenuActive(pathname, child.href),
    );
  }

  return isNestedPath(pathname, menu.href);
}

export function DashboardSidebar() {
  const pathname = usePathname();

  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>(
    {},
  );

  function toggleMenu(href: string, defaultExpanded: boolean) {
    setExpandedMenus((current) => {
      const currentExpanded = current[href] ?? defaultExpanded;

      return {
        ...current,
        [href]: !currentExpanded,
      };
    });
  }

  return (
    <aside className="sticky top-0 hidden h-screen w-72 shrink-0 border-r bg-sidebar text-sidebar-foreground lg:flex lg:flex-col">
      <div className="flex h-16 shrink-0 items-center gap-3 border-b px-5">
        <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <ShieldCheck className="size-5" />
        </div>

        <div>
          <p className="font-black leading-none">Nexus</p>
          <p className="mt-1 text-xs text-muted-foreground">Astana Angkasa</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {dashboardMenus.map((menu) => {
          const Icon = menu.icon;
          const hasChildren = Boolean(menu.children?.length);
          const active = isDashboardMenuActive(pathname, menu);
          const expanded = expandedMenus[menu.href] ?? active;

          if (!hasChildren) {
            return (
              <Link
                key={menu.href}
                href={menu.href}
                className={cn(
                  "flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition",
                  active
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                )}
              >
                <Icon className="size-4" />
                {menu.title}
              </Link>
            );
          }

          return (
            <div key={menu.href} className="space-y-1">
              <button
                type="button"
                onClick={() => toggleMenu(menu.href, active)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left text-sm font-medium transition",
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                )}
              >
                <Icon className="size-4" />

                <span className="flex-1">{menu.title}</span>

                <ChevronDown
                  className={cn(
                    "size-4 transition-transform",
                    expanded ? "rotate-180" : "rotate-0",
                  )}
                />
              </button>

              {expanded ? (
                <div className="ml-4 space-y-1 border-l border-border pl-3">
                  {menu.children?.map((child) => {
                    const ChildIcon = child.icon;
                    const childActive = isDashboardSubMenuActive(
                      pathname,
                      child.href,
                    );

                    return (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={cn(
                          "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition",
                          childActive
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                        )}
                      >
                        <ChildIcon className="size-4" />
                        {child.title}
                      </Link>
                    );
                  })}
                </div>
              ) : null}
            </div>
          );
        })}
      </nav>

      <div className="shrink-0 border-t p-3">
        <Link
          href="/dashboard/profile"
          className={cn(
            "mb-2 flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition",
            pathname === "/dashboard/profile"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:bg-muted hover:text-foreground",
          )}
        >
          <UserCircle className="size-4" />
          Profil Saya
        </Link>

        <Link
          href="/"
          className="mb-2 flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
        >
          <Home className="size-4" />
          Halaman Awal
        </Link>

        <LogoutButton />
      </div>
    </aside>
  );
}