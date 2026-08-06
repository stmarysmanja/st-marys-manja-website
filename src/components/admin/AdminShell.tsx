"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useState } from "react";

const navigation = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/homepage", label: "Homepage" },
  { href: "/admin/media", label: "Media Library" },
  { href: "/admin/academics", label: "Academics" },
  { href: "/admin/website-settings", label: "Website Settings" },
  { href: "/admin/leadership", label: "Leadership" },
  { href: "/admin/news", label: "News" },
  { href: "/admin/gallery", label: "Gallery" },
  { href: "/admin/admissions", label: "Admissions" },
  { href: "/admin/contact-settings", label: "Contact" },
];

export default function AdminShell({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  if (pathname === "/admin/login") {
    return children;
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between bg-[#08296f] px-4 text-white shadow-lg lg:hidden">
        <span className="font-extrabold">St. Mary&apos;s CMS</span>

        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          className="rounded-lg bg-white/10 px-4 py-2 text-sm font-bold"
        >
          Menu
        </button>
      </header>

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#08296f] text-white shadow-2xl transition-transform duration-300 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="border-b border-white/10 px-6 py-6">
          <div className="relative h-28 w-24 overflow-hidden rounded-2xl bg-white shadow-lg">
            <Image
              src="/branding/school-badge.png"
              alt="School badge"
              fill
              sizes="96px"
              className="object-contain p-2"
            />
          </div>

          <h2 className="mt-4 text-xl font-extrabold">
            St. Mary&apos;s CMS
          </h2>

          <p className="mt-1 text-xs text-blue-200">
            Single Administrator Portal
          </p>
        </div>

        <nav className="space-y-1 px-4 py-5">
          {navigation.map((item) => {
            const active =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`block rounded-xl px-4 py-3 text-sm font-bold transition ${
                  active
                    ? "bg-white text-[#08296f] shadow"
                    : "text-blue-100 hover:bg-white/10 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 border-t border-white/10 p-4">
          <button
            type="button"
            onClick={logout}
            className="w-full rounded-xl bg-red-600 px-4 py-3 text-sm font-extrabold text-white transition hover:bg-red-700"
          >
            Log out
          </button>
        </div>
      </aside>

      {open && (
        <button
          aria-label="Close menu"
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <div className="lg:pl-72">
        <main className="min-h-screen">{children}</main>
      </div>
    </div>
  );
}
