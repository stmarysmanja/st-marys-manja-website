import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const settings = await prisma.websiteSettings.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1 },
  });

  const coreValues = settings.coreValues
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="bg-blue-950 px-4 py-20 text-center text-white">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-sky-300">
          Discover Our School
        </p>

        <h1 className="mt-4 text-4xl font-extrabold md:text-6xl">
          About Us
        </h1>

        <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-300">
          Learn more about {settings.schoolName}, our purpose, values and
          commitment to student development.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
            {settings.introductionMediaType === "video" ? (
              <video
                src={settings.introductionImage}
                controls
                muted
                loop
                className="h-[420px] w-full object-cover"
              />
            ) : (
              <img
                src={settings.introductionImage}
                alt={settings.introductionTitle}
                className="h-[420px] w-full object-cover"
              />
            )}
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-600">
              Welcome
            </p>

            <h2 className="mt-3 text-3xl font-extrabold text-blue-950 md:text-4xl">
              {settings.introductionTitle}
            </h2>

            <p className="mt-6 text-lg leading-8 text-slate-600">
              {settings.introductionText}
            </p>

            <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-6">
              <p className="text-xs font-bold uppercase tracking-wide text-amber-700">
                Our Motto
              </p>

              <p className="mt-2 text-2xl font-extrabold italic text-blue-950">
                “{settings.motto}”
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid gap-8 lg:grid-cols-2">
            <article className="rounded-3xl border border-blue-100 bg-slate-50 p-8 shadow-sm md:p-10">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-700 text-2xl text-white">
                🎯
              </div>

              <h2 className="mt-5 text-3xl font-extrabold text-blue-950">
                Our Mission
              </h2>

              <p className="mt-5 text-lg leading-8 text-slate-600">
                {settings.mission}
              </p>
            </article>

            <article className="rounded-3xl border border-blue-100 bg-slate-50 p-8 shadow-sm md:p-10">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-600 text-2xl text-white">
                🌍
              </div>

              <h2 className="mt-5 text-3xl font-extrabold text-blue-950">
                Our Vision
              </h2>

              <p className="mt-5 text-lg leading-8 text-slate-600">
                {settings.vision}
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="bg-slate-100 py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-600">
              What Guides Us
            </p>

            <h2 className="mt-3 text-3xl font-extrabold text-blue-950 md:text-4xl">
              Our Core Values
            </h2>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {coreValues.map((value, index) => (
              <article
                key={value}
                className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-700 text-xl font-extrabold text-white">
                  {index + 1}
                </div>

                <h3 className="mt-5 text-xl font-extrabold text-blue-950">
                  {value}
                </h3>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-blue-950 px-4 py-16 text-center text-white">
        <h2 className="text-3xl font-extrabold md:text-4xl">
          Join Our School Community
        </h2>

        <p className="mx-auto mt-4 max-w-2xl text-slate-300">
          Begin your application or contact the school office for more
          information.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            href={settings.admissionsLink}
            className="rounded-xl bg-amber-400 px-7 py-3.5 font-extrabold text-blue-950 transition hover:bg-amber-300"
          >
            {settings.admissionsText}
          </Link>

          <Link
            href="/contact"
            className="rounded-xl border border-white/30 bg-white/10 px-7 py-3.5 font-extrabold text-white transition hover:bg-white hover:text-blue-950"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </main>
  );
}
