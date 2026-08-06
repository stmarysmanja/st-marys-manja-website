import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminRequest, unauthorizedResponse } from "@/lib/admin-auth";

export async function GET() {
  try {
    return NextResponse.json(
      await prisma.heroSlide.findMany({
        orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }],
      })
    );
  } catch {
    return NextResponse.json(
      { message: "Unable to load hero slides." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  if (!isAdminRequest(request)) return unauthorizedResponse();

  try {
    const body = await request.json();

    const slide = await prisma.heroSlide.create({
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

    return NextResponse.json(slide, { status: 201 });
  } catch {
    return NextResponse.json(
      { message: "Unable to create hero slide." },
      { status: 500 }
    );
  }
}
