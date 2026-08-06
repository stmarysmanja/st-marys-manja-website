import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

const MAX_IMAGE_SIZE = 8 * 1024 * 1024;
const MAX_VIDEO_SIZE = 50 * 1024 * 1024;

const allowedImageTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

const allowedVideoTypes = [
  "video/mp4",
  "video/webm",
  "video/ogg",
];

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const uploadedFile = formData.get("file");

    if (!(uploadedFile instanceof File)) {
      return NextResponse.json(
        { message: "Please select a valid file." },
        { status: 400 }
      );
    }

    const isImage = allowedImageTypes.includes(uploadedFile.type);
    const isVideo = allowedVideoTypes.includes(uploadedFile.type);

    if (!isImage && !isVideo) {
      return NextResponse.json(
        {
          message:
            "Only JPG, PNG, WEBP, GIF, MP4, WEBM and OGG files are allowed.",
        },
        { status: 400 }
      );
    }

    const maximumSize = isVideo ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE;

    if (uploadedFile.size > maximumSize) {
      return NextResponse.json(
        {
          message: isVideo
            ? "Video must be smaller than 50 MB."
            : "Image must be smaller than 8 MB.",
        },
        { status: 400 }
      );
    }

    const extension = path.extname(uploadedFile.name).toLowerCase();
    const originalName = path
      .basename(uploadedFile.name, extension)
      .replace(/[^a-zA-Z0-9-_]/g, "-")
      .replace(/-+/g, "-");

    const uniqueName = `${Date.now()}-${originalName}${extension}`;
    const uploadDirectory = path.join(
      process.cwd(),
      "public",
      "uploads"
    );

    await mkdir(uploadDirectory, { recursive: true });

    const bytes = await uploadedFile.arrayBuffer();
    const buffer = Buffer.from(bytes);

    await writeFile(
      path.join(uploadDirectory, uniqueName),
      buffer
    );

    return NextResponse.json({
      url: `/uploads/${uniqueName}`,
      mediaType: isVideo ? "video" : "image",
      fileName: uniqueName,
    });
  } catch (error) {
    console.error("Media upload error:", error);

    return NextResponse.json(
      { message: "Unable to upload the selected file." },
      { status: 500 }
    );
  }
}