import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

(BigInt.prototype as unknown as { toJSON: () => string }).toJSON = function () {
  return this.toString();
};

// Get All Popular Courses
export const GET = async (req: Request, { params }: { params: { courseId: string } }) => {
  const courseId = params.courseId;

  try {
    const course = await prisma.course.findUnique({
      where: {
        id: courseId,
      },
      include: {
        enrollments: {
          include: {
            user: {
              select: {
                fullName: true,
                profileUrl: true,
              },
            },
            progress: {
              select: {
                progressPct: true,
              },
            },
          },
        },
        materials: {
          orderBy: {
            createdAt: "asc",
          },
        },
        categories: {
          include: {
            category: true,
          },
        },
        instructor: {
          select: {
            fullName: true,
          },
        },
        assignments: true,
      },
    });

    if (!course) {
      return NextResponse.json({ message: "No courses found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Success", data: course }, { status: 200 });
  } catch (error) {
    console.error("Error in GET /api/course/[id]", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
};
