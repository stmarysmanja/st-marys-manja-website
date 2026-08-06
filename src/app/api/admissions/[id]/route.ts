import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminRequest, unauthorizedResponse } from "@/lib/admin-auth";

interface RouteContext {
  params: Promise<{ id: string }>;
}

const allowedStatuses = ["New", "Reviewed", "Accepted", "Rejected"];

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
        { message: "Invalid application ID." },
        { status: 400 }
      );
    }

    if (!allowedStatuses.includes(body.status)) {
      return NextResponse.json(
        { message: "Invalid admission status." },
        { status: 400 }
      );
    }

    const application = await prisma.admissionApplication.update({
      where: { id: numericId },
      data: {
        status: body.status,
      },
    });

    return NextResponse.json(application);
  } catch (error) {
    console.error("PUT admission error:", error);

    return NextResponse.json(
      { message: "Unable to update the application." },
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
        { message: "Invalid application ID." },
        { status: 400 }
      );
    }

    await prisma.admissionApplication.delete({
      where: { id: numericId },
    });

    return NextResponse.json({
      message: "Application deleted successfully.",
    });
  } catch (error) {
    console.error("DELETE admission error:", error);

    return NextResponse.json(
      { message: "Unable to delete the application." },
      { status: 500 }
    );
  }
}
