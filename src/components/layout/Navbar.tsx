"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    BookOpen,
    ChevronDown,
    GraduationCap,
    Menu,
    X,
} from "lucide-react";

const academicsLinks = [
    {
        name: "Academics Overview",
        description: "Explore our academic programmes",
        href: "/academics",
    },
    {
        name: "O-Level Programme",
        description: "Senior One to Senior Four",
        href: "/academics#o-level",
    },
    {
        name: "A-Level Programme",
        description: "Senior Five to Senior Six",
        href: "/academics#a-level",
    },
    {
        name: "Departments",
        description: "Our academic departments",
        href: "/academics#departments",
    },
    {
        name: "Subjects",
        description: "Subjects offered at the school",
        href: "/academics#subjects",
    },
    {
        name: "Co-curricular Activities",
        description: "Sports, clubs, music and talents",
        href: "/academics#co-curricular",
    },
    {
        name: "Academic Performance",
        description: "Results and learner achievements",
        href: "/academics#performance",
    },
    {
        name: "School Calendar",
        description: "Terms, examinations and activities",
        href: "/academics#calendar",
    },
];

const navLinks = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    { name: "Gallery", href: "/gallery" },
    { name: "News", href: "/news" },
    { name: "Contact Us", href: "/contact" },
];

export default function Navbar() {
    const pathname = usePathname();

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMobileAcademicsOpen, setIsMobileAcademicsOpen] =
        useState(false);

    const isActive = (href: string) => {
        if (href === "/") {
            return pathname === "/";
        }

        return pathname.startsWith(href);
    };

    function closeMobileMenu() {
        setIsMobileMenuOpen(false);
        setIsMobileAcademicsOpen(false);
    }

    return (
        <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#0e1b4d] text-white shadow-lg">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-20 items-center justify-between">
                    {/* School Brand */}
                    <Link
                        href="/"
                        onClick={closeMobileMenu}
                        className="group flex items-center gap-3"
                    >
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#facc15] text-[#0e1b4d] shadow-md transition-transform duration-300 group-hover:scale-105">
                            <GraduationCap className="h-6 w-6" />
                        </div>

                        <div>
                            <span className="block text-lg font-bold leading-tight tracking-wide text-white md:text-xl">
                                St. Mary&apos;s
                            </span>

                            <span className="text-[10px] font-medium uppercase tracking-wider text-amber-400 sm:text-xs">
                                Secondary School - Manja
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden items-center gap-5 md:flex lg:gap-7">
                        <Link
                            href="/"
                            className={`text-sm font-medium transition-colors duration-200 ${isActive("/")
                                    ? "font-semibold text-[#facc15]"
                                    : "text-slate-200 hover:text-white"
                                }`}
                        >
                            Home
                        </Link>

                        <Link
                            href="/about"
                            className={`text-sm font-medium transition-colors duration-200 ${isActive("/about")
                                    ? "font-semibold text-[#facc15]"
                                    : "text-slate-200 hover:text-white"
                                }`}
                        >
                            About Us
                        </Link>

                        {/* Desktop Academics Dropdown */}
                        <div className="group relative">
                            <Link
                                href="/academics"
                                className={`flex items-center gap-1.5 py-7 text-sm font-medium transition-colors duration-200 ${isActive("/academics")
                                        ? "font-semibold text-[#facc15]"
                                        : "text-slate-200 hover:text-white"
                                    }`}
                            >
                                Academics

                                <ChevronDown className="h-4 w-4 transition-transform duration-300 group-hover:rotate-180" />
                            </Link>

                            <div className="invisible absolute left-1/2 top-full w-[650px] -translate-x-1/2 translate-y-3 opacity-0 transition-all duration-300 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
                                    <div className="bg-gradient-to-r from-blue-950 to-blue-800 px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-400 text-blue-950">
                                                <BookOpen className="h-5 w-5" />
                                            </div>

                                            <div>
                                                <h2 className="font-bold text-white">
                                                    Academic Programmes
                                                </h2>

                                                <p className="text-xs text-slate-300">
                                                    Quality education for O-Level and A-Level
                                                    learners
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 p-4">
                                        {academicsLinks.map((item) => (
                                            <Link
                                                key={item.name}
                                                href={item.href}
                                                className="group/item rounded-xl border border-transparent p-4 transition duration-200 hover:border-blue-100 hover:bg-blue-50"
                                            >
                                                <h3 className="text-sm font-bold text-blue-950 transition group-hover/item:text-blue-700">
                                                    {item.name}
                                                </h3>

                                                <p className="mt-1 text-xs leading-5 text-slate-500">
                                                    {item.description}
                                                </p>
                                            </Link>
                                        ))}
                                    </div>

                                    <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-4">
                                        <p className="text-xs text-slate-500">
                                            Discover our complete academic programme.
                                        </p>

                                        <Link
                                            href="/academics"
                                            className="text-xs font-bold text-blue-700 hover:underline"
                                        >
                                            View Academics →
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {navLinks.slice(2).map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={`text-sm font-medium transition-colors duration-200 ${isActive(link.href)
                                        ? "font-semibold text-[#facc15]"
                                        : "text-slate-200 hover:text-white"
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    {/* Desktop Admissions Button */}
                    <div className="hidden md:block">
                        <Link
                            href="/admissions"
                            className="rounded-xl bg-[#facc15] px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-yellow-400 hover:shadow-lg"
                        >
                            Admissions
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        type="button"
                        onClick={() =>
                            setIsMobileMenuOpen((current) => !current)
                        }
                        className="rounded-lg p-2 text-slate-200 transition hover:bg-white/10 hover:text-white md:hidden"
                        aria-label="Toggle navigation"
                        aria-expanded={isMobileMenuOpen}
                    >
                        {isMobileMenuOpen ? (
                            <X className="h-6 w-6" />
                        ) : (
                            <Menu className="h-6 w-6" />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation */}
            {isMobileMenuOpen && (
                <div className="border-b border-white/10 bg-[#0a1336] px-4 pb-6 pt-4 md:hidden">
                    <div className="space-y-2">
                        <Link
                            href="/"
                            onClick={closeMobileMenu}
                            className={`block rounded-lg px-4 py-3 text-base font-medium ${isActive("/")
                                    ? "bg-white/10 text-[#facc15]"
                                    : "text-slate-200 hover:bg-white/5"
                                }`}
                        >
                            Home
                        </Link>

                        <Link
                            href="/about"
                            onClick={closeMobileMenu}
                            className={`block rounded-lg px-4 py-3 text-base font-medium ${isActive("/about")
                                    ? "bg-white/10 text-[#facc15]"
                                    : "text-slate-200 hover:bg-white/5"
                                }`}
                        >
                            About Us
                        </Link>

                        {/* Mobile Academics Dropdown */}
                        <div className="overflow-hidden rounded-xl border border-white/10">
                            <button
                                type="button"
                                onClick={() =>
                                    setIsMobileAcademicsOpen((current) => !current)
                                }
                                className={`flex w-full items-center justify-between px-4 py-3 text-left text-base font-medium ${isActive("/academics")
                                        ? "bg-white/10 text-[#facc15]"
                                        : "text-slate-200 hover:bg-white/5"
                                    }`}
                                aria-expanded={isMobileAcademicsOpen}
                            >
                                <span>Academics</span>

                                <ChevronDown
                                    className={`h-5 w-5 transition-transform duration-300 ${isMobileAcademicsOpen ? "rotate-180" : ""
                                        }`}
                                />
                            </button>

                            {isMobileAcademicsOpen && (
                                <div className="space-y-1 border-t border-white/10 bg-[#08102e] p-2">
                                    {academicsLinks.map((item) => (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            onClick={closeMobileMenu}
                                            className="block rounded-lg px-4 py-3 transition hover:bg-white/10"
                                        >
                                            <span className="block text-sm font-semibold text-white">
                                                {item.name}
                                            </span>

                                            <span className="mt-1 block text-xs text-slate-400">
                                                {item.description}
                                            </span>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>

                        {navLinks.slice(2).map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                onClick={closeMobileMenu}
                                className={`block rounded-lg px-4 py-3 text-base font-medium ${isActive(link.href)
                                        ? "bg-white/10 text-[#facc15]"
                                        : "text-slate-200 hover:bg-white/5"
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    <div className="mt-4 border-t border-white/10 pt-4">
                        <Link
                            href="/admissions"
                            onClick={closeMobileMenu}
                            className="block w-full rounded-xl bg-[#facc15] py-3 text-center font-semibold text-slate-950"
                        >
                            Apply / Admissions
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
}