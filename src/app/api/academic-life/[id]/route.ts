import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminRequest, unauthorizedResponse } from "@/lib/admin-auth";

interface Context {
  params: Promise<{ id: string }>;
}

export async function PUT(request: NextRequest, context: Context) {
  if (!isAdminRequest(request)) {
    return unauthorizedResponse();
  }

  try {
    const id = Number((await context.params).id);
    const body = await request.json();

    if (!Number.isInteger(id)) {
      return NextResponse.json(
        { message: "Invalid academic item ID." },
        { status: 400 }
      );
    }

    const item = await prisma.academicLifeItem.update({
      where: { id },
      data: {
        title: String(body.title || "").trim(),
        description: String(body.description || "").trim(),
        icon: String(body.icon || "📚").trim() || "📚",
        mediaUrl: String(body.mediaUrl || "").trim(),
        mediaType: body.mediaType === "video" ? "video" : "image",
        displayOrder: Number.isFinite(Number(body.displayOrder))
          ? Number(body.displayOrder)
          : 0,
        isPublished: body.isPublished !== false,
      },
    });

    return NextResponse.json(item);
  } catch (error) {
    console.error("PUT academic life error:", error);

    return NextResponse.json(
      { message: "Unable to update academic life item." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, context: Context) {
  if (!isAdminRequest(request)) {
    return unauthorizedResponse();
  }

  try {
    const id = Number((await context.params).id);

    if (!Number.isInteger(id)) {
      return NextResponse.json(
        { message: "Invalid academic item ID." },
        { status: 400 }
      );
    }

    await prisma.academicLifeItem.delete({ where: { id } });

    return NextResponse.json({
      message: "Academic life item deleted.",
    });
  } catch (error) {
    console.error("DELETE academic life error:", error);

    return NextResponse.json(
      { message: "Unable to delete academic life item." },
      { status: 500 }
    );
  }
}
