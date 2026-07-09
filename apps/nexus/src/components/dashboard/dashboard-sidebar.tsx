"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
  UsersRound,
} from "lucide-react";
import { useState } from "react";
import type { LucideIcon } from "lucide-react";

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
      {
        title: "Aktivasi & Log Email",
        href: "/dashboard/members/activation",
        icon: MailCheck,
      },
    ],
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
];

const exactOnlySubmenuHrefs = [
  "/dashboard/members",
  "/dashboard/programs",
  "/dashboard/progress",
  "/dashboard/tevo",
];

function isActivePath(pathname: string, href: string) {
  if (href === "/dashboard") {
    return pathname === "/dashboard";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

function isExactOrNestedPath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function isActiveSubmenuPath(pathname: string, href: string) {
  if (exactOnlySubmenuHrefs.includes(href)) {
    return pathname === href;
  }

  return isExactOrNestedPath(pathname, href);
}

export function DashboardSidebar() {
  const pathname = usePathname();

  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>(
    {},
  );

  function toggleMenu(href: string) {
    setExpandedMenus((current) => ({
      ...current,
      [href]: !current[href],
    }));
  }

  return (
    <aside className="sticky top-0 hidden h-screen w-72 shrink-0 border-r bg-sidebar text-sidebar-foreground lg:flex lg:flex-col">
      <div className="flex h-16 shrink-0 items-center gap-3 border-b px-5">
        <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <ShieldCheck className="size-5" />
        </div>

        <div>
          <p className="font-black leading-none">Nexus</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Astana Angkasa
          </p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {dashboardMenus.map((menu) => {
          const Icon = menu.icon;
          const hasChildren = Boolean(menu.children?.length);
          const active = isActivePath(pathname, menu.href);
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
                onClick={() => toggleMenu(menu.href)}
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
                    const childActive = isActiveSubmenuPath(
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
          className="mb-2 flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
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