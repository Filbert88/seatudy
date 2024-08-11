import { NextRequest, NextResponse } from "next/server";
import { getServerAuthSession } from "../auth/[...nextauth]/auth-options";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  if (req.method !== "GET") {
    return new NextResponse(`Method ${req.method} Not Allowed`, {
      status: 405,
    });
  }

  const session = await getServerAuthSession();
  if (!session) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  const data = await req.json();
  const { userId, assignmentId } = data;

  if (!userId || !assignmentId) {
    return NextResponse.json(
      { message: "User ID and Assignment ID are required" },
      { status: 400 }
    );
  }

  try {
    const submission = await prisma.submission.findFirst({
      where: {
        studentId: userId,
        assignmentId: assignmentId,
      },
      select: {
        grade: true,
      },
    });

    if (!submission) {
      return NextResponse.json(
        { message: "No submission found for the given parameters" },
        { status: 404 }
      );
    }

    return NextResponse.json(submission);
  } catch (error) {
    console.error("Error retrieving user grade:", error);
    return NextResponse.json(
      {
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
