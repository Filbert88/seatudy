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

    let forum = await prisma.forum.findUnique({
      where: { courseId },
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
          },
        },
      },
    });

    if (!forum) {
      forum = await prisma.forum.create({
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
    } else {
      const post = await prisma.forumPost.create({
        data: {
          title: postTitle,
          content: postContent,
          userId: session.user.id,
          forumId: forum.id,
          courseId,
        },
      });

      forum.posts.push(post);
    }

    const newPost = forum.posts[forum.posts.length - 1];

    return NextResponse.json({
      forumId: forum.id,
      postId: newPost.id,          
      title: newPost.title,
      content: newPost.content,
      createdAt: newPost.createdAt,
      user: newPost.user,
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
