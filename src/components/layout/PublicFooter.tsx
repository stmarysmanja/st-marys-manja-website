import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";

interface FooterProps {
  schoolName: string;
  location: string;
  phone: string;
  email: string;
}

export default function PublicFooter({
  schoolName,
  location,
  phone,
  email,
}: FooterProps) {
  return (
    <footer className="bg-[#08296f] text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="relative h-28 w-24 overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-white/20">
            <Image
              src="/branding/school-badge.png"
              alt="St. Mary's Secondary School Manja badge"
              fill
              sizes="96px"
              className="object-contain p-2"
            />
          </div>

          <h2 className="mt-5 text-xl font-extrabold">{schoolName}</h2>

          <p className="mt-3 leading-7 text-blue-100">
            Nurturing disciplined, responsible and academically excellent learners.
          </p>
        </div>

        <FooterColumn
          title="Quick Links"
          links={[
            ["About Us", "/about"],
            ["Academics", "/academics"],
            ["Admissions", "/admissions"],
            ["Contact", "/contact"],
          ]}
        />

        <FooterColumn
          title="Media"
          links={[
            ["Latest News", "/news"],
            ["Gallery", "/gallery"],
            ["Academic Life", "/academics#co-curricular"],
            ["School Calendar", "/academics#calendar"],
          ]}
        />

        <div>
          <h3 className="text-sm font-extrabold uppercase tracking-[0.16em] text-white">
            Contact
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
        © {new Date().getFullYear()} {schoolName}. All rights reserved.
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: [string, string][];
}) {
  return (
    <div>
      <h3 className="text-sm font-extrabold uppercase tracking-[0.16em] text-white">
        {title}
      </h3>

      <div className="mt-5 space-y-3">
        {links.map(([label, href]) => (
          <Link
            key={href}
            href={href}
            className="block text-sm text-blue-100 hover:text-white"
          >
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}
