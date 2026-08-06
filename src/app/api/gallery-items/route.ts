import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminRequest, unauthorizedResponse } from "@/lib/admin-auth";

export async function GET() {
  try {
    const items = await prisma.galleryItem.findMany({
      orderBy: [
        { displayOrder: "asc" },
        { createdAt: "desc" },
      ],
    });

    return NextResponse.json(items);
  } catch (error) {
    console.error("GET gallery items error:", error);

    return NextResponse.json(
      { message: "Unable to load gallery items." },
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

    if (!body.title?.trim() || !body.mediaUrl?.trim()) {
      return NextResponse.json(
        { message: "Title and media file are required." },
        { status: 400 }
      );
    }

    const mediaType =
      body.mediaType === "video" ? "video" : "image";

    const item = await prisma.galleryItem.create({
      data: {
        title: body.title.trim(),
        description: body.description?.trim() || null,
        category: body.category?.trim() || "General",
        mediaUrl: body.mediaUrl.trim(),
        mediaType,
        displayOrder: Number.isFinite(Number(body.displayOrder))
          ? Number(body.displayOrder)
          : 0,
        isPublished: body.isPublished !== false,
      },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error("POST gallery item error:", error);

    return NextResponse.json(
      { message: "Unable to create gallery item." },
      { status: 500 }
    );
  }
}
