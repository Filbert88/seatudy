import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options";
import { PrismaClient, TransactionType } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";

const prisma = new PrismaClient();

const transactionSchema = z.object({
  // amount: z.string().min(4, { message: "Amount must be at least 4 digit" }),
  cardNumber: z.string().min(3, { message: "Card number must be at least 3 characters long" }),
  expirationDate: z
    .string()
    .date()
    .refine((date) => new Date(date) > new Date(), { message: "Expiration date must be a future date" }),
  cvc: z.string().min(3, { message: "CVC must be at least 3 characters long" }),
  cardHolderName: z.string().min(3, { message: "Card holder name must be at least 3 characters long" }),
});

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

    const body = await req.json();
    const parsedBody = transactionSchema.safeParse(body);
    if (!parsedBody.success) {
      return NextResponse.json(
        {
          message: "Invalid input",
          errors: parsedBody.error.errors,
        },
        { status: 400 }
      );
    }

    const { cardNumber, expirationDate, cvc, cardHolderName } = parsedBody.data;

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
