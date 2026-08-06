import { prisma } from "@/lib/prisma";

export default async function LeadershipSection() {
  const leaders = await prisma.leadershipMember.findMany({
    where: {
      isPublished: true,
    },
    orderBy: [
      { displayOrder: "asc" },
      { createdAt: "asc" },
    ],
  });

  if (leaders.length === 0) {
    return null;
  }

  return (
    <section className="bg-gradient-to-b from-white to-slate-100 py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-600">
            Meet Our Team
          </p>
          <h2 className="mt-3 text-3xl font-extrabold text-blue-950 md:text-4xl">
            School Leadership
          </h2>
          <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-gradient-to-r from-blue-700 to-amber-400" />
          <p className="mx-auto mt-5 max-w-2xl leading-7 text-slate-600">
            Visionary leaders guiding academic excellence, discipline and holistic student development.
          </p>
        </div>

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

              {leader.theme && (
                <p className="mt-5 text-sm font-semibold italic text-slate-500">
                  “{leader.theme}”
                </p>
              )}

              <p className="mt-5 line-clamp-5 leading-7 text-slate-600">
                {leader.message}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
