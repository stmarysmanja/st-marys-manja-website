import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AcademicsPage() {
  const [settings, lifeItems] = await Promise.all([
    prisma.academicSettings.upsert({
      where: { id: 1 },
      update: {},
      create: {
        id: 1,
        heroTitle: "Academic Curriculum",
        heroSubtitle:
          "Equipping learners with knowledge, skills and values for a successful future.",
        heroMediaUrl: "/Filed work.jpg",
        heroMediaType: "image",
        oLevelTitle: "Lower Secondary (O-Level / UCE)",
        oLevelDescription:
          "Following the competence-based curriculum focusing on practical knowledge and learner-centred assessment.",
        oLevelItems:
          "Mathematics & English Language\nBiology, Chemistry & Physics\nGeography, History & Religious Education\nEntrepreneurship Education\nICT & Agriculture",
        aLevelTitle: "Upper Secondary (A-Level / UACE)",
        aLevelDescription:
          "Specialized Arts and Sciences combinations designed to prepare students for university degrees and professional careers.",
        aLevelSciences: "PCM, PCB, BCM, MEG",
        aLevelArts: "HEG, LEG, DEG, HEA",
        aLevelSubsidiaries: "Sub-Math / ICT & General Paper",
        departmentsText:
          "Our departments provide expert guidance and quality teaching across all subject areas.",
        subjectsText:
          "A wide range of subjects at O-Level and A-Level to match students' interests and career goals.",
        performanceText:
          "We celebrate excellence and continuous improvement in academic achievement.",
        calendarText:
          "Stay informed about terms, examinations, holidays and important academic events.",
      },
    }),
    prisma.academicLifeItem.findMany({
      where: { isPublished: true },
      orderBy: [
        { displayOrder: "asc" },
        { createdAt: "asc" },
      ],
    }),
  ]);

  const oLevelItems = settings.oLevelItems
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);

  const panels = [
    {
      id: "departments",
      icon: "🏛️",
      title: "Academic Departments",
      text: settings.departmentsText,
    },
    {
      id: "subjects",
      icon: "📚",
      title: "Subjects Offered",
      text: settings.subjectsText,
    },
    {
      id: "performance",
      icon: "📊",
      title: "Academic Performance",
      text: settings.performanceText,
    },
    {
      id: "calendar",
      icon: "📅",
      title: "School Calendar",
      text: settings.calendarText,
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="relative flex min-h-[460px] items-center justify-center overflow-hidden">
        {settings.heroMediaType === "video" ? (
          <video
            src={settings.heroMediaUrl}
            muted
            loop
            autoPlay
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url("${settings.heroMediaUrl}")`,
            }}
          />
        )}

        <div className="absolute inset-0 bg-blue-950/65" />

        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center text-white">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-amber-300">
            Learning for Life
          </p>
          <h1 className="mt-4 text-4xl font-extrabold uppercase tracking-tight md:text-6xl">
            {settings.heroTitle}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-200 md:text-xl">
            {settings.heroSubtitle}
          </p>
          <div className="mx-auto mt-6 h-1 w-16 rounded-full bg-amber-400" />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14">
        <div className="grid gap-7 lg:grid-cols-2">
          <article
            id="o-level"
            className="rounded-3xl border border-blue-100 bg-gradient-to-br from-white to-blue-50 p-7 shadow-lg md:p-9"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-blue-800 text-3xl text-white shadow-lg">
                📖
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-blue-950 md:text-3xl">
                  {settings.oLevelTitle}
                </h2>
              </div>
            </div>

            <p className="mt-6 leading-7 text-slate-600">
              {settings.oLevelDescription}
            </p>

            <ul className="mt-6 space-y-3">
              {oLevelItems.map((item) => (
                <li key={item} className="flex gap-3 text-slate-700">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-800 text-xs font-bold text-white">
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>

            <Link
              href="#subjects"
              className="mt-7 inline-flex rounded-xl bg-blue-800 px-6 py-3 font-bold text-white shadow transition hover:-translate-y-1 hover:bg-blue-900"
            >
              Learn More
            </Link>
          </article>

          <article
            id="a-level"
            className="rounded-3xl border border-amber-100 bg-gradient-to-br from-white to-amber-50 p-7 shadow-lg md:p-9"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-amber-400 text-3xl text-blue-950 shadow-lg">
                🎓
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-blue-950 md:text-3xl">
                  {settings.aLevelTitle}
                </h2>
              </div>
            </div>

            <p className="mt-6 leading-7 text-slate-600">
              {settings.aLevelDescription}
            </p>

            <div className="mt-6 space-y-4 text-slate-700">
              <p>
                <strong className="text-blue-950">Sciences:</strong>{" "}
                {settings.aLevelSciences}
              </p>
              <p>
                <strong className="text-blue-950">Arts:</strong>{" "}
                {settings.aLevelArts}
              </p>
              <p>
                <strong className="text-blue-950">Subsidiaries:</strong>{" "}
                {settings.aLevelSubsidiaries}
              </p>
            </div>

            <Link
              href="#subjects"
              className="mt-7 inline-flex rounded-xl bg-blue-800 px-6 py-3 font-bold text-white shadow transition hover:-translate-y-1 hover:bg-blue-900"
            >
              Learn More
            </Link>
          </article>
        </div>
      </section>

      <section id="co-curricular" className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-600">
              Learning in Action
            </p>
            <h2 className="mt-3 text-3xl font-extrabold text-blue-950 md:text-4xl">
              Academic Life
            </h2>
            <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-amber-400" />
            <p className="mx-auto mt-5 max-w-2xl leading-7 text-slate-600">
              A glimpse into the learning experiences and opportunities that shape our students every day.
            </p>
          </div>

          {lifeItems.length === 0 ? (
            <div className="mt-10 rounded-3xl bg-slate-50 p-12 text-center text-slate-500">
              Academic life photographs will appear here after they are added from the Admin Portal.
            </div>
          ) : (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
              {lifeItems.map((item) => (
                <article
                  key={item.id}
                  className="group overflow-hidden rounded-2xl bg-blue-950 text-white shadow-xl transition duration-500 hover:-translate-y-2"
                >
                  <div className="h-52 overflow-hidden bg-slate-200">
                    {item.mediaType === "video" ? (
                      <video
                        src={item.mediaUrl}
                        muted
                        loop
                        autoPlay
                        playsInline
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <img
                        src={item.mediaUrl}
                        alt={item.title}
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                      />
                    )}
                  </div>

                  <div className="relative p-5 pt-8">
                    <div className="absolute -top-6 left-5 flex h-12 w-12 items-center justify-center rounded-full bg-amber-400 text-2xl text-blue-950 shadow-lg">
                      {item.icon}
                    </div>
                    <h3 className="text-lg font-extrabold">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-slate-300">
                      {item.description}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="bg-slate-100 py-16">
        <div className="mx-auto max-w-5xl space-y-4 px-4">
          {panels.map((panel) => (
            <details
              key={panel.id}
              id={panel.id}
              className="group rounded-2xl border border-slate-200 bg-white shadow-sm"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-800 text-2xl text-white">
                    {panel.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-extrabold text-blue-950">
                      {panel.title}
                    </h3>
                    <p className="mt-1 text-sm text-slate-600">
                      {panel.text}
                    </p>
                  </div>
                </div>
                <span className="text-xl font-bold text-blue-950 transition group-open:rotate-180">
                  ⌄
                </span>
              </summary>

              <div className="border-t border-slate-200 px-6 py-5 leading-7 text-slate-600">
                {panel.text}
              </div>
            </details>
          ))}
        </div>
      </section>
    </main>
  );
}
