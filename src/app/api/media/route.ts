import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminRequest, unauthorizedResponse } from "@/lib/admin-auth";

export const runtime = "nodejs";

const allowed = new Map<string, "image" | "video" | "document">([
  ["image/jpeg", "image"], ["image/png", "image"], ["image/webp", "image"],
  ["image/gif", "image"], ["video/mp4", "video"], ["video/webm", "video"],
  ["video/ogg", "video"], ["application/pdf", "document"],
  ["application/msword", "document"],
  ["application/vnd.openxmlformats-officedocument.wordprocessingml.document", "document"],
  ["application/vnd.ms-excel", "document"],
  ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "document"],
  ["text/plain", "document"],
]);

export async function GET(request: NextRequest) {
  if (!isAdminRequest(request)) return unauthorizedResponse();

  try {
    return NextResponse.json(
      await prisma.mediaAsset.findMany({ orderBy: { createdAt: "desc" } })
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Unable to load media." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  if (!isAdminRequest(request)) return unauthorizedResponse();

  try {
    const form = await request.formData();
    const category = String(form.get("category") || "General").trim() || "General";
    const uploads = form.getAll("files").filter((item): item is File => item instanceof File);

    if (!uploads.length || uploads.length > 20) {
      return NextResponse.json(
        { message: "Select between 1 and 20 files." },
        { status: 400 }
      );
    }

    const folder = path.join(process.cwd(), "public", "uploads", "media");
    await mkdir(folder, { recursive: true });
    const created = [];

    for (const file of uploads) {
      const kind = allowed.get(file.type);
      if (!kind) {
        return NextResponse.json(
          { message: `Unsupported file: ${file.name}` },
          { status: 400 }
        );
      }

      if (file.size > 10 * 1024 * 1024) {
        return NextResponse.json(
          { message: `${file.name} exceeds 10 MB.` },
          { status: 400 }
        );
      }

      const extension = path.extname(file.name).toLowerCase();
      const cleanName = path
        .basename(file.name, extension)
        .replace(/[^a-zA-Z0-9-_]/g, "-")
        .replace(/-+/g, "-") || "media";

      const storedName = `${Date.now()}-${crypto.randomUUID()}-${cleanName}${extension}`;
      const url = `/uploads/media/${storedName}`;

      await writeFile(
        path.join(folder, storedName),
        Buffer.from(await file.arrayBuffer())
      );

      created.push(
        await prisma.mediaAsset.create({
          data: {
            name: file.name,
            storedName,
            url,
            kind,
            mimeType: file.type,
            size: file.size,
            category,
          },
        })
      );
    }

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Unable to upload media." },
      { status: 500 }
    );
  }
}
