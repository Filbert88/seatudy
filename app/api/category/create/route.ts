import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  if (req.method !== "POST") {
    return new NextResponse(`Method ${req.method} Not Allowed`, { status: 405 });
  }

  try {
    const body = await req.json();

    const { name }: { name: string } = body;

    const category = await prisma.courseCategory.create({
      data: {
        name,
      },
    });

    return NextResponse.json({ message: "Success", data: category }, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/categories", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
};
