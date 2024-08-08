import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export const POST = async (req: Request) => {
  if (req.method !== "POST") {
    return new NextResponse(`Method ${req.method} Not Allowed`, { status: 405 });
  }

  try {
    const body = await req.json();

    const { name } = body;

    const newData: any = {
      name,
    };

    const category = await prisma.courseCategory.create({
      data: newData,
    });

    return NextResponse.json({ message: "Success", data: category }, { status: 201 });
  } catch (error) {
    console.error("Error in GET /api/categories", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
};
