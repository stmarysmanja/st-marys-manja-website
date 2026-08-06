"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  CalendarDays,
  ChevronDown,
  Images,
  Mail,
  Menu,
  Newspaper,
  Phone,
  X,
} from "lucide-react";
import { useState } from "react";

interface PublicHeaderProps {
  schoolName: string;
  phone: string;
  email: string;
}

const aboutLinks = [
  { label: "About Our School", href: "/about" },
  { label: "Mission, Vision & Motto", href: "/about#mission" },
  { label: "Leadership", href: "/#leadership" },
  { label: "Board of Governors", href: "/about#governance" },
  { label: "School Anthem", href: "/about#anthem" },
];

const academicsLinks = [
  { label: "Academics Overview", href: "/academics" },
  { label: "O-Level Programme", href: "/academics#o-level" },
  { label: "A-Level Programme", href: "/academics#a-level" },
  { label: "Departments", href: "/academics#departments" },
  { label: "Subjects Offered", href: "/academics#subjects" },
  { label: "Academic Performance", href: "/academics#performance" },
];

const studentLifeLinks = [
  { label: "Academic Life", href: "/academics#co-curricular" },
  { label: "Clubs & Societies", href: "/academics#co-curricular" },
  { label: "Sports", href: "/academics#co-curricular" },
  { label: "Music, Dance & Drama", href: "/academics#co-curricular" },
  { label: "Agriculture", href: "/academics#co-curricular" },
  { label: "School Calendar", href: "/academics#calendar" },
];

const mediaLinks = [
  { label: "Latest News", href: "/news", icon: Newspaper },
  { label: "Photo Gallery", href: "/gallery", icon: Images },
  { label: "School Calendar", href: "/academics#calendar", icon: CalendarDays },
];

export default function PublicHeader({
  schoolName,
  phone,
  email,
}: PublicHeaderProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSection, setMobileSection] = useState<string | null>(null);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  function closeMobile() {
    setMobileOpen(false);
    setMobileSection(null);
  }

  return (
    <header className="sticky top-0 z-50">
      <div className="hidden bg-[#08296f] text-white lg:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 text-xs">
          <div className="flex items-center gap-5">
            <a
              href={`mailto:${email}`}
              className="flex items-center gap-2 transition hover:text-blue-200"
            >
              <Mail className="h-3.5 w-3.5" />
              {email}
            </a>

            <a
              href={`tel:${phone.replace(/\s+/g, "")}`}
              className="flex items-center gap-2 transition hover:text-blue-200"
            >
              <Phone className="h-3.5 w-3.5" />
              {phone}
            </a>
          </div>

          <Link
            href="/admissions"
            className="rounded-md bg-white px-4 py-2 font-extrabold text-[#08296f] transition hover:bg-blue-100"
          >
            Online Admissions
          </Link>
        </div>
      </div>

      <nav className="border-b border-blue-100 bg-white shadow-lg">
        <div className="mx-auto flex h-24 max-w-7xl items-center justify-between px-4">
          <Link
            href="/"
            onClick={closeMobile}
            className="group flex min-w-0 items-center gap-4"
          >
            <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-blue-100">
              <Image
                src="/branding/school-badge.png"
                alt="St. Mary's Secondary School Manja badge"
                fill
                priority
                sizes="64px"
                className="object-contain p-1"
              />
            </div>

            <div className="min-w-0">
              <p className="truncate text-lg font-black uppercase text-[#08296f] md:text-xl">
                {schoolName}
              </p>
              <p className="mt-1 text-[10px] font-extrabold uppercase tracking-[0.22em] text-[#2453d4]">
                Manja
              </p>
            </div>
          </Link>

          <div className="hidden items-center gap-1 lg:flex">
            <NavLink href="/" active={isActive("/")}>
              Home
            </NavLink>

            <MegaMenu label="About" active={isActive("/about")}>
              <MenuPanel
                title="Discover St. Mary's"
                subtitle="Our identity, history, values and leadership."
                icon={<BadgeMini />}
                links={aboutLinks}
              />
            </MegaMenu>

            <MegaMenu label="Academics" active={isActive("/academics")}>
              <MenuPanel
                title="Academic Programmes"
                subtitle="Quality O-Level and A-Level education."
                icon={<BookOpen className="h-6 w-6" />}
                links={academicsLinks}
              />
            </MegaMenu>

            <MegaMenu label="Student Life" active={false}>
              <MenuPanel
                title="Life Beyond the Classroom"
                subtitle="Talent, leadership and holistic development."
                icon={<CalendarDays className="h-6 w-6" />}
                links={studentLifeLinks}
              />
            </MegaMenu>

            <MegaMenu
              label="Media"
              active={isActive("/news") || isActive("/gallery")}
            >
              <div className="grid w-[500px] grid-cols-3 gap-3 rounded-3xl border border-blue-100 bg-white p-5 shadow-2xl">
                {mediaLinks.map((item) => {
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="rounded-2xl border border-slate-100 p-5 text-center transition hover:-translate-y-1 hover:border-blue-200 hover:bg-blue-50"
                    >
                      <Icon className="mx-auto h-7 w-7 text-[#2453d4]" />
                      <p className="mt-3 text-sm font-extrabold text-[#08296f]">
                        {item.label}
                      </p>
                    </Link>
                  );
                })}
              </div>
            </MegaMenu>

            <NavLink href="/admissions" active={isActive("/admissions")}>
              Admissions
            </NavLink>

            <NavLink href="/contact" active={isActive("/contact")}>
              Contact
            </NavLink>
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen((value) => !value)}
            className="rounded-xl bg-[#08296f] p-3 text-white lg:hidden"
            aria-label="Toggle navigation"
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>

        {mobileOpen && (
          <div className="border-t border-blue-100 bg-white px-4 pb-6 pt-3 shadow-xl lg:hidden">
            <MobileLink href="/" onClick={closeMobile}>
              Home
            </MobileLink>

            <MobileGroup
              label="About"
              open={mobileSection === "about"}
              onClick={() =>
                setMobileSection(
                  mobileSection === "about" ? null : "about"
                )
              }
              links={aboutLinks}
              close={closeMobile}
            />

            <MobileGroup
              label="Academics"
              open={mobileSection === "academics"}
              onClick={() =>
                setMobileSection(
                  mobileSection === "academics" ? null : "academics"
                )
              }
              links={academicsLinks}
              close={closeMobile}
            />

            <MobileGroup
              label="Student Life"
              open={mobileSection === "student-life"}
              onClick={() =>
                setMobileSection(
                  mobileSection === "student-life" ? null : "student-life"
                )
              }
              links={studentLifeLinks}
              close={closeMobile}
            />

            <MobileGroup
              label="Media"
              open={mobileSection === "media"}
              onClick={() =>
                setMobileSection(
                  mobileSection === "media" ? null : "media"
                )
              }
              links={mediaLinks.map(({ label, href }) => ({
                label,
                href,
              }))}
              close={closeMobile}
            />

            <MobileLink href="/admissions" onClick={closeMobile}>
              Admissions
            </MobileLink>

            <MobileLink href="/contact" onClick={closeMobile}>
              Contact
            </MobileLink>
          </div>
        )}
      </nav>
    </header>
  );
}

function BadgeMini() {
  return (
    <div className="relative h-9 w-8 overflow-hidden rounded-md bg-white">
      <Image
        src="/branding/school-badge.png"
        alt=""
        fill
        sizes="32px"
        className="object-contain"
      />
    </div>
  );
}

function NavLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`rounded-xl px-3 py-3 text-sm font-bold transition ${
        active
          ? "bg-blue-50 text-[#2453d4]"
          : "text-slate-700 hover:bg-blue-50 hover:text-[#2453d4]"
      }`}
    >
      {children}
    </Link>
  );
}

function MegaMenu({
  label,
  active,
  children,
}: {
  label: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="group relative">
      <button
        type="button"
        className={`flex items-center gap-1 rounded-xl px-3 py-3 text-sm font-bold transition ${
          active
            ? "bg-blue-50 text-[#2453d4]"
            : "text-slate-700 group-hover:bg-blue-50 group-hover:text-[#2453d4]"
        }`}
      >
        {label}
        <ChevronDown className="h-4 w-4 transition group-hover:rotate-180" />
      </button>

      <div className="invisible absolute left-1/2 top-full -translate-x-1/2 translate-y-3 pt-3 opacity-0 transition duration-300 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
        {children}
      </div>
    </div>
  );
}

function MenuPanel({
  title,
  subtitle,
  icon,
  links,
}: {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  links: { label: string; href: string }[];
}) {
  return (
    <div className="w-[620px] overflow-hidden rounded-3xl border border-blue-100 bg-white shadow-2xl">
      <div className="flex items-center gap-4 bg-gradient-to-r from-[#08296f] to-[#2453d4] p-6 text-white">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#08296f]">
          {icon}
        </div>

        <div>
          <h3 className="font-extrabold">{title}</h3>
          <p className="mt-1 text-xs text-blue-100">{subtitle}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 p-4">
        {links.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="rounded-xl px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-blue-50 hover:text-[#2453d4]"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

function MobileLink({
  href,
  onClick,
  children,
}: {
  href: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="block rounded-xl px-4 py-3 font-bold text-slate-700 hover:bg-blue-50 hover:text-[#2453d4]"
    >
      {children}
    </Link>
  );
}

function MobileGroup({
  label,
  open,
  onClick,
  links,
  close,
}: {
  label: string;
  open: boolean;
  onClick: () => void;
  links: { label: string; href: string }[];
  close: () => void;
}) {
  return (
    <div>
      <button
        type="button"
        onClick={onClick}
        className="flex w-full items-center justify-between rounded-xl px-4 py-3 font-bold text-slate-700 hover:bg-blue-50"
      >
        {label}
        <ChevronDown
          className={`h-4 w-4 transition ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="ml-3 border-l-2 border-blue-100 pl-3">
          {links.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={close}
              className="block rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-blue-50 hover:text-[#2453d4]"
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
