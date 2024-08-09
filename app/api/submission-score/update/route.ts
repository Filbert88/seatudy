import { NextRequest, NextResponse } from "next/server";
import { getServerAuthSession } from "../../auth/[...nextauth]/auth-options";
import { Role } from "@prisma/client";
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
