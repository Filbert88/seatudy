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
    const { courseId, postTitle, postContent } = await req.json();

    if (!courseId || !postTitle || !postContent) {
      return NextResponse.json(
        {
          message: "Course ID, post title, and post content are required",
        },
        { status: 400 }
      );
    }

    const forum = await prisma.forum.create({
      data: {
        courseId,
        posts: {
          create: {
            title: postTitle,
            content: postContent,
            userId: session.user.id,
            courseId,
          },
        },
      },
      include: {
        posts: true,
      },
    });

    return NextResponse.json(forum);
  } catch (error) {
    console.error("Error creating forum and initial post:", error);
    return NextResponse.json(
      {
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
