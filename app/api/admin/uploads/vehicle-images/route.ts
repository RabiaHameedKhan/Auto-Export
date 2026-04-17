import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { cloudinary } from "@/lib/cloudinary";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

function sanitizeFileName(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9.-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function uploadBuffer(buffer: Buffer, publicId: string) {
  return new Promise<{
    secure_url: string;
    public_id: string;
    bytes: number;
  }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "vehicles",
        public_id: publicId,
        resource_type: "image",
      },
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error("Image upload failed."));
          return;
        }

        resolve({
          secure_url: result.secure_url,
          public_id: result.public_id,
          bytes: result.bytes,
        });
      }
    );

    stream.end(buffer);
  });
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    return NextResponse.json(
      {
        error:
          "Cloudinary is not configured. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.",
      },
      { status: 500 }
    );
  }

  const formData = await request.formData();
  const files = formData
    .getAll("images")
    .filter((value): value is File => value instanceof File && value.size > 0);

  if (files.length === 0) {
    return NextResponse.json({ error: "Please choose at least one image." }, { status: 400 });
  }

  for (const file of files) {
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: `Only image files are allowed: ${file.name}` },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `Image is too large (max 10MB): ${file.name}` },
        { status: 400 }
      );
    }
  }

  try {
    const uploads = await Promise.all(
      files.map(async (file, index) => {
        const safeName =
          sanitizeFileName(file.name || `image-${index + 1}.jpg`) || `image-${index + 1}.jpg`;
        const publicId = `${Date.now()}-${crypto.randomUUID()}-${safeName.replace(/\.[^.]+$/, "")}`;
        const buffer = Buffer.from(await file.arrayBuffer());
        const uploaded = await uploadBuffer(buffer, publicId);

        return {
          url: uploaded.secure_url,
          pathname: uploaded.public_id,
          originalName: file.name,
          size: uploaded.bytes,
        };
      })
    );

    return NextResponse.json({ files: uploads });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Image upload failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
