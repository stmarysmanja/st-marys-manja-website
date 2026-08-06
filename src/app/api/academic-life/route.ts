import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminRequest, unauthorizedResponse } from "@/lib/admin-auth";

export async function GET(request: NextRequest) {
  try {
    const admin = request.nextUrl.searchParams.get("admin") === "1";

    if (admin && !isAdminRequest(request)) {
      return unauthorizedResponse();
    }

    const items = await prisma.academicLifeItem.findMany({
      where: admin ? undefined : { isPublished: true },
      orderBy: [
        { displayOrder: "asc" },
        { createdAt: "asc" },
      ],
    });

    return NextResponse.json(items);
  } catch (error) {
    console.error("GET academic life error:", error);

    return NextResponse.json(
      { message: "Unable to load academic life items." },
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
      !String(body.description || "").trim() ||
      !String(body.mediaUrl || "").trim()
    ) {
      return NextResponse.json(
        { message: "Title, description and media are required." },
        { status: 400 }
      );
    }

    const item = await prisma.academicLifeItem.create({
      data: {
        title: String(body.title).trim(),
        description: String(body.description).trim(),
        icon: String(body.icon || "📚").trim() || "📚",
        mediaUrl: String(body.mediaUrl).trim(),
        mediaType: body.mediaType === "video" ? "video" : "image",
        displayOrder: Number.isFinite(Number(body.displayOrder))
          ? Number(body.displayOrder)
          : 0,
        isPublished: body.isPublished !== false,
      },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error("POST academic life error:", error);

    return NextResponse.json(
      { message: "Unable to add academic life item." },
      { status: 500 }
    );
  }
}
