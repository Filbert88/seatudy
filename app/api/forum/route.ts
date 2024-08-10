import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerAuthSession } from "../auth/[...nextauth]/auth-options";

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

  const { courseId } = await req.json();

  if (!courseId) {
    return NextResponse.json(
      { message: "Course ID is required" },
      { status: 400 }
    );
  }

  try {
    const forum = await prisma.forum.findUnique({
      where: { id: courseId },
      include: {
        posts: {
          select: {
            id: true,
            title: true,
            content: true,
            createdAt: true,
            updatedAt: true,
            user: {
              select: {
                id: true,
                fullName: true,
              },
            },
            _count: {
              select: { comments: true },
            },
          },
        },
      },
    });

    if (!forum) {
      return NextResponse.json({ message: "Forum not found" }, { status: 404 });
    }

    return NextResponse.json(forum);
  } catch (error) {
    console.error("Error fetching forum data:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
