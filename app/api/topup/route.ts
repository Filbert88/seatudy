import { PrismaClient, TransactionType } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { authOptions } from "../auth/[...nextauth]/auth-options";
import { getServerSession } from "next-auth";

const prisma = new PrismaClient();

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

const transactionSchema = z.object({
  amount: z.string().min(4, { message: "Amount must be at least 4 digit" }),
  cardNumber: z.string().min(3, { message: "Card number must be at least 3 characters long" }),
  expirationDate: z
    .string()
    .date()
    .refine((date) => new Date(date) > new Date(), { message: "Expiration date must be a future date" }),
  cvc: z.string().min(3, { message: "CVC must be at least 3 characters long" }),
  cardHolderName: z.string().min(3, { message: "Card holder name must be at least 3 characters long" }),
});

export const POST = async (req: Request) => {
  try {
    const session = await getServerSession({ req, ...authOptions });
    if (!session) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
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

    const { amount, cardNumber, expirationDate, cvc, cardHolderName } = parsedBody.data;

    const newData: any = {
      userId: session.user.id,
      amount,
      cardNumber,
      expirationDate,
      cvc,
      cardHolderName,
      type: TransactionType.DEPOSIT,
    };

    const transaction = await prisma.transaction.create({
      data: newData,
    });

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        balance: {
          increment: transaction.amount,
        },
      },
    });

    return NextResponse.json({ message: "Success", data: transaction }, { status: 201 });
  } catch (error) {
    console.error("Error in GET /api/categories", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
};
