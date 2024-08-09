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
    const { postId, content } = await req.json();

    if (!content) {
      return NextResponse.json(
        {
          message: "Content is required for the comment",
        },
        { status: 400 }
      );
    }

    const comment = await prisma.forumComment.create({
      data: {
        content,
        postId,
        userId: session.user.id,
      },
    });

    return NextResponse.json(comment);
  } catch (error) {
    console.error("Error creating forum comment:", error);
    return NextResponse.json(
      {
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
