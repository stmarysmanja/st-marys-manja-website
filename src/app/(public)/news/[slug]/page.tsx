import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

function getYouTubeEmbedUrl(url: string | null) {
  if (!url) {
    return null;
  }

  const match = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/
  );

  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
}

export default async function NewsArticlePage({
  params,
}: PageProps) {
  const { slug } = await params;

  const article = await prisma.newsArticle.findFirst({
    where: {
      slug,
      isPublished: true,
    },
  });

  if (!article) {
    notFound();
  }

  const youtubeEmbedUrl = getYouTubeEmbedUrl(article.youtubeUrl);

  return (
    <main className="min-h-screen bg-slate-50">
      <article className="mx-auto max-w-4xl px-4 py-16">
        <Link
          href="/news"
          className="text-sm font-bold text-blue-700 hover:underline"
        >
          ← Back to News
        </Link>

        <div className="mt-6 overflow-hidden rounded-3xl bg-white shadow-xl">
          {article.featuredMediaUrl && (
            <div className="h-[360px] bg-slate-200 md:h-[500px]">
              {article.featuredMediaType === "video" ? (
                <video
                  src={article.featuredMediaUrl}
                  controls
                  className="h-full w-full object-cover"
                />
              ) : (
                <img
                  src={article.featuredMediaUrl}
                  alt={article.title}
                  className="h-full w-full object-cover"
                />
              )}
            </div>
          )}

          <div className="p-7 md:p-12">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">
              {article.category}
            </p>

            <h1 className="mt-4 text-4xl font-extrabold leading-tight text-blue-950 md:text-5xl">
              {article.title}
            </h1>

            <div className="mt-5 flex flex-wrap gap-4 text-sm font-semibold text-slate-500">
              <span>{article.author}</span>
              <span>
                {new Date(
                  article.publishedAt || article.createdAt
                ).toLocaleDateString()}
              </span>
            </div>

            <p className="mt-8 text-xl leading-8 text-slate-700">
              {article.summary}
            </p>

            <div className="mt-8 whitespace-pre-wrap text-base leading-8 text-slate-700">
              {article.content}
            </div>

            {youtubeEmbedUrl && (
              <div className="mt-10 aspect-video overflow-hidden rounded-2xl bg-black">
                <iframe
                  src={youtubeEmbedUrl}
                  title={article.title}
                  allowFullScreen
                  className="h-full w-full border-0"
                />
              </div>
            )}
          </div>
        </div>
      </article>
    </main>
  );
}
