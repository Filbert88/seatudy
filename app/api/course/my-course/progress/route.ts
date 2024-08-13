import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options";

export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const courseId = searchParams.get("courseId");

  const session = await getServerSession({ req, ...authOptions });
  if (!session) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  try {
    const progress = await prisma.courseEnrollment.findFirst({
      where: {
        userId: session.user.id,
        courseId: courseId ? courseId : undefined,
      },
      include: {
        progress: true,
      },
    });

    if (!progress) {
      return NextResponse.json({ message: "No progress found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Success", data: progress }, { status: 200 });
  } catch (error) {
    console.error("Error in GET /api/course/[id]/progress", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
};
