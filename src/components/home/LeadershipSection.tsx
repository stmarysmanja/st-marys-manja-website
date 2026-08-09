import { prisma } from "@/lib/prisma";

export default async function LeadershipSection() {
  const [settings, leaders] = await Promise.all([
    prisma.leadershipSettings.upsert({
      where: { id: 1 },
      update: {},
      create: {
        id: 1,
        eyebrow: "Meet Our Team",
        title: "School Leadership",
        description:
          "Visionary leaders guiding academic excellence, discipline and holistic student development.",
        emptyText:
          "Leadership profiles will appear here after they are published from the Admin Portal.",
      },
    }),

    prisma.leadershipMember.findMany({
      where: {
        isPublished: true,
      },
      orderBy: [
        { displayOrder: "asc" },
        { createdAt: "asc" },
      ],
    }),
  ]);

  return (
    <section
      id="leadership"
      className="bg-slate-50 px-4 py-20"
    >
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-[#2453d4]">
            {settings.eyebrow}
          </p>

          <h2
            className="mt-4 text-4xl font-bold text-[#08296f] md:text-5xl"
            style={{
              fontFamily: 'Georgia, "Times New Roman", serif',
            }}
          >
            {settings.title}
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-slate-600">
            {settings.description}
          </p>
        </div>

        {leaders.length === 0 ? (
          <div className="mx-auto mt-12 max-w-3xl rounded-3xl border border-slate-200 bg-white p-10 text-center text-slate-500 shadow-sm">
            {settings.emptyText}
          </div>
        ) : (
          <div className="mt-20 grid gap-x-8 gap-y-20 md:grid-cols-2 xl:grid-cols-3">
            {leaders.map((leader) => (
              <article
                key={leader.id}
                className="group relative rounded-[28px] border border-slate-200 bg-white px-7 pb-8 pt-24 text-center shadow-[0_18px_50px_rgba(15,23,42,0.10)] transition duration-500 hover:-translate-y-3 hover:shadow-[0_28px_65px_rgba(37,99,235,0.18)]"
              >
                <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
                  <div className="rounded-full bg-gradient-to-br from-blue-600 via-sky-400 to-amber-400 p-1.5 shadow-xl transition duration-500 group-hover:scale-105 group-hover:rotate-2">
                    <div className="h-32 w-32 overflow-hidden rounded-full border-4 border-white bg-slate-200">
                      {leader.photo ? (
                        <img
                          src={leader.photo}
                          alt={leader.name}
                          className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center font-black text-slate-400">
                          SM
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <h3 className="text-2xl font-extrabold text-blue-950">
                  {leader.name}
                </h3>

                <p className="mt-2 text-xs font-bold uppercase tracking-[0.2em] text-blue-600">
                  {leader.role}
                </p>

                {leader.title && (
                  <p className="mt-3 font-bold text-slate-700">
                    {leader.title}
                  </p>
                )}

                {leader.theme && (
                  <p className="mt-5 text-sm font-semibold italic text-slate-500">
                    &ldquo;{leader.theme}&rdquo;
                  </p>
                )}

                <p className="mt-5 leading-7 text-slate-600">
                  {leader.message}
                </p>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
