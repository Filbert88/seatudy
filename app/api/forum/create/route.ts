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

    let forum = await prisma.forum.findFirst({
      where: { courseId: courseId },
    });

    if (!forum) {
      forum = await prisma.forum.create({
        data: {
          courseId: courseId,
        },
      });
    }

    if (!forum) {
      return NextResponse.json(
        {
          message: "Failed to create or retrieve the forum",
        },
        { status: 500 }
      );
    }

    const post = await prisma.forumPost.create({
      data: {
        title: postTitle,
        content: postContent,
        userId: session.user.id,
        forumId: forum.id,
        courseId: courseId,
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
          },
        },
      },
    });

    return NextResponse.json({
      forumId: forum.id,
      postId: post.id,
      title: post.title,
      content: post.content,
      createdAt: post.createdAt,
      user: post.user,
    });
  } catch (error) {
    console.error("Error creating forum or forum post:", error);
    return NextResponse.json(
      {
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
