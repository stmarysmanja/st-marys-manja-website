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

    const allowed = ["New", "Read", "Handled"];

    if (!Number.isInteger(numericId) || !allowed.includes(body.status)) {
      return NextResponse.json(
        { message: "Invalid request." },
        { status: 400 }
      );
    }

    const message = await prisma.contactMessage.update({
      where: { id: numericId },
      data: { status: body.status },
    });

    return NextResponse.json(message);
  } catch (error) {
    console.error("PUT contact message error:", error);

    return NextResponse.json(
      { message: "Unable to update message." },
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
        { message: "Invalid message ID." },
        { status: 400 }
      );
    }

    await prisma.contactMessage.delete({
      where: { id: numericId },
    });

    return NextResponse.json({
      message: "Message deleted successfully.",
    });
  } catch (error) {
    console.error("DELETE contact message error:", error);

    return NextResponse.json(
      { message: "Unable to delete message." },
      { status: 500 }
    );
  }
}
