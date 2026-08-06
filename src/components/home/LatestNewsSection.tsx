import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function LatestNewsSection() {
  const articles = await prisma.newsArticle.findMany({
    where: {
      isPublished: true,
    },
    orderBy: [
      { isPinned: "desc" },
      { publishedAt: "desc" },
      { createdAt: "desc" },
    ],
    take: 3,
  });

  if (articles.length === 0) {
    return null;
  }

  return (
    <section className="bg-slate-50 py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-600">
              Stay Updated
            </p>
            <h2 className="mt-3 text-3xl font-extrabold text-blue-950 md:text-4xl">
              Latest News
            </h2>
            <p className="mt-4 max-w-2xl leading-7 text-slate-600">
              Read the latest stories, announcements and achievements from our school community.
            </p>
          </div>

          <Link
            href="/news"
            className="inline-flex w-fit rounded-xl bg-blue-700 px-6 py-3 font-bold text-white shadow-lg transition hover:-translate-y-1 hover:bg-blue-800"
          >
            View all news
          </Link>
        </div>

        <div className="mt-10 grid gap-7 md:grid-cols-2 xl:grid-cols-3">
          {articles.map((article) => (
            <article
              key={article.id}
              className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-500 hover:-translate-y-2 hover:shadow-xl"
            >
              <div className="h-56 overflow-hidden bg-slate-200">
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
                  <div className="flex h-full items-center justify-center bg-blue-950 text-4xl font-black text-white">
                    SM
                  </div>
                )}
              </div>

              <div className="p-6">
                <p className="text-xs font-bold uppercase tracking-wide text-blue-600">
                  {article.category}
                </p>

                <h3 className="mt-3 text-xl font-extrabold text-blue-950">
                  {article.title}
                </h3>

                <p className="mt-3 line-clamp-3 leading-7 text-slate-600">
                  {article.summary}
                </p>

                <Link
                  href={`/news/${article.slug}`}
                  className="mt-5 inline-flex text-sm font-bold text-blue-700 hover:underline"
                >
                  Read More →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
