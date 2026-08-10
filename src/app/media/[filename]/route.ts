import { readFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

interface RouteContext {
  params: Promise<{
    filename: string;
  }>;
}

function contentType(filename: string) {
  const extension =
    path.extname(filename).toLowerCase();

  switch (extension) {
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".png":
      return "image/png";
    case ".webp":
      return "image/webp";
    case ".gif":
      return "image/gif";
    case ".mp4":
      return "video/mp4";
    case ".webm":
      return "video/webm";
    case ".ogg":
      return "video/ogg";
    default:
      return "application/octet-stream";
  }
}

export async function GET(
  request: Request,
  context: RouteContext
) {
  try {
    const { filename } =
      await context.params;

    const safeName =
      path.basename(filename);

    if (safeName !== filename) {
      return new NextResponse(
        "Invalid filename.",
        { status: 400 }
      );
    }

    const volumeRoot =
      process.env.RAILWAY_VOLUME_MOUNT_PATH;

    const filePath = volumeRoot
      ? path.join(
          volumeRoot,
          "uploads",
          safeName
        )
      : path.join(
          process.cwd(),
          "public",
          "uploads",
          safeName
        );

    const file = await readFile(filePath);

    return new NextResponse(file, {
      headers: {
        "Content-Type":
          contentType(safeName),
        "Cache-Control":
          "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new NextResponse(
      "File not found.",
      { status: 404 }
    );
  }
}
