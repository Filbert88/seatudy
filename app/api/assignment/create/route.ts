import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options";
import { Role } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface CreateAssignmentData {
  title: string;
  description: string; 
  dueDateOffset?: number;
  courseId: string;
}

export const POST = async (req: Request) => {
  if (req.method !== "POST") {
    return new NextResponse(`Method ${req.method} Not Allowed`, { status: 405 });
  }

  const session = await getServerSession({ req, ...authOptions });
  if (!session) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  if (session.user.role !== Role.INSTRUCTOR) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await req.json();

    const { title, description, dueDateOffset, courseId } = body;

    const newData: CreateAssignmentData = {
      title,
      description,
      dueDateOffset,
      courseId,
    };

    const assignment = await prisma.assignment.create({
      data: newData,
    });

    return NextResponse.json({ message: "Success", data: assignment }, { status: 201 });
  } catch (error) {
    console.error("Error in GET /api/course/[courseId]/assignment/create", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
};
