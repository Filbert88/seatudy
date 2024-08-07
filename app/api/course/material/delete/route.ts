import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerAuthSession } from "@/app/api/auth/[...nextauth]/auth-options";

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
    const { materialId } = body;

    const courseMaterial = await prisma.courseMaterial.delete({
      where: { id: materialId },
    });

    return NextResponse.json(courseMaterial);
  } catch (error) {
    console.error("Error deleting course material:", error);
    return NextResponse.json(
      {
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
