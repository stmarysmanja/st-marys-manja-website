"use client";

import React from "react";
import Link from "next/link";
import { GraduationCap, MapPin, Phone, Mail } from "lucide-react";
import { useContact } from "@/context/ContactContext";

export default function Footer() {
  const { contactData } = useContact();

  return (
    <footer className="bg-[#08102e] text-white pt-16 pb-12 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-10">

        {/* School Overview */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#facc15] text-[#0e1b4d] rounded-lg flex items-center justify-center font-bold">
              <GraduationCap className="w-5 h-5" />
            </div>
            <span className="font-serif text-lg font-bold">St. Mary's Secondary</span>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed">
            Nurturing academic excellence, moral integrity, and leadership for tomorrow's pioneers.
          </p>
        </div>

        {/* Quick Navigation Links */}
        <div>
          <h4 className="font-serif font-semibold text-[#facc15] mb-4 text-base">Quick Links</h4>
          <ul className="space-y-2.5 text-sm text-slate-300">
            <li><Link href="/" className="hover:text-white transition-colors">Home Page</Link></li>
            <li><Link href="/about" className="hover:text-white transition-colors">About St. Mary's</Link></li>
            <li><Link href="/academics" className="hover:text-white transition-colors">Academic Programs</Link></li>
            <li><Link href="/gallery" className="hover:text-white transition-colors">School Gallery</Link></li>
            <li><Link href="/news" className="hover:text-white transition-colors">News & Announcements</Link></li>
            <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
          </ul>
        </div>

        {/* Management & Portals */}
        <div>
          <h4 className="font-serif font-semibold text-[#facc15] mb-4 text-base">Portals</h4>
          <ul className="space-y-2.5 text-sm text-slate-300">
            <li><Link href="/admissions" className="hover:text-white transition-colors">Online Application</Link></li>
            <li><Link href="/admin/contact-settings" className="hover:text-white transition-colors">Admin Settings</Link></li>
          </ul>
        </div>

        {/* Dynamic Contact Details */}
        <div className="space-y-3 text-sm text-slate-300">
          <h4 className="font-serif font-semibold text-[#facc15] mb-4 text-base">Contact Information</h4>
          <p className="flex items-start gap-2.5">
            <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-1" />
            <span>{contactData.location}</span>
          </p>
          <p className="flex items-center gap-2.5">
            <Phone className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{contactData.phones[0]}</span>
          </p>
          <p className="flex items-center gap-2.5">
            <Mail className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{contactData.emails[0]}</span>
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t border-white/10 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} St. Mary's Secondary School - Manja. All rights reserved.
      </div>
    </footer>
  );
}