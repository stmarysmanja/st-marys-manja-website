import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminRequest, unauthorizedResponse } from "@/lib/admin-auth";

export async function GET() {
  try {
    const leaders = await prisma.leadershipMember.findMany({
      orderBy: [
        { displayOrder: "asc" },
        { createdAt: "asc" },
      ],
    });

    return NextResponse.json(leaders);
  } catch (error) {
    console.error("GET leadership error:", error);

    return NextResponse.json(
      { message: "Unable to load leadership members." },
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

    if (!body.name?.trim() || !body.role?.trim() || !body.message?.trim()) {
      return NextResponse.json(
        { message: "Name, role and message are required." },
        { status: 400 }
      );
    }

    const leader = await prisma.leadershipMember.create({
      data: {
        name: body.name.trim(),
        role: body.role.trim(),
        title: body.title?.trim() || null,
        photo: body.photo?.trim() || null,
        theme: body.theme?.trim() || null,
        message: body.message.trim(),
        displayOrder: Number.isFinite(Number(body.displayOrder))
          ? Number(body.displayOrder)
          : 0,
        isPublished: body.isPublished !== false,
      },
    });

    return NextResponse.json(leader, { status: 201 });
  } catch (error) {
    console.error("POST leadership error:", error);

    return NextResponse.json(
      { message: "Unable to create leadership member." },
      { status: 500 }
    );
  }
}
