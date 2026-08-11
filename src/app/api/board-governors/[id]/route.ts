import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  isAdminRequest,
  unauthorizedResponse,
} from "@/lib/admin-auth";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
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
        {
          message:
            "Invalid Board member ID.",
        },
        { status: 400 }
      );
    }

    const name = String(body.name || "").trim();
    const position = String(
      body.position || ""
    ).trim();

    if (!name || !position) {
      return NextResponse.json(
        {
          message:
            "Name and position are required.",
        },
        { status: 400 }
      );
    }

    const governor =
      await prisma.boardGovernor.update({
        where: {
          id: numericId,
        },

        data: {
          name,
          position,

          photoUrl: body.photoUrl
            ? String(body.photoUrl).trim()
            : null,

          description: body.description
            ? String(body.description).trim()
            : null,

          displayOrder: Number(
            body.displayOrder || 0
          ),

          isPublished:
            body.isPublished === true,
        },
      });

    return NextResponse.json(governor);
  } catch (error) {
    console.error("PUT board governor error:", error);

    return NextResponse.json(
      {
        message:
          "Unable to update Board of Governors member.",
      },
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
        {
          message:
            "Invalid Board member ID.",
        },
        { status: 400 }
      );
    }

    await prisma.boardGovernor.delete({
      where: {
        id: numericId,
      },
    });

    return NextResponse.json({
      message:
        "Board of Governors member deleted successfully.",
    });
  } catch (error) {
    console.error("DELETE board governor error:", error);

    return NextResponse.json(
      {
        message:
          "Unable to delete Board of Governors member.",
      },
      { status: 500 }
    );
  }
}
