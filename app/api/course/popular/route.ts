import { DifficultyLevel, PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

// Get All Popular Courses
export const GET = async (req: Request) => {
  try {
    const courses = await prisma.course.findMany({
      orderBy: {
        enrollments: {
          _count: "desc",
        },
      },
      take: 10,
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
    console.error("Error in GET /api/course/popular", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
};
