import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  isAdminRequest,
  unauthorizedResponse,
} from "@/lib/admin-auth";

const defaults = {
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
};

export async function GET() {
  try {
    const settings = await prisma.newsSettings.upsert({
      where: { id: 1 },
      update: {},
      create: defaults,
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error("GET news settings error:", error);

    return NextResponse.json(
      { message: "Unable to load news settings." },
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
      pinnedLabel: String(body.pinnedLabel || "").trim(),
      readMoreText: String(body.readMoreText || "").trim(),
      backText: String(body.backText || "").trim(),
    };

    const settings = await prisma.newsSettings.upsert({
      where: { id: 1 },
      update: data,
      create: {
        id: 1,
        ...data,
      },
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error("PUT news settings error:", error);

    return NextResponse.json(
      { message: "Unable to save news settings." },
      { status: 500 }
    );
  }
}
