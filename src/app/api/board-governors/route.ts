import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  isAdminRequest,
  unauthorizedResponse,
} from "@/lib/admin-auth";

export async function GET(request: NextRequest) {
  try {
    const adminView =
      request.nextUrl.searchParams.get("admin") === "1";

    if (adminView && !isAdminRequest(request)) {
      return unauthorizedResponse();
    }

    const governors = await prisma.boardGovernor.findMany({
      where: adminView
        ? undefined
        : {
            isPublished: true,
          },

      orderBy: [
        { displayOrder: "asc" },
        { createdAt: "asc" },
      ],
    });

    return NextResponse.json(governors);
  } catch (error) {
    console.error("GET board governors error:", error);

    return NextResponse.json(
      {
        message:
          "Unable to load Board of Governors members.",
      },
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
      await prisma.boardGovernor.create({
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
            body.isPublished !== false,
        },
      });

    return NextResponse.json(
      governor,
      { status: 201 }
    );
  } catch (error) {
    console.error("POST board governor error:", error);

    return NextResponse.json(
      {
        message:
          "Unable to create Board of Governors member.",
      },
      { status: 500 }
    );
  }
}
