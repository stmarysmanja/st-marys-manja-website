import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminRequest, unauthorizedResponse } from "@/lib/admin-auth";

function createSlug(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function createUniqueSlug(title: string) {
  const base = createSlug(title) || `article-${Date.now()}`;
  let slug = base;
  let counter = 1;

  while (
    await prisma.newsArticle.findUnique({
      where: { slug },
      select: { id: true },
    })
  ) {
    slug = `${base}-${counter}`;
    counter += 1;
  }

  return slug;
}

export async function GET(request: NextRequest) {
  try {
    const adminView = request.nextUrl.searchParams.get("admin") === "1";

    if (adminView && !isAdminRequest(request)) {
      return unauthorizedResponse();
    }

    const articles = await prisma.newsArticle.findMany({
      where: adminView
        ? undefined
        : {
            isPublished: true,
          },
      orderBy: [
        { isPinned: "desc" },
        { publishedAt: "desc" },
        { createdAt: "desc" },
      ],
    });

    return NextResponse.json(articles);
  } catch (error) {
    console.error("GET news articles error:", error);

    return NextResponse.json(
      { message: "Unable to load news articles." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return unauthorizedResponse();
  }

  try {
    const body = await request.json();

    if (
      !String(body.title || "").trim() ||
      !String(body.summary || "").trim() ||
      !String(body.content || "").trim()
    ) {
      return NextResponse.json(
        { message: "Title, summary and article content are required." },
        { status: 400 }
      );
    }

    const title = String(body.title).trim();
    const slug = await createUniqueSlug(title);
    const isPublished = body.isPublished === true;

    const article = await prisma.newsArticle.create({
      data: {
        title,
        slug,
        summary: String(body.summary).trim(),
        content: String(body.content).trim(),
        category: String(body.category || "General").trim() || "General",
        author: String(body.author || "School Administration").trim(),
        featuredMediaUrl: body.featuredMediaUrl
          ? String(body.featuredMediaUrl).trim()
          : null,
        featuredMediaType:
          body.featuredMediaType === "video" ? "video" : "image",
        youtubeUrl: body.youtubeUrl
          ? String(body.youtubeUrl).trim()
          : null,
        isPublished,
        isPinned: body.isPinned === true,
        publishedAt: isPublished ? new Date() : null,
      },
    });

    return NextResponse.json(article, { status: 201 });
  } catch (error) {
    console.error("POST news article error:", error);

    return NextResponse.json(
      { message: "Unable to create the news article." },
      { status: 500 }
    );
  }
}
