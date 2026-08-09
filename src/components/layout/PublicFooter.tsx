import Image from "next/image";
import Link from "next/link";
import {
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

export interface FooterNavItem {
  label: string;
  href: string;
}

interface FooterProps {
  schoolName: string;
  location: string;
  phone: string;
  email: string;

  badgeUrl: string;
  badgeAlt: string;

  footerDescription: string;

  footerQuickTitle: string;
  footerQuickLinks: FooterNavItem[];

  footerMediaTitle: string;
  footerMediaLinks: FooterNavItem[];

  footerContactTitle: string;
  footerCopyrightText: string;
}

export default function PublicFooter({
  schoolName,
  location,
  phone,
  email,

  badgeUrl,
  badgeAlt,

  footerDescription,

  footerQuickTitle,
  footerQuickLinks,

  footerMediaTitle,
  footerMediaLinks,

  footerContactTitle,
  footerCopyrightText,
}: FooterProps) {
  return (
    <footer className="bg-[#08296f] text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="relative h-28 w-24 overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-white/20">
            <Image
              src={badgeUrl}
              alt={badgeAlt}
              fill
              sizes="96px"
              className="object-contain p-2"
            />
          </div>

          <h2 className="mt-5 text-xl font-extrabold">
            {schoolName}
          </h2>

          <p className="mt-3 leading-7 text-blue-100">
            {footerDescription}
          </p>
        </div>

        <FooterColumn
          title={footerQuickTitle}
          links={footerQuickLinks}
        />

        <FooterColumn
          title={footerMediaTitle}
          links={footerMediaLinks}
        />

        <div>
          <h3 className="text-sm font-extrabold uppercase tracking-[0.16em] text-white">
            {footerContactTitle}
          </h3>

          <div className="mt-5 space-y-4 text-sm text-blue-100">
            <p className="flex gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-white" />
              {location}
            </p>

            <a
              href={`tel:${phone.replace(/\s+/g, "")}`}
              className="flex gap-3 hover:text-white"
            >
              <Phone className="h-4 w-4 shrink-0 text-white" />
              {phone}
            </a>

            <a
              href={`mailto:${email}`}
              className="flex gap-3 hover:text-white"
            >
              <Mail className="h-4 w-4 shrink-0 text-white" />
              {email}
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 px-4 py-5 text-center text-xs text-blue-200">
        © {new Date().getFullYear()} {schoolName}.{" "}
        {footerCopyrightText}
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: FooterNavItem[];
}) {
  return (
    <div>
      <h3 className="text-sm font-extrabold uppercase tracking-[0.16em] text-white">
        {title}
      </h3>

      <div className="mt-5 space-y-3">
        {links.map((item) => (
          <Link
            key={`${item.href}-${item.label}`}
            href={item.href}
            className="block text-sm text-blue-100 hover:text-white"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
