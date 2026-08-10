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

export interface PublicNavItem {
  label: string;
  href: string;
}

interface PublicHeaderProps {
  schoolName: string;
  phone: string;
  email: string;

  badgeUrl: string;
  badgeAlt: string;
  headerLocationLabel: string;

  homeLabel: string;
  aboutLabel: string;
  academicsLabel: string;
  studentLifeLabel: string;
  mediaLabel: string;
  admissionsLabel: string;
  contactLabel: string;

  topAdmissionsText: string;
  topAdmissionsLink: string;

  aboutMenuTitle: string;
  aboutMenuSubtitle: string;
  aboutLinks: PublicNavItem[];

  academicsMenuTitle: string;
  academicsMenuSubtitle: string;
  academicsLinks: PublicNavItem[];

  studentLifeMenuTitle: string;
  studentLifeMenuSubtitle: string;
  studentLifeLinks: PublicNavItem[];

  mediaLinks: PublicNavItem[];
}

export default function PublicHeader({
  schoolName,
  phone,
  email,

  badgeUrl,
  badgeAlt,
  headerLocationLabel,

  homeLabel,
  aboutLabel,
  academicsLabel,
  studentLifeLabel,
  mediaLabel,
  admissionsLabel,
  contactLabel,

  topAdmissionsText,
  topAdmissionsLink,

  aboutMenuTitle,
  aboutMenuSubtitle,
  aboutLinks,

  academicsMenuTitle,
  academicsMenuSubtitle,
  academicsLinks,

  studentLifeMenuTitle,
  studentLifeMenuSubtitle,
  studentLifeLinks,

  mediaLinks,
}: PublicHeaderProps) {
  const pathname = usePathname();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSection, setMobileSection] =
    useState<string | null>(null);

  const isActive = (href: string) =>
    href === "/"
      ? pathname === "/"
      : pathname.startsWith(href);

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
            href={topAdmissionsLink}
            className="rounded-md bg-white px-4 py-2 font-extrabold text-[#08296f] transition hover:bg-blue-100"
          >
            {topAdmissionsText}
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
                src={badgeUrl}
                alt={badgeAlt}
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
                {headerLocationLabel}
              </p>
            </div>
          </Link>

          <div className="hidden items-center gap-1 lg:flex">
            <NavLink href="/" active={isActive("/")}>
              {homeLabel}
            </NavLink>

            <MegaMenu
              label={aboutLabel}
              active={isActive("/about")}
            >
              <MenuPanel
                title={aboutMenuTitle}
                subtitle={aboutMenuSubtitle}
                icon={<BadgeMini badgeUrl={badgeUrl} />}
                links={aboutLinks}
              />
            </MegaMenu>

            <MegaMenu
              label={academicsLabel}
              active={isActive("/academics")}
            >
              <MenuPanel
                title={academicsMenuTitle}
                subtitle={academicsMenuSubtitle}
                icon={<BookOpen className="h-6 w-6" />}
                links={academicsLinks}
              />
            </MegaMenu>

            <MegaMenu
              label={studentLifeLabel}
              active={false}
            >
              <MenuPanel
                title={studentLifeMenuTitle}
                subtitle={studentLifeMenuSubtitle}
                icon={<CalendarDays className="h-6 w-6" />}
                links={studentLifeLinks}
              />
            </MegaMenu>

            <MegaMenu
              label={mediaLabel}
              active={
                isActive("/news") ||
                isActive("/gallery")
              }
            >
              <div className="grid w-[500px] grid-cols-3 gap-3 rounded-3xl border border-blue-100 bg-white p-5 shadow-2xl">
                {mediaLinks.map((item, index) => {
                  const Icon =
                    index === 0
                      ? Newspaper
                      : index === 1
                        ? Images
                        : CalendarDays;

                  return (
                    <Link
                      key={`${item.href}-${item.label}`}
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

            <NavLink
              href="/admissions"
              active={isActive("/admissions")}
            >
              {admissionsLabel}
            </NavLink>

            <NavLink
              href="/contact"
              active={isActive("/contact")}
            >
              {contactLabel}
            </NavLink>
          </div>

          <button
            type="button"
            onClick={() =>
              setMobileOpen((value) => !value)
            }
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
              {homeLabel}
            </MobileLink>

            <MobileGroup
              label={aboutLabel}
              open={mobileSection === "about"}
              onClick={() =>
                setMobileSection(
                  mobileSection === "about"
                    ? null
                    : "about"
                )
              }
              links={aboutLinks}
              close={closeMobile}
            />

            <MobileGroup
              label={academicsLabel}
              open={mobileSection === "academics"}
              onClick={() =>
                setMobileSection(
                  mobileSection === "academics"
                    ? null
                    : "academics"
                )
              }
              links={academicsLinks}
              close={closeMobile}
            />

            <MobileGroup
              label={studentLifeLabel}
              open={mobileSection === "student-life"}
              onClick={() =>
                setMobileSection(
                  mobileSection === "student-life"
                    ? null
                    : "student-life"
                )
              }
              links={studentLifeLinks}
              close={closeMobile}
            />

            <MobileGroup
              label={mediaLabel}
              open={mobileSection === "media"}
              onClick={() =>
                setMobileSection(
                  mobileSection === "media"
                    ? null
                    : "media"
                )
              }
              links={mediaLinks}
              close={closeMobile}
            />

            <MobileLink
              href="/admissions"
              onClick={closeMobile}
            >
              {admissionsLabel}
            </MobileLink>

            <MobileLink
              href="/contact"
              onClick={closeMobile}
            >
              {contactLabel}
            </MobileLink>
          </div>
        )}
      </nav>
    </header>
  );
}

function BadgeMini({
  badgeUrl,
}: {
  badgeUrl: string;
}) {
  return (
    <div className="relative h-9 w-8 overflow-hidden rounded-md bg-white">
      <Image
        src={badgeUrl}
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
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className={`flex items-center gap-1 rounded-xl px-3 py-3 text-sm font-bold transition ${
          active || open
            ? "bg-blue-50 text-[#2453d4]"
            : "text-slate-700 hover:bg-blue-50 hover:text-[#2453d4]"
        }`}
      >
        {label}

        <ChevronDown
          className={`h-4 w-4 transition duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      <div
        className={`absolute left-1/2 top-full z-[100] -translate-x-1/2 pt-3 transition duration-200 ${
          open
            ? "visible translate-y-0 opacity-100"
            : "invisible translate-y-2 opacity-0"
        }`}
      >
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
  links: PublicNavItem[];
}) {
  return (
    <div className="w-[620px] overflow-hidden rounded-3xl border border-blue-100 bg-white shadow-2xl">
      <div className="flex items-center gap-4 bg-gradient-to-r from-[#08296f] to-[#2453d4] p-6 text-white">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#08296f]">
          {icon}
        </div>

        <div>
          <h3 className="font-extrabold">
            {title}
          </h3>

          <p className="mt-1 text-xs text-blue-100">
            {subtitle}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 p-4">
        {links.map((item) => (
          <Link
            key={`${item.href}-${item.label}`}
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
  links: PublicNavItem[];
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
              key={`${item.href}-${item.label}`}
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
