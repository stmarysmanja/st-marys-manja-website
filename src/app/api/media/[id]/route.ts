import { unlink } from "fs/promises";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminRequest, unauthorizedResponse } from "@/lib/admin-auth";

export const runtime = "nodejs";

interface Context {
  params: Promise<{ id: string }>;
}

export async function PUT(request: NextRequest, context: Context) {
  if (!isAdminRequest(request)) return unauthorizedResponse();

  try {
    const id = Number((await context.params).id);
    const body = await request.json();

    if (!Number.isInteger(id)) {
      return NextResponse.json({ message: "Invalid media ID." }, { status: 400 });
    }

    const asset = await prisma.mediaAsset.update({
      where: { id },
      data: {
        name: String(body.name || "").trim(),
        category: String(body.category || "General").trim() || "General",
      },
    });

    return NextResponse.json(asset);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Unable to update media." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, context: Context) {
  if (!isAdminRequest(request)) return unauthorizedResponse();

  try {
    const id = Number((await context.params).id);
    const asset = await prisma.mediaAsset.findUnique({ where: { id } });

    if (!asset) {
      return NextResponse.json({ message: "Media not found." }, { status: 404 });
    }

    try {
      await unlink(
        path.join(process.cwd(), "public", "uploads", "media", asset.storedName)
      );
    } catch {}

    await prisma.mediaAsset.delete({ where: { id } });
    return NextResponse.json({ message: "Media deleted." });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Unable to delete media." },
      { status: 500 }
    );
  }
}
