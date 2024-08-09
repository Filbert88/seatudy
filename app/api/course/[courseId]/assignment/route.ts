import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

// Get All Assignment by Course Id
export const GET = async (req: Request, { params }: { params: { courseId: string } }) => {
  const courseId = params.courseId;

  try {
    const assignments = await prisma.assignment.findMany({
      where: {
        courseId: courseId,
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
