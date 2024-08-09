import { DifficultyLevel, PrismaClient, Role } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { uploadFileToCloudinary } from "@/lib/utils";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options";

const prisma = new PrismaClient();

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

function stringToDifficulty(difficulty: string): DifficultyLevel {
  const lowerCaseRole = difficulty.toLowerCase();
  if (lowerCaseRole === "beginner") return DifficultyLevel.BEGINNER;
  if (lowerCaseRole === "intermediate") return DifficultyLevel.INTERMEDIATE;
  if (lowerCaseRole === "advanced") return DifficultyLevel.ADVANCED;
  throw new Error("Invalid difficulty level");
}

export const POST = async (req: Request, { params }: { params: { courseId: string } }) => {
  if (req.method !== "POST") {
    return new NextResponse(`Method ${req.method} Not Allowed`, { status: 405 });
  }

  const courseId = params.courseId;

  const session = await getServerSession({ req, ...authOptions });
  if (!session) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  if (session.user.role !== Role.INSTRUCTOR) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  try {
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return NextResponse.json({ message: "Course not found" }, { status: 404 });
    }

    if (course.instructorId !== session.user.id) {
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
    const categoryNames = formData.getAll("categoryNames") as string[];

    const updateData: any = {};

    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (syllabus.length > 0) updateData.syllabus = syllabus;
    if (skills.length > 0) updateData.skills = skills;
    if (difficulty) updateData.difficulty = stringToDifficulty(difficulty);
    if (price) updateData.price = price;

    let generatedUrl = course.thumbnailUrl;
    const file = formData.get("file");
    if (file && file instanceof File) {
      generatedUrl = await uploadFileToCloudinary(file);
      updateData.thumbnailUrl = generatedUrl;
    } else if (file) {
      return NextResponse.json({ message: "Invalid File Type" }, { status: 400 });
    }
    console.log(file);

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

    const updateCourse = await prisma.course.update({
      where: { id: courseId },
      data: {
        ...updateData,
        updatedAt: new Date(),
      },
    });

    if (categories.length > 0) {
      await prisma.courseCategoryCourse.deleteMany({
        where: { courseId: courseId },
      });

      await prisma.courseCategoryCourse.createMany({
        data: categories.map((categoryId) => ({
          courseId: courseId,
          categoryId: categoryId,
        })),
      });
    }

    return NextResponse.json({ message: "Success", data: updateCourse }, { status: 201 });
  } catch (error: any) {
    console.error("Error in POST /api/course", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
};
