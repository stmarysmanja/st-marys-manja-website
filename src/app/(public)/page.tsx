import Link from "next/link";
import { prisma } from "@/lib/prisma";
import HomeHero from "@/components/home/HomeHero";

export const dynamic = "force-dynamic";




export default async function HomePage() {
  const [websiteSettings, contact, heroSlides, academicLife] = await Promise.all([
    prisma.websiteSettings.findUnique({
      where: { id: 1 },
    }),
    prisma.contactSettings.findUnique({
      where: { id: 1 },
    }),
    prisma.heroSlide.findMany({
      where: { isPublished: true },
      orderBy: [
        { displayOrder: "asc" },
        { createdAt: "asc" },
      ],
    }),
    prisma.academicLifeItem.findMany({
      where: { isPublished: true },
      orderBy: [
        { displayOrder: "asc" },
        { createdAt: "asc" },
      ],
      take: 6,
    }),
    prisma.heroSlide.findMany({
      where: { isPublished: true },
      orderBy: [
        { displayOrder: "asc" },
        { createdAt: "asc" },
      ],
    }),
    prisma.academicLifeItem.findMany({
      where: { isPublished: true },
      orderBy: [
        { displayOrder: "asc" },
        { createdAt: "asc" },
      ],
      take: 6,
    }),
  ]);

  const phones = contact
    ? (JSON.parse(contact.phones) as string[])
    : [];

  const phone = phones[0] || "+256 700 240 640";

const emails = contact
  ? (JSON.parse(contact.emails) as string[])
  : [];

const email = emails[0] || "stmarysmanjasecondaryschool2@gmail.com";

const schoolName =
  websiteSettings?.schoolName || "St Mary's Secondary School-Manja";

const heroTitle =
  websiteSettings?.heroTitle || schoolName;

const heroSubtitle =
  websiteSettings?.heroSubtitle || "Manja | Excellence & Virtue";

const centreCode =
  websiteSettings?.centreCode || "ST MARYS MANJA";

const admissionsText =
  websiteSettings?.admissionsText || "Apply for Admission";

const admissionsLink =
  websiteSettings?.admissionsLink || "/admissions";

const whatsappNumber =
  websiteSettings?.whatsappNumber || "256700240640";

const location =
  contact?.location || "Manja, Uganda";
  const values = [
    {
      label: "Our Mission",
      icon: "M",
      text:
        websiteSettings?.mission ||
        "To produce practical, responsible citizens with high academic standards and moral values.",
      featured: false,
    },
    {
      label: "Our Motto",
      icon: "M",
      text:
        websiteSettings?.motto ||
        "We Learn by Doing",
      featured: true,
    },
    {
      label: "Our Vision",
      icon: "V",
      text:
        websiteSettings?.vision ||
        "To be a Centre of Excellence all Round Achievers.",
      featured: false,
    },
  ];
  return (
    <>
<main>
        <HomeHero
          slides={heroSlides}
          heroTitle={heroTitle}
          heroSubtitle={heroSubtitle}
          centreCode={centreCode}
          admissionsText={admissionsText}
          admissionsLink={admissionsLink}
          whatsappNumber={whatsappNumber}
        />

        <section className="relative overflow-hidden bg-slate-50 pb-20">
          <div className="bg-gradient-to-br from-[#061d53] via-[#08296f] to-[#2453d4] px-4 pb-40 pt-20 text-center text-white">
            <p className="text-sm font-black uppercase tracking-[0.34em] text-blue-200">
              Our Values
            </p>

            <h2
              className="mt-6 text-4xl font-bold md:text-6xl"
              style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
            >
              Our Mission, Motto &amp; Vision
            </h2>

            <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-blue-100">
              The pillars that guide us in nurturing disciplined, responsible
              and successful citizens.
            </p>
          </div>

          <div className="relative z-10 mx-auto -mt-28 grid max-w-7xl gap-7 px-4 md:grid-cols-3">
            {values.map((value) => (
              <article
                key={value.label}
                className={`flex min-h-[300px] flex-col items-center rounded-[24px] border p-6 text-center shadow-2xl transition duration-500 hover:-translate-y-3 ${
                  value.featured
                    ? "border-blue-300 bg-gradient-to-br from-[#2453d4] to-[#08296f] text-white"
                    : "border-blue-100 bg-white text-slate-800"
                }`}
              >
                <div
                  className={`flex h-16 w-16 items-center justify-center rounded-full text-2xl ${
                    value.featured
                      ? "bg-white text-[#08296f]"
                      : "bg-blue-50 text-[#2453d4]"
                  }`}
                >
                  {value.icon}
                </div>

                <p
                  className={`mt-5 text-xs font-black uppercase tracking-[0.24em] ${
                    value.featured ? "text-blue-100" : "text-[#2453d4]"
                  }`}
                >
                  {value.label}
                </p>

                <div
                  className={`mt-4 h-1 w-12 rounded-full ${
                    value.featured ? "bg-white" : "bg-[#2453d4]"
                  }`}
                />

                <p
                  className={`mt-5 flex flex-1 items-center font-bold leading-relaxed ${
                    value.featured
                      ? "text-3xl italic"
                      : "text-lg md:text-xl"
                  }`}
                  style={{
                    fontFamily: value.featured
                      ? 'Georgia, "Times New Roman", serif'
                      : "Arial, sans-serif",
                  }}
                >
                  {value.featured ? `"${value.text}"` : value.text}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="bg-white py-20">
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 lg:grid-cols-2">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.25em] text-[#2453d4]">
                {websiteSettings?.introductionTitle || "Welcome to St Mary's Secondary School-Manja"}
              </p>

              <h2
                className="mt-4 text-4xl font-bold text-[#08296f] md:text-5xl"
                style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
              >
                {websiteSettings?.tagline || "Excellence & Virtue"}
              </h2>

              <p className="mt-6 text-lg leading-8 text-slate-600">
                {websiteSettings?.introductionText || "St Mary's Secondary School-Manja is committed to practical education, discipline, academic excellence and the development of every learner's talents."}
              </p>

              <Link
                href="/about"
                className="mt-8 inline-flex rounded-xl bg-[#2453d4] px-7 py-4 font-bold text-white transition hover:-translate-y-1 hover:bg-[#08296f]"
              >
                Discover Our School
              </Link>
            </div>

            {websiteSettings?.introductionMediaType === "video" ? (
          <video
            src={websiteSettings?.introductionImage || ""}
            autoPlay
            muted
            loop
            playsInline
            controls
            className="h-[480px] w-full rounded-[32px] object-cover shadow-2xl"
          />
        ) : (
          <img
            src={websiteSettings?.introductionImage || "/Filed work.jpg"}
            alt={websiteSettings?.introductionTitle || "St Mary's Secondary School-Manja"}
            className="h-[480px] w-full rounded-[32px] object-cover shadow-2xl"
          />
        )}
          </div>
        </section>

        <section className="bg-slate-50 py-20">
          <div className="mx-auto max-w-7xl px-4">
            <div className="text-center">
              <p className="text-sm font-black uppercase tracking-[0.25em] text-[#2453d4]">
                Learning in Action
              </p>

              <h2
                className="mt-4 text-4xl font-bold text-[#08296f] md:text-5xl"
                style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
              >
                Academic and Student Life
              </h2>

              <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-slate-600">
                Our students learn through classroom teaching, field studies,
                educational tours, culture and community participation.
              </p>
            </div>

            <div className="mt-12 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {academicLife.map((item) => (
                <article
                  key={item.title}
                  className="group overflow-hidden rounded-3xl bg-white shadow-lg transition duration-500 hover:-translate-y-2 hover:shadow-2xl"
                >
                  <div className="h-64 overflow-hidden">
                    <img
                      src={item.mediaUrl}
                      alt={item.title}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                    />
                  </div>

                  <div className="p-7">
                    <h3 className="text-2xl font-bold text-[#08296f]">
                      {item.title}
                    </h3>

                    <p className="mt-3 leading-7 text-slate-600">
                      {item.description}
                    </p>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-10 text-center">
              <Link
                href="/academics"
                className="inline-flex rounded-xl bg-[#2453d4] px-7 py-4 font-bold text-white transition hover:bg-[#08296f]"
              >
                Explore Our Academics
              </Link>
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-r from-[#08296f] to-[#2453d4] px-4 py-20 text-center text-white">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-blue-200">
            Admissions Open
          </p>

          <h2
            className="mx-auto mt-5 max-w-4xl text-4xl font-bold md:text-5xl"
            style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
          >
            Join St Mary&apos;s Secondary School-Manja
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-blue-100">
            Begin your journey in a disciplined, supportive and academically
            focused school community.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/admissions"
              className="rounded-xl bg-white px-8 py-4 font-extrabold text-[#08296f] transition hover:-translate-y-1 hover:bg-blue-100"
            >
              Apply Now
            </Link>

            <Link
              href="/contact"
              className="rounded-xl border border-white/40 bg-white/10 px-8 py-4 font-extrabold text-white transition hover:bg-white hover:text-[#08296f]"
            >
              Contact the School
            </Link>
          </div>
        </section>
      </main>
</>
  );
}
