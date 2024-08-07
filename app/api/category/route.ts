import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";

const prisma = new PrismaClient();

const categorySchema = z.object({
  name: z.string().min(1, { message: "Name must be at least 1 characters long" }),
});

// Get All Categories
export const GET = async (req: Request) => {
  try {
    const categories = await prisma.courseCategory.findMany();

    if (categories.length == 0) {
      return NextResponse.json({ message: "No categories found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Success", data: categories }, { status: 200 });
  } catch (error: any) {
    console.error("Error in GET /api/categories", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
};

export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    const parsedBody = categorySchema.safeParse(body);
    if (!parsedBody.success) {
      return NextResponse.json(
        {
          message: "Invalid input",
          errors: parsedBody.error.errors,
        },
        { status: 400 }
      );
    }

    const { name } = parsedBody.data;

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
