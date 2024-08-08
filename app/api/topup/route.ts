import { PrismaClient, TransactionType } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { authOptions } from "../auth/[...nextauth]/auth-options";
import { getServerSession } from "next-auth";

const prisma = new PrismaClient();

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

export const POST = async (req: Request) => {
  if (req.method !== "POST") {
    return new NextResponse(`Method ${req.method} Not Allowed`, { status: 405 });
  }

  const session = await getServerSession({ req, ...authOptions });
  if (!session) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  try {
    const body = await req.json();

    const { amount, cardNumber, expirationDate, cvc, cardHolderName } = body;

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
