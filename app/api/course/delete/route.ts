import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authOptions, getServerAuthSession } from "@/app/api/auth/[...nextauth]/auth-options";
import { getServerSession } from "next-auth";
import { Role } from "@prisma/client";

export async function POST(req: NextRequest) {
  if (req.method !== "POST") {
    return new NextResponse(`Method ${req.method} Not Allowed`, {
      status: 405,
    });
  }

  const session = await getServerSession({ req, ...authOptions });
  if (!session) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  if (session.user.role !== Role.INSTRUCTOR) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { courseId } = body;

    const deleteCourse = await prisma.course.delete({
      where: { id: courseId },
    });

    return NextResponse.json({ message: "Success", data: deleteCourse }, { status: 200 });
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
