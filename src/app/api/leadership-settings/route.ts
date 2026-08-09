import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  isAdminRequest,
  unauthorizedResponse,
} from "@/lib/admin-auth";

const defaults = {
  id: 1,
  eyebrow: "Meet Our Team",
  title: "School Leadership",
  description:
    "Visionary leaders guiding academic excellence, discipline and holistic student development.",
  emptyText:
    "Leadership profiles will appear here after they are published from the Admin Portal.",
};

export async function GET() {
  try {
    const settings = await prisma.leadershipSettings.upsert({
      where: { id: 1 },
      update: {},
      create: defaults,
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error("GET leadership settings error:", error);

    return NextResponse.json(
      { message: "Unable to load leadership settings." },
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
      emptyText: String(body.emptyText || "").trim(),
    };

    const settings = await prisma.leadershipSettings.upsert({
      where: { id: 1 },
      update: data,
      create: {
        id: 1,
        ...data,
      },
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error("PUT leadership settings error:", error);

    return NextResponse.json(
      { message: "Unable to save leadership settings." },
      { status: 500 }
    );
  }
}
