import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { courseId } = await req.json();

  if (!courseId) {
    return NextResponse.json(
      { message: "Course ID is required" },
      { status: 400 }
    );
  }

  try {
    const reviews = await prisma.review.findMany({
      where: { courseId },
      select: {
        id: true,
        content: true,
        rating: true,
        user: {
          select: {
            id: true,
            fullName: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      {
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
