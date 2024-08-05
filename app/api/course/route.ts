import { DifficultyLevel, PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

// Get All Courses
export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url);

  const title = searchParams.get("title");
  const categoryId = searchParams.get("categoryId");
  const difficulty = searchParams.get("difficulty") as DifficultyLevel;
  const rating = searchParams.get("rating");

  try {
    const courses = await prisma.course.findMany({
      where: {
        title: {
          contains: title ? title : undefined,
          mode: "insensitive",
        },
        categories: {
          some: {
            categoryId: categoryId ? categoryId : undefined,
          },
        },
        difficulty: difficulty ? difficulty : undefined,
        averageRating: rating ? parseFloat(rating) : undefined,
      },
      include: {
        enrollments: true,
        materials: true,
        categories: {
          include: {
            category: true,
          },
        },
        transactions: true,
      },
    });

    return NextResponse.json({ message: "Success", data: courses }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
