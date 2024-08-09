import { DifficultyLevel, PrismaClient, Role } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { uploadFileToCloudinary } from "@/lib/utils";
import { authOptions } from "../../auth/[...nextauth]/auth-options";

const prisma = new PrismaClient();

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

function stringToDifficulty(difficulty: string): DifficultyLevel {
  const lowerCaseRole = difficulty.toLowerCase();
  if (lowerCaseRole === "beginner") return DifficultyLevel.BEGINNER;
  if (lowerCaseRole === "intermediate") return DifficultyLevel.INTERMEDIATE;
  if (lowerCaseRole === "advanced") return DifficultyLevel.ADVANCED;
  throw new Error("Invalid role");
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
    const formData = await req.formData();
    const title = formData.get("title");
    const description = formData.get("description");
    const syllabus = formData.getAll("syllabus") as string[];
    const skills = formData.getAll("skills") as string[];
    const difficulty = formData.get("difficulty")?.toString() || "";
    const price = formData.get("price");
    const categoryNames = formData.getAll("categoryNames") as string[];

    let generatedUrl = null;
    const file = formData.get("file");
    if (file && file instanceof File) {
      generatedUrl = await uploadFileToCloudinary(file);
    } else if (file) {
      return NextResponse.json({ message: "Invalid File Type" }, { status: 400 });
    }
    console.log(file);
    console.log(generatedUrl);
    console.log(formData);

    const categories = await Promise.all(
      categoryNames.map(async (name) => {
        const category = await prisma.courseCategory.upsert({
          where: {
            name: name.toLowerCase(),
          },
          update: {},
          create: { name: name.toLowerCase() },
        });
        return category.id;
      })
    );

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

    if (categories.length > 0) {
      await prisma.courseCategoryCourse.createMany({
        data: categories.map((categoryId) => ({
          courseId: course.id,
          categoryId: categoryId,
        })),
      });
    }

    return NextResponse.json({ message: "Success", data: course }, { status: 201 });
  } catch (error: any) {
    console.error("Error in POST /api/course", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
};
