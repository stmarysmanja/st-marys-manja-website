import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function NewsPage() {
  const articles = await prisma.newsArticle.findMany({
    where: {
      isPublished: true,
    },
    orderBy: [
      { isPinned: "desc" },
      { publishedAt: "desc" },
      { createdAt: "desc" },
    ],
  });

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="bg-blue-950 px-4 py-20 text-center text-white">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-sky-300">
          School Updates
        </p>
        <h1 className="mt-4 text-4xl font-extrabold md:text-6xl">
          News & Announcements
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-slate-300">
          Follow the latest academic, sports, events and school community updates.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16">
        {articles.length === 0 ? (
          <div className="rounded-3xl bg-white p-12 text-center shadow-sm">
            <h2 className="text-2xl font-extrabold text-blue-950">
              No published news yet
            </h2>
            <p className="mt-3 text-slate-600">
              Published school updates will appear here.
            </p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {articles.map((article) => (
              <article
                key={article.id}
                className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-500 hover:-translate-y-2 hover:shadow-2xl"
              >
                <div className="relative h-60 overflow-hidden bg-slate-200">
                  {article.featuredMediaUrl ? (
                    article.featuredMediaType === "video" ? (
                      <video
                        src={article.featuredMediaUrl}
                        muted
                        loop
                        autoPlay
                        playsInline
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <img
                        src={article.featuredMediaUrl}
                        alt={article.title}
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                      />
                    )
                  ) : (
                    <div className="flex h-full items-center justify-center bg-gradient-to-br from-blue-950 to-blue-700 text-4xl font-black text-white">
                      SM
                    </div>
                  )}

                  {article.isPinned && (
                    <span className="absolute left-4 top-4 rounded-full bg-amber-400 px-3 py-1 text-xs font-extrabold text-blue-950">
                      Pinned
                    </span>
                  )}
                </div>

                <div className="p-6">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
                    {article.category}
                  </p>

                  <h2 className="mt-3 text-2xl font-extrabold text-blue-950">
                    {article.title}
                  </h2>

                  <p className="mt-3 line-clamp-3 leading-7 text-slate-600">
                    {article.summary}
                  </p>

                  <div className="mt-5 flex items-center justify-between gap-4 text-xs font-semibold text-slate-400">
                    <span>{article.author}</span>
                    <span>
                      {new Date(
                        article.publishedAt || article.createdAt
                      ).toLocaleDateString()}
                    </span>
                  </div>

                  <Link
                    href={`/news/${article.slug}`}
                    className="mt-6 inline-flex rounded-xl bg-blue-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-800"
                  >
                    Read More →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
