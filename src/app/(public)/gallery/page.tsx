import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const [settings, items] = await Promise.all([
    prisma.gallerySettings.upsert({
      where: { id: 1 },
      update: {},
      create: {
        id: 1,
        eyebrow: "School Life",
        title: "School Gallery",
        description:
          "Highlights of academic activities, sports events, educational trips and co-curricular life at St Mary's Secondary School-Manja.",
        emptyTitle: "Gallery Coming Soon",
        emptyText:
          "Photographs and videos will appear here after they are published from the Admin Portal.",
      },
    }),

    prisma.galleryItem.findMany({
      where: {
        isPublished: true,
      },
      orderBy: [
        {
          displayOrder: "asc",
        },
        {
          createdAt: "desc",
        },
      ],
    }),
  ]);

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="bg-gradient-to-br from-[#061d53] via-[#08296f] to-[#2453d4] px-4 py-20 text-center text-white">
        <p className="text-xs font-black uppercase tracking-[0.28em] text-blue-200">
          {settings.eyebrow}
        </p>

        <h1
          className="mt-4 text-4xl font-extrabold md:text-6xl"
          style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
        >
          {settings.title}
        </h1>

        <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-blue-100">
          {settings.description}
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16">
        {items.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <h2 className="text-2xl font-extrabold text-blue-950">
              {settings.emptyTitle}
            </h2>

            <p className="mx-auto mt-3 max-w-2xl leading-7 text-slate-600">
              {settings.emptyText}
            </p>
          </div>
        ) : (
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <article
                key={item.id}
                className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg transition duration-500 hover:-translate-y-2 hover:shadow-2xl"
              >
                <div className="h-72 overflow-hidden bg-slate-200">
                  {item.mediaType === "video" ? (
                    <video
                      src={item.mediaUrl}
                      controls
                      muted
                      loop
                      playsInline
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <img
                      src={item.mediaUrl}
                      alt={item.title}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    />
                  )}
                </div>

                <div className="p-6">
                  <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-blue-700">
                    {item.category}
                  </span>

                  <h2 className="mt-4 text-xl font-extrabold text-blue-950">
                    {item.title}
                  </h2>

                  {item.description && (
                    <p className="mt-3 leading-7 text-slate-600">
                      {item.description}
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
