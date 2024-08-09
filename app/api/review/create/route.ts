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

  const { courseId, content, rating } = await req.json();

  if (
    !courseId ||
    !content ||
    rating === undefined ||
    rating < 1 ||
    rating > 5
  ) {
    return NextResponse.json(
      { message: "Course ID, content, and valid rating are required" },
      { status: 400 }
    );
  }

  try {
    const newReview = await prisma.review.create({
      data: {
        content,
        rating,
        course: {
          connect: { id: courseId },
        },
        user: {
          connect: { id: session.user.id },
        },
      },
    });

    const reviews = await prisma.review.findMany({
      where: { courseId },
      select: { rating: true },
    });

    const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
    const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;

    await prisma.course.update({
      where: { id: courseId },
      data: { averageRating },
    });

    return NextResponse.json({
      message: "Review submitted successfully",
      review: newReview,
      updatedAverageRating: averageRating,
    });
  } catch (error) {
    console.error("Error creating review and updating average rating:", error);
    return NextResponse.json(
      {
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
