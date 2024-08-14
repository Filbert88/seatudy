import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// Get All Categories
export const GET = async () => {
  try {
    const categories = await prisma.courseCategory.findMany();

    if (categories.length == 0) {
      return NextResponse.json({ message: "No categories found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Success", data: categories }, { status: 200 });
  } catch (error) {
    console.error("Error in GET /api/categories", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
};
