"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BookOpen,
  Contact,
  FileText,
  GalleryHorizontal,
  Home,
  Images,
  LayoutDashboard,
  LogOut,
  Menu,
  Newspaper,
  PanelTop,
  Settings,
  Shield,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/homepage", label: "Homepage", icon: Home },
  { href: "/admin/media", label: "Media Library", icon: Images },
  { href: "/admin/academics", label: "Academics", icon: BookOpen },
  { href: "/admin/website-settings", label: "Website Settings", icon: Settings },
  { href: "/admin/global-layout", label: "Header & Footer", icon: PanelTop },
  { href: "/admin/leadership", label: "Leadership", icon: Users },
  { href: "/admin/board-governors", label: "Board of Governors", icon: Shield },
  { href: "/admin/news", label: "News", icon: Newspaper },
  { href: "/admin/gallery", label: "Gallery", icon: GalleryHorizontal },
  { href: "/admin/admissions", label: "Admissions", icon: FileText },
  { href: "/admin/contact-settings", label: "Contact", icon: Contact },
];

export default function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  function isActive(href: string) {
    if (href === "/admin") {
      return pathname === "/admin";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  }

  async function handleLogout() {
    try {
      setLoggingOut(true);

      await fetch("/api/admin/logout", {
        method: "POST",
      });

      router.push("/admin/login");
      router.refresh();
    } finally {
      setLoggingOut(false);
    }
  }

  const sidebar = (
    <aside className="flex h-full min-h-0 flex-col bg-[#0b347e] text-white">

      <div className="shrink-0 border-b border-white/10 px-4 py-4">
        <div className="flex items-center gap-3">

          <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white p-1 shadow">
            <img
              src="/branding/school-badge.png"
              alt="St. Mary's Secondary School Manja badge"
              className="h-full w-full object-contain"
            />
          </div>

          <div className="min-w-0">
            <h1 className="text-lg font-extrabold leading-tight">
              St. Mary's CMS
            </h1>

            <p className="mt-1 text-[11px] text-blue-100">
              Single Administrator Portal
            </p>
          </div>

        </div>
      </div>

      <nav className="min-h-0 flex-1 overflow-y-auto px-3 py-3">
        <div className="space-y-1">

          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold transition ${
                  active
                    ? "bg-[#2453d4] text-white shadow"
                    : "text-blue-50 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />

                <span>
                  {item.label}
                </span>
              </Link>
            );
          })}

        </div>
      </nav>

      <div className="shrink-0 border-t border-white/10 bg-[#0b347e] p-3">

        <button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-extrabold text-white transition hover:bg-red-700 disabled:opacity-60"
        >
          <LogOut className="h-4 w-4" />

          {loggingOut ? "Logging out..." : "Log out"}
        </button>

      </div>

    </aside>
  );

  return (
    <div className="min-h-screen bg-slate-100">

      <div className="fixed inset-y-0 left-0 z-40 hidden w-[270px] md:block">
        {sidebar}
      </div>

      <div className="sticky top-0 z-40 flex items-center justify-between bg-[#0b347e] px-4 py-3 text-white shadow md:hidden">

        <div>
          <p className="font-extrabold">
            St. Mary's CMS
          </p>

          <p className="text-[11px] text-blue-100">
            Administrator Portal
          </p>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((current) => !current)}
          className="rounded-lg bg-white/10 p-2"
          aria-label="Toggle admin menu"
        >
          {mobileOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>

      </div>

      {mobileOpen && (
        <>
          <button
            type="button"
            aria-label="Close admin menu"
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 z-40 bg-black/40 md:hidden"
          />

          <div className="fixed inset-y-0 left-0 z-50 w-[285px] md:hidden">
            {sidebar}
          </div>
        </>
      )}

      <main className="min-w-0 md:ml-[270px]">
        {children}
      </main>

    </div>
  );
}
