import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export const POST = async (req: Request, { params }: { params: { id: string } }) => {
  const courseId = params.id;
  try {
    const session = await getServerSession({ req, ...authOptions });
    if (!session) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }

    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) {
      return NextResponse.json({ message: "No courses found" }, { status: 404 });
    }

    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (!user) {
      return NextResponse.json({ message: "No users found" }, { status: 404 });
    }

    if (user.balance < course.price) {
      return NextResponse.json({ message: "Insufficient balance" }, { status: 400 });
    }

    const courseEnrollment = await prisma.courseEnrollment.create({
      data: {
        userId: session.user.id,
        courseId: course.id,
      },
    });

    return NextResponse.json({ message: "Success", data: courseEnrollment }, { status: 201 });
  } catch (error) {
    console.error("Error in GET /api/categories", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
};
