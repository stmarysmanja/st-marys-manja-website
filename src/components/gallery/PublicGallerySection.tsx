import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function PublicGallerySection() {
  const items = await prisma.galleryItem.findMany({
    where: {
      isPublished: true,
    },
    orderBy: [
      { displayOrder: "asc" },
      { createdAt: "desc" },
    ],
    take: 6,
  });

  if (items.length === 0) {
    return null;
  }

  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-600">
              School Life
            </p>
            <h2 className="mt-3 text-3xl font-extrabold text-blue-950 md:text-4xl">
              Latest From Our Gallery
            </h2>
            <p className="mt-4 max-w-2xl leading-7 text-slate-600">
              Explore memorable moments from academics, sports, trips and school activities.
            </p>
          </div>

          <Link
            href="/gallery"
            className="inline-flex w-fit rounded-xl bg-blue-700 px-6 py-3 font-bold text-white shadow-lg transition hover:-translate-y-1 hover:bg-blue-800"
          >
            View full gallery
          </Link>
        </div>

        <div className="mt-10 grid auto-rows-[220px] gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => (
            <article
              key={item.id}
              className={`group relative overflow-hidden rounded-3xl bg-slate-200 shadow-lg ${
                index === 0 ? "sm:row-span-2" : ""
              }`}
            >
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

              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent opacity-80 transition duration-500 group-hover:opacity-95" />

              <div className="absolute inset-x-0 bottom-0 translate-y-2 p-5 text-white transition duration-500 group-hover:translate-y-0">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-300">
                  {item.category}
                </p>
                <h3 className="mt-2 text-xl font-extrabold">
                  {item.title}
                </h3>
                {item.description && (
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-200 opacity-0 transition duration-500 group-hover:opacity-100">
                    {item.description}
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
