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

  if (session.user.role !== "INSTRUCTOR" && session.user.role !== "ADMIN") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  try {
    const submissions = await prisma.submission.findMany({
      include: {
        assignment: true,
        student: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(submissions);
  } catch (error) {
    console.error("Error retrieving submissions:", error);
    return NextResponse.json(
      {
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
