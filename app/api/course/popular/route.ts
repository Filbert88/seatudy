import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

(BigInt.prototype as unknown as { toJSON: () => string }).toJSON = function () {
  return this.toString();
};

// Get All Popular Courses
export const GET = async () => {
  try {
    const courses = await prisma.course.findMany({
      orderBy: {
        enrollments: {
          _count: "desc",
        },
      },
      include: {
        enrollments: true,
        materials: true,
        categories: {
          include: {
            category: true,
          },
        },
      },
    });

    return NextResponse.json({ message: "Success", data: courses }, { status: 200 });
  } catch (error) {
    console.error("Error in GET /api/course/popular", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
};
