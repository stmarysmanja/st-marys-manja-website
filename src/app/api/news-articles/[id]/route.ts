import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminRequest, unauthorizedResponse } from "@/lib/admin-auth";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PUT(
  request: NextRequest,
  context: RouteContext
) {
  if (!isAdminRequest(request)) {
    return unauthorizedResponse();
  }

  try {
    const { id } = await context.params;
    const numericId = Number(id);
    const body = await request.json();

    if (!Number.isInteger(numericId)) {
      return NextResponse.json(
        { message: "Invalid article ID." },
        { status: 400 }
      );
    }

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

    const existing = await prisma.newsArticle.findUnique({
      where: { id: numericId },
    });

    if (!existing) {
      return NextResponse.json(
        { message: "Article not found." },
        { status: 404 }
      );
    }

    const isPublished = body.isPublished === true;

    const article = await prisma.newsArticle.update({
      where: { id: numericId },
      data: {
        title: String(body.title).trim(),
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
        publishedAt:
          isPublished && !existing.publishedAt
            ? new Date()
            : isPublished
              ? existing.publishedAt
              : null,
      },
    });

    return NextResponse.json(article);
  } catch (error) {
    console.error("PUT news article error:", error);

    return NextResponse.json(
      { message: "Unable to update the news article." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  if (!isAdminRequest(request)) {
    return unauthorizedResponse();
  }

  try {
    const { id } = await context.params;
    const numericId = Number(id);

    if (!Number.isInteger(numericId)) {
      return NextResponse.json(
        { message: "Invalid article ID." },
        { status: 400 }
      );
    }

    await prisma.newsArticle.delete({
      where: { id: numericId },
    });

    return NextResponse.json({
      message: "News article deleted successfully.",
    });
  } catch (error) {
    console.error("DELETE news article error:", error);

    return NextResponse.json(
      { message: "Unable to delete the news article." },
      { status: 500 }
    );
  }
}
