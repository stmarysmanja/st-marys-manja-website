import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const [settings, aboutSettings, boardGovernors] = await Promise.all([
    prisma.websiteSettings.findUnique({
      where: { id: 1 },
    }),

    prisma.aboutSettings.upsert({
      where: { id: 1 },
      update: {},
      create: {
        id: 1,
        heroEyebrow: "About Our School",
        heroTitle: "St. Mary's Secondary School-Manja",
        heroDescription:
          "Learn more about our school, our purpose, values and commitment to student development.",
        welcomeEyebrow: "Welcome",
        mottoLabel: "Our Motto",
        missionLabel: "Our Mission",
        visionLabel: "Our Vision",
        valuesEyebrow: "What Guides Us",
        valuesTitle: "Our Core Values",
        valuesDescription:
          "The principles that guide our school community and the development of our learners.",
        governanceEyebrow: "School Governance",
        governanceTitle: "Board of Governors",
        governanceDescription:
          "Our school is guided by committed leaders who support good governance, accountability and educational excellence.",
        anthemEyebrow: "Our Identity",
        anthemTitle: "School Anthem",
        anthemText:
          "Our school anthem reflects our identity, values, unity and commitment to excellence.",
        ctaTitle: "Join Our School Community",
        ctaDescription:
          "Begin your application or contact the school office for more information.",
        ctaPrimaryText: "Apply Now",
        ctaPrimaryLink: "/admissions",
        ctaSecondaryText: "Contact Us",
        ctaSecondaryLink: "/contact",
      },
    }),
    prisma.boardGovernor.findMany({
      where: {
        isPublished: true,
      },
      orderBy: [
        { displayOrder: "asc" },
        { createdAt: "asc" },
      ],
    }),
  ]);

  if (!settings) {
    return null;
  }

  const coreValues = settings.coreValues
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  return (
    <main className="min-h-screen bg-white">
      <section className="bg-gradient-to-br from-[#061d53] via-[#08296f] to-[#2453d4] px-4 py-20 text-center text-white">
        <p className="text-xs font-black uppercase tracking-[0.28em] text-blue-200">
          {aboutSettings.heroEyebrow}
        </p>

        <h1
          className="mt-4 text-4xl font-extrabold md:text-6xl"
          style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
        >
          {aboutSettings.heroTitle}
        </h1>

        <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-300">
          {aboutSettings.heroDescription}
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
              {aboutSettings.welcomeEyebrow}
            </p>

            <h2 className="mt-3 text-3xl font-extrabold text-blue-950 md:text-4xl">
              {settings.introductionTitle}
            </h2>

            <p className="mt-6 text-lg leading-8 text-slate-600">
              {settings.introductionText}
            </p>

            <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-6">
              <p className="text-xs font-bold uppercase tracking-wide text-amber-700">
                {aboutSettings.mottoLabel}
              </p>

              <p className="mt-2 text-2xl font-extrabold italic text-blue-950">
                &ldquo;{settings.motto}&rdquo;
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="mission" className="bg-slate-50 py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 lg:grid-cols-2">
          <article className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-3xl font-extrabold text-blue-950">
              {aboutSettings.missionLabel}
            </h2>

            <p className="mt-5 text-lg leading-8 text-slate-600">
              {settings.mission}
            </p>
          </article>

          <article className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-3xl font-extrabold text-blue-950">
              {aboutSettings.visionLabel}
            </h2>

            <p className="mt-5 text-lg leading-8 text-slate-600">
              {settings.vision}
            </p>
          </article>
        </div>
      </section>

      <section className="bg-slate-100 py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-600">
              {aboutSettings.valuesEyebrow}
            </p>

            <h2 className="mt-3 text-3xl font-extrabold text-blue-950 md:text-4xl">
              {aboutSettings.valuesTitle}
            </h2>

            <p className="mx-auto mt-4 max-w-3xl text-slate-600">
              {aboutSettings.valuesDescription}
            </p>
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

      <section id="governance" className="bg-white py-16">
  <div className="mx-auto max-w-7xl px-4">
    <div className="text-center">
      <p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-600">
        {aboutSettings.governanceEyebrow}
      </p>

      <h2 className="mt-3 text-3xl font-extrabold text-blue-950 md:text-4xl">
        {aboutSettings.governanceTitle}
      </h2>

      <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-slate-600">
        {aboutSettings.governanceDescription}
      </p>
    </div>

    {boardGovernors.length > 0 && (
      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {boardGovernors.map((member) => (
          <article
            key={member.id}
            className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl"
          >
            <div className="aspect-[4/5] overflow-hidden bg-slate-100">
              {member.photoUrl ? (
                <img
                  src={member.photoUrl}
                  alt={member.name}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-gradient-to-br from-blue-950 to-blue-700 text-4xl font-black text-white">
                  SM
                </div>
              )}
            </div>

            <div className="p-6 text-center">
              <h3 className="text-xl font-extrabold text-blue-950">
                {member.name}
              </h3>

              <p className="mt-2 text-xs font-bold uppercase tracking-[0.16em] text-blue-600">
                {member.position}
              </p>

              {member.description && (
                <p className="mt-4 text-sm leading-6 text-slate-600">
                  {member.description}
                </p>
              )}
            </div>
          </article>
        ))}
      </div>
    )}
  </div>
</section>

      <section id="anthem" className="bg-slate-50 py-16">
        <div className="mx-auto max-w-5xl px-4 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-600">
            {aboutSettings.anthemEyebrow}
          </p>

          <h2 className="mt-3 text-3xl font-extrabold text-blue-950 md:text-4xl">
            {aboutSettings.anthemTitle}
          </h2>

          <p className="mx-auto mt-5 max-w-3xl whitespace-pre-line text-lg leading-8 text-slate-600">
            {aboutSettings.anthemText}
          </p>
        </div>
      </section>

      <section className="bg-blue-950 px-4 py-16 text-center text-white">
        <h2 className="text-3xl font-extrabold md:text-4xl">
          {aboutSettings.ctaTitle}
        </h2>

        <p className="mx-auto mt-4 max-w-2xl text-slate-300">
          {aboutSettings.ctaDescription}
        </p>

        <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            href={aboutSettings.ctaPrimaryLink}
            className="rounded-xl bg-amber-400 px-7 py-3.5 font-extrabold text-blue-950 transition hover:bg-amber-300"
          >
            {aboutSettings.ctaPrimaryText}
          </Link>

          <Link
            href={aboutSettings.ctaSecondaryLink}
            className="rounded-xl border border-white/30 bg-white/10 px-7 py-3.5 font-extrabold text-white transition hover:bg-white hover:text-blue-950"
          >
            {aboutSettings.ctaSecondaryText}
          </Link>
        </div>
      </section>
    </main>
  );
}
