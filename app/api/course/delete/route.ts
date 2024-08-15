import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options";
import { getServerSession } from "next-auth";
import { Role } from "@prisma/client";

export async function POST(req: NextRequest) {
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
    await prisma.courseProgress.deleteMany({
      where: { enrollment: { courseId } },
    });
    await prisma.courseMaterialAccess.deleteMany({
      where: { courseMaterial: { courseId } },
    });
    await prisma.courseMaterial.deleteMany({
      where: { courseId },
    });
    await prisma.assignment.deleteMany({
      where: { courseId },
    });
    await prisma.review.deleteMany({
      where: { courseId },
    });
    await prisma.forumComment.deleteMany({
      where: {
        post: {
          courseId,
        },
      },
    });
    await prisma.forumPost.deleteMany({
      where: { courseId },
    });
    await prisma.forum.deleteMany({
      where: { courseId },
    });

    await prisma.courseCategoryCourse.deleteMany({
      where: { courseId },
    });

    await prisma.courseEnrollment.deleteMany({
      where: { courseId },
    });

    await prisma.transaction.deleteMany({
      where: { courseId },
    });
    const deleteCourse = await prisma.course.delete({
      where: { id: courseId },
    });
    return NextResponse.json(
      { message: "Success", data: deleteCourse },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting course and related records:", error);
    return NextResponse.json(
      {
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
} 