import { DifficultyLevel, PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

// Get All Popular Courses
export const GET = async (req: Request, { params }: { params: { id: string } }) => {
  const id = params.id;

  try {
    const courses = await prisma.course.findUnique({
      where: {
        id: id,
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
