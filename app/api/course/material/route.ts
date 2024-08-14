import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

(BigInt.prototype as unknown as { toJSON: () => string }).toJSON = function () {
  return this.toString();
};

// Get All Popular Courses
export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const courseId = searchParams.get("courseId");

  try {
    const materials = await prisma.courseMaterial.findMany({
      where: {
        courseId: courseId ? courseId : undefined,
      },
      include: {
        accesses: true,
      },
    });

    return NextResponse.json({ message: "Success", data: materials }, { status: 200 });
  } catch (error) {
    console.error("Error in GET /api/course/material", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
};
