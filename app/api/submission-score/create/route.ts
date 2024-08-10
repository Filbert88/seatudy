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
    const { content, grade, assignmentId, studentId } = data;

    if (!content || grade === undefined || !assignmentId || !studentId) {
      return NextResponse.json(
        {
          message: "Missing required fields",
        },
        { status: 400 }
      );
    }

    const submission = await prisma.submission.create({
      data: {
        content,
        grade,
        assignment: { connect: { id: assignmentId } },
        student: { connect: { id: studentId } },
      },
    });

    const assignment = await prisma.assignment.findUnique({
      where: { id: assignmentId },
      select: { title: true },
    });

    await createNotification(studentId, `Your submission for ${assignment?.title} has been graded. Your new grade is ${grade}`, NotificationType.ASSIGNMENT_SUBMISSION);

    return NextResponse.json(submission);
  } catch (error) {
    console.error("Error creating assignment score:", error);
    return NextResponse.json(
      {
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
