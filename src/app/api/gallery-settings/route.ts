import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  isAdminRequest,
  unauthorizedResponse,
} from "@/lib/admin-auth";

const defaults = {
  id: 1,
  eyebrow: "School Life",
  title: "School Gallery",
  description:
    "Highlights of academic activities, sports events, educational trips and co-curricular life at St Mary's Secondary School-Manja.",
  emptyTitle: "Gallery Coming Soon",
  emptyText:
    "Photographs and videos will appear here after they are published from the Admin Portal.",
};

export async function GET() {
  try {
    const settings = await prisma.gallerySettings.upsert({
      where: { id: 1 },
      update: {},
      create: defaults,
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error("GET gallery settings error:", error);

    return NextResponse.json(
      { message: "Unable to load gallery settings." },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return unauthorizedResponse();
  }

  try {
    const body = await request.json();

    const data = {
      eyebrow: String(body.eyebrow || "").trim(),
      title: String(body.title || "").trim(),
      description: String(body.description || "").trim(),
      emptyTitle: String(body.emptyTitle || "").trim(),
      emptyText: String(body.emptyText || "").trim(),
    };

    const settings = await prisma.gallerySettings.upsert({
      where: { id: 1 },
      update: data,
      create: {
        id: 1,
        ...data,
      },
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error("PUT gallery settings error:", error);

    return NextResponse.json(
      { message: "Unable to save gallery settings." },
      { status: 500 }
    );
  }
}
