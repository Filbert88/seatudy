import { PrismaClient, Role } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options";
import { prisma } from "@/lib/prisma";

export const POST = async (req: Request, { params }: { params: { assignmentId: string } }) => {
  if (req.method !== "POST") {
    return new NextResponse(`Method ${req.method} Not Allowed`, { status: 405 });
  }

  const { assignmentId } = params;

  const session = await getServerSession({ req, ...authOptions });
  if (!session) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  if (session.user.role !== Role.INSTRUCTOR) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  try {
    const assignment = await prisma.assignment.findUnique({
      where: { id: assignmentId },
      include: {
        course: true,
      },
    });

    if (!assignment) {
      return NextResponse.json({ message: "Assignment not found" }, { status: 404 });
    }

    if (assignment.course.instructorId !== session.user.id) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { title, description, dueDateOffset } = body;

    const updateData: any = {};

    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (dueDateOffset) updateData.dueDateOffset = dueDateOffset;

    const updateAssignment = await prisma.assignment.update({
      where: { id: assignmentId },
      data: updateData,
    });

    return NextResponse.json({ message: "Success", data: updateAssignment }, { status: 201 });
  } catch (error: any) {
    console.error("Error in POST /api/course/[courseId]/assignment/[assignmentId]/update", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
};
