import { put } from "@vercel/blob";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

function sanitizeFileName(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9.-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { error: "Vercel Blob is not configured. Add BLOB_READ_WRITE_TOKEN." },
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
        const safeName = sanitizeFileName(file.name || `image-${index + 1}.jpg`) || `image-${index + 1}.jpg`;
        const pathname = `vehicles/${Date.now()}-${crypto.randomUUID()}-${safeName}`;
        const blob = await put(pathname, file, {
          access: "public",
          contentType: file.type || "application/octet-stream",
          addRandomSuffix: false,
        });

        return {
          url: blob.url,
          pathname: blob.pathname,
          originalName: file.name,
          size: file.size,
        };
      })
    );

    return NextResponse.json({ files: uploads });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Image upload failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
