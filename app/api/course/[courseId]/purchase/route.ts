import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options";
import { prisma } from "@/lib/prisma";
import { TransactionType } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export const POST = async (req: Request, { params }: { params: { courseId: string } }) => {
  if (req.method !== "POST") {
    return new NextResponse(`Method ${req.method} Not Allowed`, { status: 405 });
  }

  const courseId = params.courseId;

  const session = await getServerSession({ req, ...authOptions });
  if (!session) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  try {
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

    const body = await req.json();

    const { cardNumber, expirationDate, cvc, cardHolderName } = body;

    const alredyEnrolled = await prisma.courseEnrollment.findFirst({
      where: {
        userId: session.user.id,
        courseId: course.id,
      },
    });
    if (alredyEnrolled) {
      return NextResponse.json({ message: "Already purchased this course" }, { status: 400 });
    }

    const newData: any = {
      userId: session.user.id,
      courseId: course.id,
      amount: course.price,
      cardNumber,
      expirationDate,
      cvc,
      cardHolderName,
      type: TransactionType.PURCHASE,
    };

    const transaction = await prisma.transaction.create({
      data: newData,
    });

    if (transaction.userId && transaction.courseId) {
      await prisma.courseEnrollment.create({
        data: {
          userId: transaction.userId,
          courseId: transaction.courseId,
        },
      });
    } else {
      return NextResponse.json({ message: "Failed to create course enrollment" }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: transaction.userId },
      data: {
        balance: {
          decrement: transaction.amount,
        },
      },
    });

    return NextResponse.json({ message: "Success", data: transaction }, { status: 201 });
  } catch (error) {
    console.error("Error in GET /api/categories", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
};
