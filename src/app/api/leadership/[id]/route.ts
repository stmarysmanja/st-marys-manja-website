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
        { message: "Invalid leadership member ID." },
        { status: 400 }
      );
    }

    if (!body.name?.trim() || !body.role?.trim() || !body.message?.trim()) {
      return NextResponse.json(
        { message: "Name, role and message are required." },
        { status: 400 }
      );
    }

    const leader = await prisma.leadershipMember.update({
      where: { id: numericId },
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

    return NextResponse.json(leader);
  } catch (error) {
    console.error("PUT leadership error:", error);

    return NextResponse.json(
      { message: "Unable to update leadership member." },
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
        { message: "Invalid leadership member ID." },
        { status: 400 }
      );
    }

    await prisma.leadershipMember.delete({
      where: { id: numericId },
    });

    return NextResponse.json({
      message: "Leadership member deleted.",
    });
  } catch (error) {
    console.error("DELETE leadership error:", error);

    return NextResponse.json(
      { message: "Unable to delete leadership member." },
      { status: 500 }
    );
  }
}
