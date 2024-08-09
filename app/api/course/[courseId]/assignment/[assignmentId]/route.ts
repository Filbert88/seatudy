import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

// Get Assignment by Assignment ID
export const GET = async (req: Request, { params }: { params: { courseId: string; assignmentId: string } }) => {
  const { courseId, assignmentId } = params;

  try {
    const assignment = await prisma.assignment.findUnique({
      where: {
        id: assignmentId,
      },
      include: {
        course: true,
        submissions: true,
      },
    });

    if (!assignment) {
      return NextResponse.json({ message: "No assignments found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Success", data: assignment }, { status: 200 });
  } catch (error) {
    console.error("Error in GET /api/course/[courseId]/assignment", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
};
