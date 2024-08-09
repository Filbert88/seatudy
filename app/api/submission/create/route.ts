import { NextRequest, NextResponse } from "next/server";
import { getServerAuthSession } from "../../auth/[...nextauth]/auth-options";
import { prisma } from "@/lib/prisma";

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

  try {
    const data = await req.json();
    const { content, assignmentId } = data;

    if (!content || !assignmentId) {
      return NextResponse.json(
        {
          message:
            "Missing required fields: content and assignmentId are required",
        },
        { status: 400 }
      );
    }

    const submission = await prisma.submission.create({
      data: {
        content,
        assignment: { connect: { id: assignmentId } },
        student: { connect: { id: session.user.id } },
        grade: null,
      },
    });

    return NextResponse.json(submission);
  } catch (error) {
    console.error("Error submitting assignment:", error);
    return NextResponse.json(
      {
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
