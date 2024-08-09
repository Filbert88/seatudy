import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

// Get All Assignment by Course Id
export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const courseId = searchParams.get("courseId");

  try {
    const assignments = await prisma.assignment.findMany({
      where: {
        courseId: courseId ? courseId : undefined,
      },
      include: {
        course: true,
        submissions: true,
      },
    });

    if (assignments.length == 0) {
      return NextResponse.json({ message: "No assignments found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Success", data: assignments }, { status: 200 });
  } catch (error) {
    console.error("Error in GET /api/course/[courseId]/assignment", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
};
