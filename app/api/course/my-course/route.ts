import { Role, Course } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/auth-options";
import { prisma } from "@/lib/prisma";

(BigInt.prototype as unknown as { toJSON: () => string }).toJSON = function () {
  return this.toString();
};

export const GET = async (req: Request) => {
  const session = await getServerSession({ req, ...authOptions });
  if (!session) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  const role = session.user.role;
  const userId = session.user.id;

  try {
    let courses: Course[] = [];
    if (role === Role.INSTRUCTOR) {
      courses = await prisma.course.findMany({
        where: {
          instructorId: userId,
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
    }

    if (role === Role.USER) {
      courses = await prisma.course.findMany({
        where: {
          enrollments: {
            some: {
              userId: userId,
            },
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
          transactions: true,
        },
      });
    }

    if (courses.length == 0) {
      return NextResponse.json(
        { message: "No courses found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Success", data: courses },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in GET /api/courses/my-course", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
};
