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

  return match
    ? `https://www.youtube.com/embed/${match[1]}`
    : null;
}

export default async function NewsArticlePage({
  params,
}: PageProps) {
  const { slug } = await params;

  const [article, settings] = await Promise.all([
    prisma.newsArticle.findFirst({
      where: {
        slug,
        isPublished: true,
      },
    }),

    prisma.newsSettings.upsert({
      where: { id: 1 },
      update: {},
      create: {
        id: 1,
        eyebrow: "School Updates",
        title: "News & Announcements",
        description:
          "Follow the latest academic, sports, events and school community updates.",
        emptyTitle: "No published news yet",
        emptyText: "Published school updates will appear here.",
        pinnedLabel: "Pinned",
        readMoreText: "Read More",
        backText: "Back to News",
      },
    }),
  ]);

  if (!article) {
    notFound();
  }

  const youtubeEmbedUrl = getYouTubeEmbedUrl(
    article.youtubeUrl
  );

  return (
    <main className="min-h-screen bg-slate-50">
      <article className="mx-auto max-w-4xl px-4 py-16">
        <Link
          href="/news"
          className="inline-flex items-center gap-2 text-sm font-bold text-blue-700 hover:underline"
        >
          ← {settings.backText}
        </Link>

        <div className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg">
          {article.featuredMediaUrl && (
            <div className="h-[420px] overflow-hidden bg-slate-200">
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

          <div className="p-7 md:p-10">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
              {article.category}
            </p>

            <h1
              className="mt-4 text-4xl font-extrabold leading-tight text-blue-950 md:text-5xl"
              style={{
                fontFamily:
                  'Georgia, "Times New Roman", serif',
              }}
            >
              {article.title}
            </h1>

            <div className="mt-5 flex flex-wrap gap-3 text-sm font-semibold text-slate-500">
              <span>{article.author}</span>
              <span>•</span>
              <span>
                {new Date(
                  article.publishedAt ||
                    article.createdAt
                ).toLocaleDateString()}
              </span>
            </div>

            <p className="mt-8 text-xl font-semibold leading-8 text-slate-700">
              {article.summary}
            </p>

            <div className="mt-8 whitespace-pre-line text-lg leading-9 text-slate-700">
              {article.content}
            </div>

            {youtubeEmbedUrl && (
              <div className="mt-10 aspect-video overflow-hidden rounded-2xl bg-black shadow-lg">
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
