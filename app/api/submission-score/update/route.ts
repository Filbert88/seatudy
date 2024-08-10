import { NextRequest, NextResponse } from "next/server";
import { getServerAuthSession } from "../../auth/[...nextauth]/auth-options";
import { NotificationType, Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { createNotification } from "@/lib/queries/notification";

export async function POST(req: NextRequest) {
  if (req.method !== "POST") {
    return new NextResponse(`Method ${req.method} Not Allowed`, {
      status: 405,
    });
  }

  const session = await getServerAuthSession();
  if (!session) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  if (session.user.role !== Role.INSTRUCTOR) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  try {
    const data = await req.json();
    const { id, content, grade } = data;

    if (!id || (content === undefined && grade === undefined)) {
      return NextResponse.json(
        {
          message: "Missing required fields or no update provided",
        },
        { status: 400 }
      );
    }

    const updatedSubmission = await prisma.submission.update({
      where: { id },
      data: { content, grade },
    });

    const assignment = await prisma.assignment.findUnique({
      where: { id: updatedSubmission.assignmentId },
      select: { title: true },
    });

    const student = await prisma.user.findUnique({
      where: { id: updatedSubmission.studentId },
      select: { id: true },
    });
    if (!student) {
      return NextResponse.json({ message: "No users found" }, { status: 404 });
    }

    await createNotification(student.id, `Your submission for ${assignment?.title} has been graded. Your new grade is ${grade}`, NotificationType.ASSIGNMENT_SUBMISSION);

    return NextResponse.json(updatedSubmission);
  } catch (error) {
    console.error("Error updating assignment score:", error);
    return NextResponse.json(
      {
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
