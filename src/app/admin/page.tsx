import Link from "next/link";

const cards = [
  {
    title: "Academics",
    description: "Manage academic programmes, practical learning and academic life media.",
    href: "/admin/academics",
  },
  {
    title: "Media Library",
    description: "Upload and manage website images, videos and documents.",
    href: "/admin/media",
  },
  { title: "Website Settings", description: "Edit the school identity, hero, mission, vision and contact details.", href: "/admin/website-settings" },
  { title: "Leadership", description: "Manage school leaders, photographs and messages.", href: "/admin/leadership" },
  { title: "News", description: "Create and manage school news articles.", href: "/admin/news" },
  { title: "Gallery", description: "Upload and organize school photographs and videos.", href: "/admin/gallery" },
  { title: "Admissions", description: "Review applications and update admissions information.", href: "/admin/admissions" },
  { title: "Contact", description: "Update phone numbers, email, location and office hours.", href: "/admin/contact-settings" },
];

export default function AdminDashboardPage() {
  return (
    <div className="px-4 py-8 md:px-8 lg:px-10">
      <div className="rounded-3xl bg-gradient-to-r from-blue-950 to-blue-700 p-7 text-white shadow-xl md:p-10">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-sky-300">
          Administration
        </p>
        <h1 className="mt-3 text-3xl font-extrabold md:text-4xl">
          Website Dashboard
        </h1>
        <p className="mt-3 max-w-2xl text-slate-200">
          Manage the public school website from this private portal.
        </p>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-xl"
          >
            <h2 className="text-xl font-extrabold text-blue-950">{card.title}</h2>
            <p className="mt-3 leading-7 text-slate-600">{card.description}</p>
            <span className="mt-5 inline-block text-sm font-bold text-blue-700 transition group-hover:translate-x-1">
              Open section →
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
