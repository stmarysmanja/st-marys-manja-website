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
        { message: "Invalid gallery item ID." },
        { status: 400 }
      );
    }

    if (!body.title?.trim() || !body.mediaUrl?.trim()) {
      return NextResponse.json(
        { message: "Title and media file are required." },
        { status: 400 }
      );
    }

    const item = await prisma.galleryItem.update({
      where: { id: numericId },
      data: {
        title: body.title.trim(),
        description: body.description?.trim() || null,
        category: body.category?.trim() || "General",
        mediaUrl: body.mediaUrl.trim(),
        mediaType: body.mediaType === "video" ? "video" : "image",
        displayOrder: Number.isFinite(Number(body.displayOrder))
          ? Number(body.displayOrder)
          : 0,
        isPublished: body.isPublished !== false,
      },
    });

    return NextResponse.json(item);
  } catch (error) {
    console.error("PUT gallery item error:", error);

    return NextResponse.json(
      { message: "Unable to update gallery item." },
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
        { message: "Invalid gallery item ID." },
        { status: 400 }
      );
    }

    await prisma.galleryItem.delete({
      where: { id: numericId },
    });

    return NextResponse.json({
      message: "Gallery item deleted.",
    });
  } catch (error) {
    console.error("DELETE gallery item error:", error);

    return NextResponse.json(
      { message: "Unable to delete gallery item." },
      { status: 500 }
    );
  }
}
