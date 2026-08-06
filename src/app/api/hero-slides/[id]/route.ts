import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminRequest, unauthorizedResponse } from "@/lib/admin-auth";

interface Context {
  params: Promise<{ id: string }>;
}

export async function PUT(request: NextRequest, context: Context) {
  if (!isAdminRequest(request)) return unauthorizedResponse();

  try {
    const id = Number((await context.params).id);
    const body = await request.json();

    const slide = await prisma.heroSlide.update({
      where: { id },
      data: {
        imageUrl: String(body.imageUrl || "").trim(),
        altText: String(body.altText || "School activity").trim(),
        mediaType: body.mediaType === "video" ? "video" : "image",
        title: String(body.title || "").trim() || null,
        subtitle: String(body.subtitle || "").trim() || null,
        buttonText: String(body.buttonText || "").trim() || null,
        buttonLink: String(body.buttonLink || "").trim() || null,
        displayOrder: Number(body.displayOrder || 0),
        isPublished: body.isPublished !== false,
      },
    });

    return NextResponse.json(slide);
  } catch {
    return NextResponse.json(
      { message: "Unable to update hero slide." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, context: Context) {
  if (!isAdminRequest(request)) return unauthorizedResponse();

  try {
    const id = Number((await context.params).id);
    await prisma.heroSlide.delete({ where: { id } });
    return NextResponse.json({ message: "Hero slide deleted." });
  } catch {
    return NextResponse.json(
      { message: "Unable to delete hero slide." },
      { status: 500 }
    );
  }
}
