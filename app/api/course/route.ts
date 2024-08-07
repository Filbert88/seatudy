import { DifficultyLevel, PrismaClient, Role } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/auth-options";
import { z } from "zod";
import { uploadFileToCloudinary } from "@/lib/utils";

const prisma = new PrismaClient();

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

const courseSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters long" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters long" }),
  syllabus: z.array(z.string().min(3, { message: "Syllabus must be at least 3 characters long" })),
  skills: z.array(z.string().min(3, { message: "Skills must be at least 3 characters long" })),
  difficulty: z.string().min(1, { message: "Difficulty must be inputted" }),
  price: z.string().min(0, { message: "Price must be at least 0" }),
});

function stringToDifficulty(difficulty: string): DifficultyLevel {
  const lowerCaseRole = difficulty.toLowerCase();
  if (lowerCaseRole === "beginner") return DifficultyLevel.BEGINNER;
  if (lowerCaseRole === "intermediate") return DifficultyLevel.INTERMEDIATE;
  if (lowerCaseRole === "advanced") return DifficultyLevel.ADVANCED;
  throw new Error("Invalid role");
}

// Get All Courses
export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url);

  const title = searchParams.get("title");
  const categoryId = searchParams.get("categoryId");
  const difficulty = searchParams.get("difficulty") as DifficultyLevel;
  const rating = searchParams.get("rating");

  try {
    const courses = await prisma.course.findMany({
      where: {
        title: title
          ? {
              contains: title,
              mode: "insensitive",
            }
          : undefined,
        categories: categoryId
          ? {
              some: {
                categoryId: categoryId,
              },
            }
          : undefined,
        difficulty: difficulty ? difficulty : undefined,
        averageRating: rating ? parseFloat(rating) : undefined,
      },
      include: {
        enrollments: true,
        materials: true,
        categories: {
          include: {
            category: true,
          },
        },
        transactions: true,
      },
    });

    if (courses.length == 0) {
      return NextResponse.json({ message: "No courses found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Success", data: courses }, { status: 200 });
  } catch (error: any) {
    console.error("Error in GET /api/course", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
};

export const POST = async (req: Request) => {
  try {
    const session = await getServerSession({ req, ...authOptions });
    if (!session) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }

    if (session.user.role !== Role.INSTRUCTOR) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const formData = await req.formData();
    console.log(formData);
    const title = formData.get("title");
    const description = formData.get("description");
    const syllabus = formData.getAll("syllabus") as string[];
    const skills = formData.getAll("skills") as string[];
    const difficulty = formData.get("difficulty")?.toString() || "";
    const price = formData.get("price");

    const parsedBody = courseSchema.safeParse({ title, description, syllabus, skills, difficulty, price });
    console.log(parsedBody);
    if (!parsedBody.success) {
      return NextResponse.json(
        {
          message: "Invalid input",
          errors: parsedBody.error.errors,
        },
        { status: 400 }
      );
    }

    let generatedUrl = null;
    const file = formData.get("file");
    if (file && file instanceof File) {
      generatedUrl = await uploadFileToCloudinary(file);
    } else if (file) {
      return NextResponse.json({ message: "Invalid File Type" }, { status: 400 });
    }
    console.log(file);

    const newData: any = {
      title,
      description,
      syllabus,
      thumbnailUrl: generatedUrl,
      skills,
      instructorId: session.user.id,
      difficulty: stringToDifficulty(difficulty),
      price,
    };

    const course = await prisma.course.create({
      data: newData,
    });

    return NextResponse.json({ message: "Success", data: course }, { status: 201 });
  } catch (error: any) {
    console.error("Error in POST /api/course", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
};
