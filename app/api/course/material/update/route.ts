import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerAuthSession } from "@/app/api/auth/[...nextauth]/auth-options";

interface UpdateCourseMaterialData {
  title?: string;
  url?: string;
}

export async function POST(req: NextRequest) {
  if (req.method !== "POST") {
    return new NextResponse(`Method ${req.method} Not Allowed`, {
      status: 405,
    });
  }

  const session = await getServerAuthSession();

  if (!session) {
    return NextResponse.json(
      {
        message: "Unauthorized",
      },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const { materialId, title, url } = body;

    const data: UpdateCourseMaterialData = {};
    if (title) data.title = title;
    if (url) data.url = url;

    const courseMaterial = await prisma.courseMaterial.update({
      where: { id: materialId },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(courseMaterial);
  } catch (error) {
    console.error("Error updating course material:", error);
    return NextResponse.json(
      {
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
